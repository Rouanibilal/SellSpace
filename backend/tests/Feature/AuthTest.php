<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

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

    public function test_user_can_register(): void
    {
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
}
