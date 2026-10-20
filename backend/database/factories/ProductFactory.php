<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'slug' => fake()->unique()->slug(3),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(12),
            'material' => 'Sterling silver',
            'price' => fake()->numberBetween(90, 500),
            'compare_at_price' => null,
            'stock' => 20,
            'images' => null,
            'is_new' => false,
            'is_bestseller' => false,
            'is_featured' => false,
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => ['is_active' => false]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (): array => ['stock' => 0]);
    }
}
