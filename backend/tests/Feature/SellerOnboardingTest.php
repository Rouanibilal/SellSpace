<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SellerOnboardingTest extends TestCase
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

    public function test_customer_can_become_a_seller(): void
    {
        $customer = $this->userWithRole('customer');

        $response = $this->actingAs($customer, 'web')
            ->postJson('/api/seller-onboarding');

        $response->assertOk()
            ->assertJsonPath(
                'message',
                'You are now registered as a seller.'
            )
            ->assertJsonFragment(['slug' => 'customer'])
            ->assertJsonFragment(['slug' => 'seller']);

        $this->assertTrue($customer->fresh()->hasRole('customer'));
        $this->assertTrue($customer->fresh()->hasRole('seller'));
    }

    public function test_onboarding_does_not_duplicate_seller_role(): void
    {
        $customer = $this->userWithRole('customer');

        $this->actingAs($customer, 'web')
            ->postJson('/api/seller-onboarding')
            ->assertOk();

        $response = $this->postJson('/api/seller-onboarding');

        $response->assertOk()
            ->assertJsonPath(
                'message',
                'You are already a seller.'
            );

        $this->assertSame(
            2,
            $customer->fresh()->roles()->count()
        );
    }

    public function test_admin_cannot_use_customer_seller_onboarding(): void
    {
        $admin = $this->userWithRole('admin');

        $this->actingAs($admin, 'web')
            ->postJson('/api/seller-onboarding')
            ->assertForbidden();

        $this->assertFalse($admin->fresh()->hasRole('seller'));
    }

    public function test_unauthenticated_user_cannot_become_a_seller(): void
    {
        $this->postJson('/api/seller-onboarding')
            ->assertUnauthorized();
    }
}
