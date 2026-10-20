<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductColorsTest extends TestCase
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

    public function test_product_api_lists_colors_with_their_photos_and_availability(): void
    {
        $product = Product::factory()->create(['images' => null]);
        ProductVariant::factory()->for($product)->create([
            'name' => 'Gold', 'hex' => '#d4af37', 'stock' => 2, 'images' => ['products/colors/gold.jpg'], 'sort_order' => 0,
        ]);
        ProductVariant::factory()->for($product)->create(['name' => 'Silver', 'stock' => 0, 'sort_order' => 1]);

        $this->getJson(route('api.v1.products.show', $product))
            ->assertOk()
            ->assertJsonPath('data.inStock', true)
            ->assertJsonPath('data.colors.0.name', 'Gold')
            ->assertJsonPath('data.colors.0.hex', '#d4af37')
            ->assertJsonPath('data.colors.0.onlyLeft', 2)
            ->assertJsonPath('data.colors.0.images.0', Storage::disk('public')->url('products/colors/gold.jpg'))
            ->assertJsonPath('data.colors.1.inStock', false)
            // Without general photos, the first color's photo becomes the main image
            ->assertJsonPath('data.image', Storage::disk('public')->url('products/colors/gold.jpg'))
            ->assertJsonMissingPath('data.colors.0.stock');
    }

    public function test_product_is_sold_out_only_when_every_color_is(): void
    {
        $product = Product::factory()->create(['stock' => 50]);
        ProductVariant::factory()->for($product)->create(['name' => 'Gold', 'stock' => 0]);

        $this->getJson(route('api.v1.products.show', $product))->assertJsonPath('data.inStock', false);
    }

    public function test_ordering_a_color_uses_and_reduces_that_colors_stock(): void
    {
        $product = Product::factory()->create(['price' => 100]);
        $gold = ProductVariant::factory()->for($product)->create(['name' => 'Gold', 'stock' => 5]);
        $silver = ProductVariant::factory()->for($product)->create(['name' => 'Silver', 'stock' => 5]);

        $this->postJson(route('api.v1.orders.store'), $this->checkout([
            ['slug' => $product->slug, 'color' => 'Gold', 'quantity' => 2],
            ['slug' => $product->slug, 'color' => 'Silver', 'quantity' => 1],
        ]))
            ->assertCreated()
            ->assertJsonPath('data.subtotal', 300)
            ->assertJsonPath('data.items.0.color', 'Gold');

        $this->assertSame(3, $gold->fresh()->stock);
        $this->assertSame(4, $silver->fresh()->stock);
        $this->assertDatabaseHas('order_items', ['product_variant_id' => $gold->id, 'color' => 'Gold', 'quantity' => 2]);
    }

    public function test_a_color_must_be_chosen_for_products_with_colors(): void
    {
        $product = Product::factory()->create();
        ProductVariant::factory()->for($product)->create(['name' => 'Gold']);

        $this->postJson(route('api.v1.orders.store'), $this->checkout([
            ['slug' => $product->slug, 'quantity' => 1],
        ]))->assertUnprocessable()->assertJsonValidationErrors('items');

        $this->postJson(route('api.v1.orders.store'), $this->checkout([
            ['slug' => $product->slug, 'color' => 'Purple', 'quantity' => 1],
        ]))->assertUnprocessable()->assertJsonValidationErrors('items');
    }

    public function test_a_sold_out_color_cannot_be_ordered(): void
    {
        $product = Product::factory()->create();
        ProductVariant::factory()->for($product)->create(['name' => 'Silver', 'stock' => 0]);

        $this->postJson(route('api.v1.orders.store'), $this->checkout([
            ['slug' => $product->slug, 'color' => 'Silver', 'quantity' => 1],
        ]))
            ->assertUnprocessable()
            ->assertJsonPath('errors.items.0', "{$product->name} in Silver is sold out.");
    }

    public function test_admin_product_pages_load_with_colors(): void
    {
        $product = Product::factory()->create();
        ProductVariant::factory()->for($product)->create(['name' => 'Gold', 'stock' => 4]);

        $this->actingAs(User::factory()->admin()->create());

        $this->get('/admin/products')->assertOk()->assertSee('Gold: 4');
        $this->get("/admin/products/{$product->slug}/edit")->assertOk()->assertSee('Add a color');
    }
}
