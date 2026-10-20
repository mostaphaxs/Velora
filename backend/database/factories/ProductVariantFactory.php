<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'name' => fake()->unique()->randomElement(['Gold', 'Silver', 'Rose gold', 'Black', 'Beige', 'Brown']),
            'hex' => fake()->hexColor(),
            'stock' => 10,
            'images' => null,
            'sort_order' => 0,
        ];
    }
}
