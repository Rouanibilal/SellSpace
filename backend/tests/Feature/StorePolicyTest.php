<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class StorePolicyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
    }

    public function test_seller_can_update_their_own_store(): void
    {
        $seller = User::factory()->create();
        $seller->roles()->attach(
            Role::where('slug', 'seller')->firstOrFail()
        );

        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Seller One Store',
            'slug' => 'seller-one-store',
        ]);

        $this->assertTrue(
            Gate::forUser($seller)->allows('update', $store)
        );
    }

    public function test_seller_cannot_update_another_sellers_store(): void
    {
        $sellerOne = User::factory()->create();
        $sellerOne->roles()->attach(
            Role::where('slug', 'seller')->firstOrFail()
        );

        $sellerTwo = User::factory()->create();
        $sellerTwo->roles()->attach(
            Role::where('slug', 'seller')->firstOrFail()
        );

        $store = Store::create([
            'user_id' => $sellerOne->id,
            'name' => 'Seller One Store',
            'slug' => 'seller-one-store',
        ]);

        $this->assertFalse(
            Gate::forUser($sellerTwo)->allows('update', $store)
        );
    }

    public function test_customer_cannot_create_a_store(): void
    {
        $customer = User::factory()->create();
        $customer->roles()->attach(
            Role::where('slug', 'customer')->firstOrFail()
        );

        $this->assertFalse(
            Gate::forUser($customer)->allows('create', Store::class)
        );
    }

    public function test_admin_can_update_any_store(): void
    {
        $admin = User::factory()->create();
        $admin->roles()->attach(
            Role::where('slug', 'admin')->firstOrFail()
        );

        $seller = User::factory()->create();

        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Seller Store',
            'slug' => 'seller-store',
        ]);

        $this->assertTrue(
            Gate::forUser($admin)->allows('update', $store)
        );
    }
}
