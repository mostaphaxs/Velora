<?php

namespace App\Observers;

use App\Support\StorefrontCache;
use Illuminate\Database\Eloquent\Model;

/**
 * Keeps the storefront in sync whenever a product or category changes.
 */
class CatalogObserver
{
    public function saved(Model $model): void
    {
        StorefrontCache::refresh();
    }

    public function deleted(Model $model): void
    {
        StorefrontCache::refresh();
    }
}
