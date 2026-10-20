<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Tells the Next.js storefront to drop its cached catalog, so admin edits
 * show up on the next page load instead of after the cache expires.
 */
class StorefrontCache
{
    /**
     * Request a refresh once the current database transaction has committed.
     * Failures are logged but never interrupt the admin.
     */
    public static function refresh(): void
    {
        DB::afterCommit(static function (): void {
            $secret = config('store.frontend_revalidate_secret');

            if (blank($secret)) {
                return;
            }

            $baseUrl = rtrim(explode(',', (string) config('store.frontend_url'))[0], '/');

            try {
                Http::timeout(3)
                    ->withHeaders(['X-Revalidate-Secret' => $secret])
                    ->post("{$baseUrl}/api/revalidate")
                    ->throw();
            } catch (Throwable $exception) {
                Log::warning('Could not refresh the storefront cache.', ['error' => $exception->getMessage()]);
            }
        });
    }
}
