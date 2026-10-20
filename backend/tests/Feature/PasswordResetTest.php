<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_reset_link_pointing_to_the_storefront_is_emailed(): void
    {
        Notification::fake();
        config(['store.frontend_url' => 'https://velora.test']);
        $user = User::factory()->create(['email' => 'salma@example.com']);

        $this->postJson(route('api.v1.auth.password.email'), ['email' => 'Salma@Example.com'])->assertOk();

        Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification) use ($user): bool {
            $url = $notification->toMail($user)->actionUrl;

            return str_starts_with($url, 'https://velora.test/reset-password?token=')
                && str_contains($url, 'email=salma%40example.com');
        });
    }

    public function test_unknown_emails_get_the_same_response(): void
    {
        Notification::fake();

        $this->postJson(route('api.v1.auth.password.email'), ['email' => 'nobody@example.com'])
            ->assertOk()
            ->assertJsonPath('message', 'If an account exists for this email, a reset link is on its way.');

        Notification::assertNothingSent();
    }

    public function test_password_can_be_reset_with_a_valid_token_and_signs_out_other_sessions(): void
    {
        $user = User::factory()->create(['email' => 'salma@example.com']);
        $user->createToken('old-session');
        $token = Password::createToken($user);

        $this->postJson(route('api.v1.auth.password.reset'), [
            'token' => $token,
            'email' => 'salma@example.com',
            'password' => 'brand-new-pass-1',
            'password_confirmation' => 'brand-new-pass-1',
        ])->assertOk();

        $this->assertTrue(Hash::check('brand-new-pass-1', $user->fresh()->password));
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_an_invalid_token_is_rejected(): void
    {
        User::factory()->create(['email' => 'salma@example.com']);

        $this->postJson(route('api.v1.auth.password.reset'), [
            'token' => 'not-a-real-token',
            'email' => 'salma@example.com',
            'password' => 'brand-new-pass-1',
            'password_confirmation' => 'brand-new-pass-1',
        ])->assertUnprocessable()->assertJsonValidationErrors('email');
    }
}
