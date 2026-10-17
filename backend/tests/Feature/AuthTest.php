<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use App\Models\Role;
use Database\Seeders\RoleSeeder;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    //
    public function test_authenticated_user_can_retrieve_their_profile(): void
    {
        $user = User::factory()->create();

        $response = $this->withHeader(
            'Origin',
            'http://127.0.0.1:3000'
        )->actingAs($user, 'web')
            ->getJson('/api/user');

        $response->assertOk()
            ->assertJsonPath('id', $user->id)
            ->assertJsonPath('email', $user->email)
            ->assertJsonMissingPath('password');
    }

    //register
    public function test_user_can_register(): void
    {
        $this->seed(RoleSeeder::class);

        $response = $this->withHeader(
            'Origin',
            'http://127.0.0.1:3000'
        )->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'StrongPass123!',
            'password_confirmation' => 'StrongPass123!',
        ]);

        $response->assertCreated()
            ->assertJsonPath('user.name', 'Test User')
            ->assertJsonPath('user.email', 'test@example.com')
            ->assertJsonMissingPath('user.password');

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);

        $user = User::where('email', 'test@example.com')->firstOrFail();

        $this->assertTrue(
            $user->roles()->where('slug', 'customer')->exists()
        );

        $this->assertTrue(
            Hash::check('StrongPass123!', $user->password)
        );
    }

    public function test_registration_rejects_invalid_data(): void
    {
        $response = $this->withHeader(
            'Origin',
            'http://127.0.0.1:3000'
        )->postJson('/api/register', [
            'name' => '',
            'email' => 'not-an-email',
            'password' => 'short',
            'password_confirmation' => 'different',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'email',
                'password',
            ]);

        $this->assertDatabaseCount('users', 0);
    }

    public function test_registration_cannot_assign_admin_role(): void
    {
        $this->seed(RoleSeeder::class);

        $response = $this->withHeader(
            'Origin',
            'http://127.0.0.1:3000'
        )->postJson('/api/register', [
            'name' => 'Regular User',
            'email' => 'regular@example.com',
            'password' => 'StrongPass123!',
            'password_confirmation' => 'StrongPass123!',
            'role' => 'admin',
        ]);

        $response->assertCreated();

        $user = User::where('email', 'regular@example.com')->firstOrFail();

        $this->assertTrue(
            $user->roles()->where('slug', 'customer')->exists()
        );

        $this->assertFalse(
            $user->roles()->where('slug', 'admin')->exists()
        );
    }

    //login
    public function test_user_can_log_in(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('StrongPass123!'),
        ]);

        $response = $this->withHeader(
            'Origin',
            'http://127.0.0.1:3000'
        )->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'StrongPass123!',
        ]);

        $response->assertOk()
            ->assertJsonPath('message', 'Logged in successfully.')
            ->assertJsonPath('user.email', $user->email);

        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_log_in_with_wrong_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('StrongPass123!'),
        ]);

        $response = $this->withHeader(
            'Origin',
            'http://127.0.0.1:3000'
        )->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'WrongPassword!',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);

        $this->assertGuest();
    }

    //logout
    public function test_authenticated_user_can_log_out(): void
    {
        $user = User::factory()->create();

        $response = $this->withHeader(
            'Origin',
            'http://127.0.0.1:3000'
        )->actingAs($user, 'web')
            ->postJson('/api/logout');

        $response->assertOk()
            ->assertJsonPath(
                'message',
                'Logged out successfully.'
            );

        $this->assertGuest('web');
    }

    public function test_unauthenticated_user_cannot_log_out(): void
    {
        $response = $this->postJson('/api/logout');

        $response->assertUnauthorized();
    }

    //
    public function test_user_can_be_checked_for_a_role(): void
    {
        $this->seed(RoleSeeder::class);

        $user = User::factory()->create();

        $customerRole = Role::where('slug', 'customer')->firstOrFail();

        $user->roles()->attach($customerRole->id);

        $this->assertTrue($user->hasRole('customer'));
        $this->assertFalse($user->hasRole('admin'));
    }
}
