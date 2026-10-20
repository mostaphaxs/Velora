<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Shipping
    |--------------------------------------------------------------------------
    |
    | Amounts are whole Moroccan dirhams (MAD). Orders at or above the free
    | shipping threshold ship for free; everything else pays the flat cost.
    |
    */

    'free_shipping_threshold' => (int) env('STORE_FREE_SHIPPING_THRESHOLD', 500),

    'shipping_cost' => (int) env('STORE_SHIPPING_COST', 30),

    /*
    |--------------------------------------------------------------------------
    | Order limits
    |--------------------------------------------------------------------------
    */

    'max_quantity_per_item' => (int) env('STORE_MAX_QUANTITY_PER_ITEM', 10),

    // Orders still pending after this many days are cancelled and their stock released
    'cancel_pending_after_days' => (int) env('STORE_CANCEL_PENDING_AFTER_DAYS', 3),

    /*
    |--------------------------------------------------------------------------
    | Storefront
    |--------------------------------------------------------------------------
    |
    | The Next.js shop caches the catalog. When products or categories change,
    | the backend asks it to refresh so edits appear on the next page load.
    |
    */

    'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),

    'frontend_revalidate_secret' => env('FRONTEND_REVALIDATE_SECRET'),

];
