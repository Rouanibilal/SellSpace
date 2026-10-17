<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Store $store)
    {
        Gate::authorize('viewAny', [Product::class, $store]);

        return response()->json([
            'products' => $store->products()
                ->with('categories')
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request, Store $store)
    {
        Gate::authorize('create', [Product::class, $store]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'alpha_dash',
                'max:255',
                Rule::unique('products', 'slug')
                    ->where('store_id', $store->id),
            ],
            'description' => ['nullable', 'string', 'max:5000'],
            'price' => ['required', 'numeric', 'min:0', 'max:9999999999.99'],
            'currency' => ['sometimes', 'required', 'string', 'size:3'],
            'status' => ['sometimes', 'required', Rule::in(['draft', 'published'])],
            'categories' => ['sometimes', 'array'],
            'categories.*' => [
                'integer',
                'distinct',
                'exists:categories,id',
            ],
        ]);

        $product = DB::transaction(function () use ($validated, $store) {
            $product = $store->products()->create([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'description' => $validated['description'] ?? null,
                'price' => $validated['price'],
                'currency' => $validated['currency'] ?? 'MAD',
                'status' => $validated['status'] ?? 'draft',
            ]);

            if (isset($validated['categories'])) {
                $product->categories()->sync($validated['categories']);
            }

            return $product;
        });

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => $product->load('categories'),
        ], 201);
    }

    public function show(Product $product)
    {
        Gate::authorize('view', $product);

        return response()->json([
            'product' => $product->load('categories'),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        Gate::authorize('update', $product);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'alpha_dash',
                'max:255',
                Rule::unique('products', 'slug')
                    ->where('store_id', $product->store_id)
                    ->ignore($product->id),
            ],
            'description' => [
                'sometimes',
                'nullable',
                'string',
                'max:5000',
            ],
            'price' => [
                'sometimes',
                'required',
                'numeric',
                'min:0',
                'max:9999999999.99',
            ],
            'currency' => ['sometimes', 'required', 'string', 'size:3'],
            'status' => [
                'sometimes',
                'required',
                Rule::in(['draft', 'published']),
            ],
            'categories' => ['sometimes', 'array'],
            'categories.*' => [
                'integer',
                'distinct',
                'exists:categories,id',
            ],
        ]);

        DB::transaction(function () use ($validated, $product) {
            $product->update(collect($validated)->except('categories')->all());

            if (array_key_exists('categories', $validated)) {
                $product->categories()->sync($validated['categories']);
            }
        });

        return response()->json([
            'message' => 'Product updated successfully.',
            'product' => $product->refresh()->load('categories'),
        ]);
    }

    public function destroy(Product $product)
    {
        Gate::authorize('delete', $product);

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }
}
