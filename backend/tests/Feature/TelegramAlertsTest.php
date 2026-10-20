<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TelegramAlertsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, mixed>
     */
    private function checkout(array $items): array
    {
        return [
            'customer_name' => 'Salma Benali',
            'phone' => '0612345678',
            'city' => 'Rabat',
            'address' => '12 Rue Oued Fes, Agdal',
            'items' => $items,
        ];
    }

    public function test_a_new_order_sends_a_telegram_alert(): void
    {
        config(['services.telegram.bot_token' => 'test-token', 'services.telegram.chat_id' => '12345']);
        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true])]);

        $product = Product::factory()->create(['name' => 'Luna Ring', 'price' => 150]);
        ProductVariant::factory()->for($product)->create(['name' => 'Gold', 'stock' => 5]);

        $this->postJson(route('api.v1.orders.store'), $this->checkout([
            ['slug' => $product->slug, 'color' => 'Gold', 'quantity' => 2],
        ]))->assertCreated();

        Http::assertSent(fn (Request $request): bool => str_contains($request->url(), 'bottest-token/sendMessage')
            && $request['chat_id'] === '12345'
            && str_contains($request['text'], '2 × Luna Ring (Gold)')
            && str_contains($request['text'], 'Salma Benali'));
    }

    public function test_no_alert_is_sent_until_telegram_is_configured(): void
    {
        config(['services.telegram.bot_token' => null]);
        Http::fake();

        $product = Product::factory()->create();

        $this->postJson(route('api.v1.orders.store'), $this->checkout([
            ['slug' => $product->slug, 'quantity' => 1],
        ]))->assertCreated();

        Http::assertNothingSent();
    }

    public function test_a_telegram_outage_does_not_break_checkout(): void
    {
        config(['services.telegram.bot_token' => 'test-token', 'services.telegram.chat_id' => '12345']);
        Http::fake(['api.telegram.org/*' => Http::response(status: 500)]);

        $product = Product::factory()->create();

        $this->postJson(route('api.v1.orders.store'), $this->checkout([
            ['slug' => $product->slug, 'quantity' => 1],
        ]))->assertCreated();
    }
}
