<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class ProductPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
    }

    private function userWithRole(string $slug): User
    {
        $user = User::factory()->create();

        $role = Role::where('slug', $slug)->firstOrFail();

        $user->roles()->attach($role);

        return $user;
    }

    private function createStore(User $owner, string $slug): Store
    {
        return Store::create([
            'user_id' => $owner->id,
            'name' => ucfirst($slug),
            'slug' => $slug,
        ]);
    }

    private function createProduct(Store $store, string $slug): Product
    {
        return $store->products()->create([
            'name' => ucfirst($slug),
            'slug' => $slug,
            'price' => 100.00,
        ]);
    }

    public function test_seller_can_manage_products_in_their_own_store(): void
    {
        $seller = $this->userWithRole('seller');
        $store = $this->createStore($seller, 'seller-store');
        $product = $this->createProduct($store, 'seller-product');

        $this->assertTrue(
            Gate::forUser($seller)->allows(
                'viewAny',
                [Product::class, $store]
            )
        );

        $this->assertTrue(
            Gate::forUser($seller)->allows(
                'create',
                [Product::class, $store]
            )
        );

        $this->assertTrue(
            Gate::forUser($seller)->allows('view', $product)
        );

        $this->assertTrue(
            Gate::forUser($seller)->allows('update', $product)
        );

        $this->assertTrue(
            Gate::forUser($seller)->allows('delete', $product)
        );
    }

    public function test_seller_cannot_manage_another_sellers_products(): void
    {
        $sellerOne = $this->userWithRole('seller');
        $sellerTwo = $this->userWithRole('seller');

        $store = $this->createStore($sellerOne, 'seller-one-store');
        $product = $this->createProduct($store, 'seller-one-product');

        $this->assertFalse(
            Gate::forUser($sellerTwo)->allows(
                'viewAny',
                [Product::class, $store]
            )
        );

        $this->assertFalse(
            Gate::forUser($sellerTwo)->allows(
                'create',
                [Product::class, $store]
            )
        );

        $this->assertFalse(
            Gate::forUser($sellerTwo)->allows('view', $product)
        );

        $this->assertFalse(
            Gate::forUser($sellerTwo)->allows('update', $product)
        );

        $this->assertFalse(
            Gate::forUser($sellerTwo)->allows('delete', $product)
        );
    }

    public function test_admin_can_manage_products_in_any_store(): void
    {
        $admin = $this->userWithRole('admin');
        $seller = $this->userWithRole('seller');

        $store = $this->createStore($seller, 'seller-store');
        $product = $this->createProduct($store, 'seller-product');

        $this->assertTrue(
            Gate::forUser($admin)->allows(
                'viewAny',
                [Product::class, $store]
            )
        );

        $this->assertTrue(
            Gate::forUser($admin)->allows(
                'create',
                [Product::class, $store]
            )
        );

        $this->assertTrue(
            Gate::forUser($admin)->allows('view', $product)
        );

        $this->assertTrue(
            Gate::forUser($admin)->allows('update', $product)
        );

        $this->assertTrue(
            Gate::forUser($admin)->allows('delete', $product)
        );
    }

    public function test_customer_cannot_manage_store_products(): void
    {
        $customer = $this->userWithRole('customer');
        $store = $this->createStore(
            $this->userWithRole('seller'),
            'seller-store'
        );
        $product = $this->createProduct($store, 'seller-product');

        $this->assertFalse(
            Gate::forUser($customer)->allows(
                'viewAny',
                [Product::class, $store]
            )
        );

        $this->assertFalse(
            Gate::forUser($customer)->allows(
                'create',
                [Product::class, $store]
            )
        );

        $this->assertFalse(
            Gate::forUser($customer)->allows('view', $product)
        );

        $this->assertFalse(
            Gate::forUser($customer)->allows('update', $product)
        );

        $this->assertFalse(
            Gate::forUser($customer)->allows('delete', $product)
        );
    }
}
