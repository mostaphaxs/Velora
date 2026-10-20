<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_register_and_receives_a_token(): void
    {
        $this->postJson(route('api.v1.auth.register'), [
            'name' => 'Salma Benali',
            'email' => 'Salma@Example.com',
            'password' => 'secret-pass-123',
            'password_confirmation' => 'secret-pass-123',
        ])
            ->assertCreated()
            ->assertJsonStructure(['token', 'user' => ['name', 'email']])
            ->assertJsonPath('user.email', 'salma@example.com');

        $this->assertSame(UserRole::Customer, User::first()->role);
    }

    public function test_registration_cannot_grant_admin_role(): void
    {
        $this->postJson(route('api.v1.auth.register'), [
            'name' => 'Sneaky',
            'email' => 'sneaky@example.com',
            'password' => 'secret-pass-123',
            'password_confirmation' => 'secret-pass-123',
            'role' => 'admin',
        ])->assertCreated();

        $this->assertFalse(User::first()->isAdmin());
    }

    public function test_customer_can_log_in_with_valid_credentials(): void
    {
        User::factory()->create(['email' => 'salma@example.com', 'password' => 'secret-pass-123']);

        $this->postJson(route('api.v1.auth.login'), [
            'email' => 'salma@example.com',
            'password' => 'secret-pass-123',
        ])
            ->assertOk()
            ->assertJsonStructure(['token']);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create(['email' => 'salma@example.com']);

        $this->postJson(route('api.v1.auth.login'), [
            'email' => 'salma@example.com',
            'password' => 'wrong-password',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_account_endpoints_require_authentication(): void
    {
        $this->getJson(route('api.v1.account.show'))->assertUnauthorized();
        $this->getJson(route('api.v1.account.orders'))->assertUnauthorized();
    }

    public function test_customer_only_sees_their_own_orders(): void
    {
        $user = User::factory()->create();
        Order::factory()->for($user)->create(['reference' => 'VEL-MINE01']);
        Order::factory()->for(User::factory())->create(['reference' => 'VEL-OTHER1']);

        $this->actingAs($user, 'sanctum')
            ->getJson(route('api.v1.account.orders'))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.reference', 'VEL-MINE01');
    }

    public function test_logout_revokes_the_current_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('storefront')->plainTextToken;

        $this->withToken($token)->postJson(route('api.v1.auth.logout'))->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
