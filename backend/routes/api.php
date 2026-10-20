<?php

use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\WishlistController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function (): void {
    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');

    Route::post('orders', [OrderController::class, 'store'])
        ->middleware('throttle:orders')
        ->name('orders.store');

    Route::prefix('auth')->name('auth.')->group(function (): void {
        Route::post('register', [AuthController::class, 'register'])->middleware('throttle:auth')->name('register');
        Route::post('login', [AuthController::class, 'login'])->middleware('throttle:auth')->name('login');
        Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('logout');
    });

    Route::middleware('auth:sanctum')->prefix('account')->name('account.')->group(function (): void {
        Route::get('/', [AccountController::class, 'show'])->name('show');
        Route::get('orders', [AccountController::class, 'orders'])->name('orders');
        Route::get('wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::put('wishlist/{product}', [WishlistController::class, 'store'])->name('wishlist.store');
        Route::delete('wishlist/{product}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
    });
});
