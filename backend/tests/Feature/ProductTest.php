<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
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

        $user->roles()->attach($role->id);

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

    public function test_seller_can_create_product_in_their_store(): void
    {
        $seller = $this->userWithRole('seller');
        $store = $this->createStore($seller, 'my-store');

        $category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
        ]);

        $response = $this->actingAs($seller, 'web')
            ->postJson("/api/stores/{$store->id}/products", [
                'name' => 'Wireless Headphones',
                'slug' => 'wireless-headphones',
                'price' => 299.00,
                'categories' => [$category->id],
            ]);

        $response->assertCreated()
            ->assertJsonPath('product.name', 'Wireless Headphones')
            ->assertJsonPath('product.store_id', $store->id)
            ->assertJsonPath('product.categories.0.id', $category->id);

        $this->assertDatabaseHas('products', [
            'store_id' => $store->id,
            'slug' => 'wireless-headphones',
        ]);

        $this->assertDatabaseHas('product_categories', [
            'product_id' => $response->json('product.id'),
            'category_id' => $category->id,
        ]);
    }

    public function test_seller_cannot_create_product_in_another_sellers_store(): void
    {
        $seller = $this->userWithRole('seller');
        $otherSeller = $this->userWithRole('seller');

        $otherStore = $this->createStore($otherSeller, 'other-store');

        $this->actingAs($seller, 'web')
            ->postJson("/api/stores/{$otherStore->id}/products", [
                'name' => 'Unauthorized Product',
                'slug' => 'unauthorized-product',
                'price' => 50,
            ])
            ->assertForbidden();

        $this->assertDatabaseMissing('products', [
            'slug' => 'unauthorized-product',
        ]);
    }

    public function test_client_cannot_choose_another_store_for_a_product(): void
    {
        $seller = $this->userWithRole('seller');

        $ownStore = $this->createStore($seller, 'own-store');
        $otherStore = $this->createStore(
            $this->userWithRole('seller'),
            'other-store'
        );

        $response = $this->actingAs($seller, 'web')
            ->postJson("/api/stores/{$ownStore->id}/products", [
                'name' => 'My Product',
                'slug' => 'my-product',
                'price' => 100,
                'store_id' => $otherStore->id,
            ]);

        $response->assertCreated()
            ->assertJsonPath('product.store_id', $ownStore->id);
    }

    public function test_seller_can_list_only_products_in_their_own_store(): void
    {
        $seller = $this->userWithRole('seller');
        $ownStore = $this->createStore($seller, 'own-store');

        $otherStore = $this->createStore(
            $this->userWithRole('seller'),
            'other-store'
        );

        $ownProduct = $this->createProduct($ownStore, 'own-product');

        $this->createProduct($otherStore, 'other-product');

        $response = $this->actingAs($seller, 'web')
            ->getJson("/api/stores/{$ownStore->id}/products");

        $response->assertOk()
            ->assertJsonCount(1, 'products')
            ->assertJsonPath('products.0.id', $ownProduct->id);
    }

    public function test_seller_can_view_and_update_their_own_product(): void
    {
        $seller = $this->userWithRole('seller');
        $store = $this->createStore($seller, 'my-store');

        $product = $this->createProduct($store, 'my-product');

        $this->actingAs($seller, 'web')
            ->getJson("/api/products/{$product->id}")
            ->assertOk()
            ->assertJsonPath('product.id', $product->id);

        $this->actingAs($seller, 'web')
            ->patchJson("/api/products/{$product->id}", [
                'name' => 'Updated Product',
                'price' => 150.00,
            ])
            ->assertOk()
            ->assertJsonPath('product.name', 'Updated Product')
            ->assertJsonPath('product.price', '150.00');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Product',
        ]);
    }

    public function test_seller_cannot_view_or_update_another_sellers_product(): void
    {
        $seller = $this->userWithRole('seller');
        $otherSeller = $this->userWithRole('seller');

        $otherStore = $this->createStore($otherSeller, 'other-store');
        $product = $this->createProduct($otherStore, 'protected-product');

        $this->actingAs($seller, 'web')
            ->getJson("/api/products/{$product->id}")
            ->assertForbidden();

        $this->actingAs($seller, 'web')
            ->patchJson("/api/products/{$product->id}", [
                'name' => 'Unauthorized Update',
            ])
            ->assertForbidden();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Protected-product',
        ]);
    }

    public function test_seller_can_delete_their_own_product(): void
    {
        $seller = $this->userWithRole('seller');
        $store = $this->createStore($seller, 'my-store');

        $product = $this->createProduct($store, 'delete-me');

        $this->actingAs($seller, 'web')
            ->deleteJson("/api/products/{$product->id}")
            ->assertOk()
            ->assertJsonPath(
                'message',
                'Product deleted successfully.'
            );

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }

    public function test_seller_cannot_delete_another_sellers_product(): void
    {
        $seller = $this->userWithRole('seller');
        $otherSeller = $this->userWithRole('seller');

        $otherStore = $this->createStore($otherSeller, 'other-store');
        $product = $this->createProduct($otherStore, 'protected-product');

        $this->actingAs($seller, 'web')
            ->deleteJson("/api/products/{$product->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
        ]);
    }

    public function test_product_creation_rejects_invalid_data(): void
    {
        $seller = $this->userWithRole('seller');
        $store = $this->createStore($seller, 'my-store');

        $this->actingAs($seller, 'web')
            ->postJson("/api/stores/{$store->id}/products", [
                'name' => '',
                'slug' => 'invalid-product',
                'price' => -10,
                'categories' => [999999],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'price',
                'categories.0',
            ]);

        $this->assertDatabaseCount('products', 0);
    }

    public function test_unauthenticated_user_cannot_create_a_product(): void
    {
        $seller = $this->userWithRole('seller');
        $store = $this->createStore($seller, 'my-store');

        $this->postJson("/api/stores/{$store->id}/products", [
            'name' => 'Product',
            'slug' => 'product',
            'price' => 100,
        ])->assertUnauthorized();
    }
}
