<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreController extends Controller
{
    public function store(Request $request)
    {
        Gate::authorize('create', Store::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'alpha_dash',
                'max:255',
                'unique:stores,slug',
            ],
            'description' => ['nullable', 'string', 'max:5000'],
        ]);

        $store = Store::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'message' => 'Store created successfully.',
            'store' => $store,
        ], 201);
    }

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Store::class);

        $query = Store::query()->latest();

        if (! $request->user()->hasRole('admin')) {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json([
            'stores' => $query->get(),
        ]);
    }

    public function show(Store $store)
    {
        Gate::authorize('view', $store);

        return response()->json([
            'store' => $store,
        ]);
    }

    public function update(Request $request, Store $store)
    {
        Gate::authorize('update', $store);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'alpha_dash',
                'max:255',
                Rule::unique('stores', 'slug')->ignore($store->id),
            ],
            'description' => [
                'sometimes',
                'nullable',
                'string',
                'max:5000',
            ],
        ]);

        $store->update($validated);

        return response()->json([
            'message' => 'Store updated successfully.',
            'store' => $store->refresh(),
        ]);
    }

    public function destroy(Store $store)
    {
        Gate::authorize('delete', $store);

        $store->delete();

        return response()->json([
            'message' => 'Store deleted successfully.',
        ]);
    }
}
