<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Replace the single product photo with an ordered gallery, keeping existing photos.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('images')->nullable()->after('stock');
        });

        DB::table('products')->whereNotNull('image')->orderBy('id')->each(function (object $product): void {
            DB::table('products')->where('id', $product->id)->update([
                'images' => json_encode([$product->image]),
            ]);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('image');
        });
    }

    /**
     * Reverse the migrations, keeping the first photo of each gallery.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('image')->nullable()->after('stock');
        });

        DB::table('products')->whereNotNull('images')->orderBy('id')->each(function (object $product): void {
            DB::table('products')->where('id', $product->id)->update([
                'image' => json_decode($product->images, true)[0] ?? null,
            ]);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('images');
        });
    }
};
