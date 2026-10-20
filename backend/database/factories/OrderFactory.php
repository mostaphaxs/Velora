<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_name' => fake()->name(),
            'phone' => '0612345678',
            'city' => 'Casablanca',
            'address' => fake()->streetAddress(),
            'notes' => null,
            'subtotal' => 300,
            'shipping' => 30,
            'total' => 330,
            'status' => OrderStatus::Pending,
        ];
    }
}
