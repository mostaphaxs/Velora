<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlaceOrderTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @param  array<int, array{slug: string, quantity: int}>  $items
     * @return array<string, mixed>
     */
    private function checkout(array $items, array $overrides = []): array
    {
        return [
            'customer_name' => 'Salma Benali',
            'phone' => '06 12 34 56 78',
            'city' => 'Rabat',
            'address' => '12 Rue Oued Fes, Agdal',
            'items' => $items,
            ...$overrides,
        ];
    }

    public function test_guest_can_place_an_order_with_server_side_totals(): void
    {
        $ring = Product::factory()->create(['price' => 150, 'stock' => 5]);

        $this->postJson(route('api.v1.orders.store'), $this->checkout([
            ['slug' => $ring->slug, 'quantity' => 2],
        ]))
            ->assertCreated()
            ->assertJsonPath('data.subtotal', 300)
            ->assertJsonPath('data.shipping', 30)
            ->assertJsonPath('data.total', 330)
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.phone', '0612345678')
            ->assertJsonPath('data.items.0.unitPrice', 150);

        $this->assertSame(3, $ring->fresh()->stock);
        $this->assertDatabaseHas('orders', ['total' => 330, 'user_id' => null]);
    }

    public function test_shipping_is_free_over_the_threshold(): void
    {
        $tote = Product::factory()->create(['price' => 500]);

        $this->postJson(route('api.v1.orders.store'), $this->checkout([
            ['slug' => $tote->slug, 'quantity' => 1],
        ]))
            ->assertCreated()
            ->assertJsonPath('data.shipping', 0)
            ->assertJsonPath('data.total', 500);
    }

    public function test_client_supplied_prices_are_ignored(): void
    {
        $ring = Product::factory()->create(['price' => 200]);

        $this->postJson(route('api.v1.orders.store'), $this->checkout(
            [['slug' => $ring->slug, 'quantity' => 1, 'price' => 1]],
            ['total' => 1, 'subtotal' => 1],
        ))
            ->assertCreated()
            ->assertJsonPath('data.subtotal', 200);
    }

    public function test_order_is_rejected_when_stock_is_insufficient(): void
    {
        $ring = Product::factory()->create(['stock' => 1]);

        $this->postJson(route('api.v1.orders.store'), $this->checkout([
            ['slug' => $ring->slug, 'quantity' => 2],
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('items');

        $this->assertSame(1, $ring->fresh()->stock);
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_inactive_products_cannot_be_ordered(): void
    {
        $hidden = Product::factory()->inactive()->create();

        $this->postJson(route('api.v1.orders.store'), $this->checkout([
            ['slug' => $hidden->slug, 'quantity' => 1],
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('items.0.slug');
    }

    public function test_invalid_checkout_details_are_rejected(): void
    {
        $this->postJson(route('api.v1.orders.store'), [
            'customer_name' => '',
            'phone' => '12345',
            'items' => [],
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['customer_name', 'phone', 'city', 'address', 'items']);
    }

    public function test_signed_in_customer_order_is_linked_to_their_account(): void
    {
        $user = User::factory()->create();
        $ring = Product::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson(route('api.v1.orders.store'), $this->checkout([
                ['slug' => $ring->slug, 'quantity' => 1],
            ]))
            ->assertCreated();

        $this->assertSame($user->id, Order::first()->user_id);
    }
}
