<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class OrderWhatsappTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, array{string}>
     */
    public static function moroccanPhoneNumbers(): array
    {
        return [
            'local' => ['0612345678'],
            'international with plus' => ['+212612345678'],
        ];
    }

    #[DataProvider('moroccanPhoneNumbers')]
    public function test_whatsapp_link_uses_the_international_number(string $phone): void
    {
        $order = Order::factory()->create(['phone' => $phone]);

        $this->assertStringStartsWith('https://wa.me/212612345678?text=', $order->whatsappUrl());
    }

    public function test_whatsapp_message_mentions_the_customer_and_order(): void
    {
        $order = Order::factory()->create([
            'customer_name' => 'Salma Benali',
            'reference' => 'VEL-ABC123',
            'total' => 1250,
        ]);

        $message = rawurldecode(explode('?text=', $order->whatsappUrl())[1]);

        $this->assertStringContainsString('Hello Salma', $message);
        $this->assertStringContainsString('VEL-ABC123', $message);
        $this->assertStringContainsString('1 250 MAD', $message);
    }

    public function test_orders_know_whether_they_came_from_an_account(): void
    {
        $this->assertTrue(Order::factory()->for(User::factory())->create()->placedFromAccount());
        $this->assertFalse(Order::factory()->create()->placedFromAccount());
    }

    public function test_admin_order_page_has_a_whatsapp_contact_button(): void
    {
        $order = Order::factory()->create(['phone' => '0612345678']);

        $this->actingAs(User::factory()->admin()->create())
            ->get("/admin/orders/{$order->id}")
            ->assertOk()
            ->assertSee('Contact on WhatsApp')
            ->assertSee('https://wa.me/212612345678', false);
    }
}
