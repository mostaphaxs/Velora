<?php

namespace App\Console\Commands;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

#[Signature('velora:create-admin {--email= : Email of the admin account}')]
#[Description('Create a store administrator, or promote an existing user to admin')]
class CreateAdmin extends Command
{
    public function handle(): int
    {
        $email = strtolower(trim($this->option('email') ?: text('Admin email', required: true)));

        if (Validator::make(['email' => $email], ['email' => ['required', 'email']])->fails()) {
            $this->error('Please enter a valid email address.');

            return self::FAILURE;
        }

        $user = User::firstWhere('email', $email);

        if ($user !== null) {
            $user->role = UserRole::Admin;
            $user->save();
            $this->info("{$email} is now an admin.");

            return self::SUCCESS;
        }

        $name = text('Name', required: true);
        $secret = password('Password (min. 8 characters)', required: true);

        $validator = Validator::make(['password' => $secret], ['password' => ['required', Password::defaults()]]);

        if ($validator->fails()) {
            $this->error($validator->errors()->first('password'));

            return self::FAILURE;
        }

        $user = User::create(['name' => $name, 'email' => $email, 'password' => $secret]);
        $user->role = UserRole::Admin;
        $user->save();

        $this->info("Admin {$email} created. Sign in at ".url('/admin'));

        return self::SUCCESS;
    }
}
