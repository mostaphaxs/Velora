<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_admin_login(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
    }

    public function test_customers_cannot_access_the_admin_panel(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/admin')
            ->assertForbidden();
    }

    public function test_admins_can_access_the_admin_pages(): void
    {
        $admin = User::factory()->admin()->create();
        $product = Product::factory()->create();
        $order = Order::factory()->create();

        $this->actingAs($admin);

        $this->get('/admin')->assertOk();
        $this->get('/admin/products')->assertOk()->assertSee($product->name);
        $this->get('/admin/categories')->assertOk();
        $this->get('/admin/orders')->assertOk()->assertSee($order->reference);
        $this->get("/admin/orders/{$order->id}")->assertOk();
        $this->get("/admin/orders/{$order->id}/edit")->assertOk();
        $this->get('/admin/products/create')->assertOk();
        $this->get("/admin/products/{$product->slug}/edit")->assertOk();
    }

    public function test_orders_cannot_be_created_from_the_admin_panel(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->get('/admin/orders/create')
            ->assertNotFound();
    }

    public function test_create_admin_command_promotes_an_existing_user(): void
    {
        $user = User::factory()->create(['email' => 'owner@velora.store']);

        $this->artisan('velora:create-admin', ['--email' => 'owner@velora.store'])
            ->assertSuccessful();

        $this->assertTrue($user->fresh()->isAdmin());
    }
}
