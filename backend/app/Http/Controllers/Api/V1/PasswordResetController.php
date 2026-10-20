<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    /**
     * Email a reset link. The response is the same whether or not the account exists,
     * so this can't be used to find out who has an account.
     */
    public function sendLink(ForgotPasswordRequest $request): JsonResponse
    {
        Password::sendResetLink(['email' => strtolower($request->validated('email'))]);

        return response()->json([
            'message' => 'If an account exists for this email, a reset link is on its way.',
        ]);
    }

    /**
     * @throws ValidationException
     */
    public function reset(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            [...$request->validated(), 'email' => strtolower($request->validated('email'))],
            function (User $user, string $password): void {
                $user->forceFill(['password' => $password])->save();
                // Sign the account out everywhere, in case someone else had access
                $user->tokens()->delete();

                event(new PasswordReset($user));
            },
        );

        if ($status !== Password::PasswordReset) {
            throw ValidationException::withMessages([
                'email' => 'This reset link is invalid or has expired. Please request a new one.',
            ]);
        }

        return response()->json(['message' => 'Your password has been changed. You can sign in now.']);
    }
}
