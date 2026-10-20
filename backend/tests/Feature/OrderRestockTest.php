<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderRestockTest extends TestCase
{
    use RefreshDatabase;

    public function test_cancelling_an_order_returns_its_items_to_stock_once(): void
    {
        $product = Product::factory()->create(['stock' => 3]);
        $order = Order::factory()->create();
        OrderItem::factory()->for($order)->for($product)->create(['quantity' => 2]);

        $order->update(['status' => OrderStatus::Cancelled]);
        $order->restock();

        $this->assertSame(5, $product->fresh()->stock);
        $this->assertNotNull($order->fresh()->restocked_at);
    }

    public function test_cancelling_returns_stock_to_the_ordered_color(): void
    {
        $product = Product::factory()->create(['stock' => 0]);
        $gold = ProductVariant::factory()->for($product)->create(['name' => 'Gold', 'stock' => 1]);
        $order = Order::factory()->create();
        OrderItem::factory()->for($order)->for($product)->create(['product_variant_id' => $gold->id, 'color' => 'Gold', 'quantity' => 3]);

        $order->update(['status' => OrderStatus::Cancelled]);

        $this->assertSame(4, $gold->fresh()->stock);
        $this->assertSame(0, $product->fresh()->stock);
    }

    public function test_other_status_changes_do_not_touch_stock(): void
    {
        $product = Product::factory()->create(['stock' => 3]);
        $order = Order::factory()->create();
        OrderItem::factory()->for($order)->for($product)->create(['quantity' => 2]);

        $order->update(['status' => OrderStatus::Shipped]);

        $this->assertSame(3, $product->fresh()->stock);
    }

    public function test_stale_pending_orders_are_cancelled_and_restocked(): void
    {
        config(['store.cancel_pending_after_days' => 3]);
        $product = Product::factory()->create(['stock' => 0]);

        $stale = Order::factory()->create(['created_at' => now()->subDays(4)]);
        OrderItem::factory()->for($stale)->for($product)->create(['quantity' => 1]);
        $recent = Order::factory()->create(['created_at' => now()->subDay()]);
        $confirmed = Order::factory()->create(['status' => OrderStatus::Confirmed, 'created_at' => now()->subDays(10)]);

        $this->artisan('velora:cancel-stale-orders')->assertSuccessful();

        $this->assertSame(OrderStatus::Cancelled, $stale->fresh()->status);
        $this->assertSame(OrderStatus::Pending, $recent->fresh()->status);
        $this->assertSame(OrderStatus::Confirmed, $confirmed->fresh()->status);
        $this->assertSame(1, $product->fresh()->stock);
    }
}
