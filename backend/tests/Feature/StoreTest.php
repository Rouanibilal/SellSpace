<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreTest extends TestCase
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

    public function test_seller_can_create_a_store(): void
    {
        $seller = $this->userWithRole('seller');

        $response = $this->actingAs($seller, 'web')
            ->postJson('/api/stores', [
                'name' => 'My Store',
                'slug' => 'my-store',
                'description' => 'My first SellSpace store.',
            ]);

        $response->assertCreated()
            ->assertJsonPath('store.name', 'My Store')
            ->assertJsonPath('store.user_id', $seller->id);

        $this->assertDatabaseHas('stores', [
            'user_id' => $seller->id,
            'slug' => 'my-store',
        ]);
    }

    public function test_customer_cannot_create_a_store(): void
    {
        $customer = $this->userWithRole('customer');

        $response = $this->actingAs($customer, 'web')
            ->postJson('/api/stores', [
                'name' => 'Customer Store',
                'slug' => 'customer-store',
            ]);

        $response->assertForbidden();

        $this->assertDatabaseMissing('stores', [
            'slug' => 'customer-store',
        ]);
    }

    public function test_store_owner_comes_from_authenticated_user(): void
    {
        $seller = $this->userWithRole('seller');
        $otherUser = User::factory()->create();

        $response = $this->actingAs($seller, 'web')
            ->postJson('/api/stores', [
                'name' => 'My Store',
                'slug' => 'trusted-owner-store',
                'user_id' => $otherUser->id,
            ]);

        $response->assertCreated()
            ->assertJsonPath('store.user_id', $seller->id);

        $this->assertDatabaseHas('stores', [
            'slug' => 'trusted-owner-store',
            'user_id' => $seller->id,
        ]);
    }

    public function test_store_creation_validates_required_fields(): void
    {
        $seller = $this->userWithRole('seller');

        $response = $this->actingAs($seller, 'web')
            ->postJson('/api/stores', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'slug']);

        $this->assertDatabaseCount('stores', 0);
    }

    public function test_unauthenticated_user_cannot_create_a_store(): void
    {
        $response = $this->postJson('/api/stores', [
            'name' => 'Unauthorized Store',
            'slug' => 'unauthorized-store',
        ]);

        $response->assertUnauthorized();
    }

    public function test_seller_can_list_only_their_own_stores(): void
    {
        $seller = $this->userWithRole('seller');
        $otherSeller = $this->userWithRole('seller');

        $ownStore = Store::create([
            'user_id' => $seller->id,
            'name' => 'My Store',
            'slug' => 'my-store',
        ]);

        Store::create([
            'user_id' => $otherSeller->id,
            'name' => 'Other Store',
            'slug' => 'other-store',
        ]);

        $response = $this->actingAs($seller, 'web')
            ->getJson('/api/stores');

        $response->assertOk()
            ->assertJsonCount(1, 'stores')
            ->assertJsonPath('stores.0.id', $ownStore->id);
    }

    public function test_seller_can_view_their_own_store(): void
    {
        $seller = $this->userWithRole('seller');

        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'My Store',
            'slug' => 'view-my-store',
        ]);

        $this->actingAs($seller, 'web')
            ->getJson("/api/stores/{$store->id}")
            ->assertOk()
            ->assertJsonPath('store.id', $store->id);
    }

    public function test_seller_cannot_view_another_sellers_store(): void
    {
        $seller = $this->userWithRole('seller');
        $otherSeller = $this->userWithRole('seller');

        $store = Store::create([
            'user_id' => $otherSeller->id,
            'name' => 'Private Store',
            'slug' => 'private-store',
        ]);

        $this->actingAs($seller, 'web')
            ->getJson("/api/stores/{$store->id}")
            ->assertForbidden();
    }

    public function test_seller_can_update_their_own_store(): void
    {
        $seller = $this->userWithRole('seller');

        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Original Name',
            'slug' => 'original-name',
        ]);

        $this->actingAs($seller, 'web')
            ->patchJson("/api/stores/{$store->id}", [
                'name' => 'Updated Name',
            ])
            ->assertOk()
            ->assertJsonPath('store.name', 'Updated Name');
    }

    public function test_seller_cannot_update_another_sellers_store(): void
    {
        $seller = $this->userWithRole('seller');
        $otherSeller = $this->userWithRole('seller');

        $store = Store::create([
            'user_id' => $otherSeller->id,
            'name' => 'Original Name',
            'slug' => 'protected-store',
        ]);

        $this->actingAs($seller, 'web')
            ->patchJson("/api/stores/{$store->id}", [
                'name' => 'Unauthorized Change',
            ])
            ->assertForbidden();

        $this->assertDatabaseHas('stores', [
            'id' => $store->id,
            'name' => 'Original Name',
        ]);
    }

    public function test_store_update_rejects_a_duplicate_slug(): void
    {
        $seller = $this->userWithRole('seller');

        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'First Store',
            'slug' => 'first-store',
        ]);

        Store::create([
            'user_id' => $seller->id,
            'name' => 'Second Store',
            'slug' => 'second-store',
        ]);

        $this->actingAs($seller, 'web')
            ->patchJson("/api/stores/{$store->id}", [
                'slug' => 'second-store',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_seller_can_delete_their_own_store(): void
    {
        $seller = $this->userWithRole('seller');

        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'My Store',
            'slug' => 'delete-my-store',
        ]);

        $this->actingAs($seller, 'web')
            ->deleteJson("/api/stores/{$store->id}")
            ->assertOk()
            ->assertJsonPath('message', 'Store deleted successfully.');

        $this->assertDatabaseMissing('stores', [
            'id' => $store->id,
        ]);
    }

    public function test_seller_cannot_delete_another_sellers_store(): void
    {
        $seller = $this->userWithRole('seller');
        $otherSeller = $this->userWithRole('seller');

        $store = Store::create([
            'user_id' => $otherSeller->id,
            'name' => 'Protected Store',
            'slug' => 'protected-delete-store',
        ]);

        $this->actingAs($seller, 'web')
            ->deleteJson("/api/stores/{$store->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('stores', [
            'id' => $store->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_delete_a_store(): void
    {
        $seller = $this->userWithRole('seller');

        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Protected Store',
            'slug' => 'unauthenticated-delete-store',
        ]);

        $this->deleteJson("/api/stores/{$store->id}")
            ->assertUnauthorized();
    }
}
