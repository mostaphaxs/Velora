<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('description');
            $table->string('material');
            $table->unsignedInteger('price');
            $table->unsignedInteger('compare_at_price')->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->string('image')->nullable();
            $table->boolean('is_new')->default(false);
            $table->boolean('is_bestseller')->default(false);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
