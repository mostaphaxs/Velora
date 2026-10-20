<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Surface accidental N+1 queries while developing and testing
        Model::preventLazyLoading(! $this->app->isProduction());

        // Reset emails link to the storefront's reset page, not to this API
        ResetPassword::createUrlUsing(function (User $user, string $token): string {
            $storefront = rtrim(explode(',', (string) config('store.frontend_url'))[0], '/');

            return $storefront.'/reset-password?'.http_build_query(['token' => $token, 'email' => $user->email]);
        });

        RateLimiter::for('orders', fn (Request $request): Limit => Limit::perMinute(5)->by($request->user()?->id ?: $request->ip()));

        RateLimiter::for('auth', fn (Request $request): Limit => Limit::perMinute(10)->by($request->ip()));
    }
}
