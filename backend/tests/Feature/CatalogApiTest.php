<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CatalogApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_categories_are_listed_in_sort_order(): void
    {
        Category::factory()->create(['slug' => 'rings', 'sort_order' => 1]);
        Category::factory()->create(['slug' => 'bags', 'sort_order' => 0]);

        $this->getJson(route('api.v1.categories.index'))
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'bags')
            ->assertJsonPath('data.1.slug', 'rings');
    }

    public function test_only_active_products_are_listed(): void
    {
        Product::factory()->create(['slug' => 'visible']);
        Product::factory()->inactive()->create(['slug' => 'hidden']);

        $this->getJson(route('api.v1.products.index'))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'visible');
    }

    public function test_products_can_be_filtered_by_category(): void
    {
        $rings = Category::factory()->create(['slug' => 'rings']);
        Product::factory()->for($rings)->create(['slug' => 'luna']);
        Product::factory()->create(['slug' => 'tote']);

        $this->getJson(route('api.v1.products.index', ['category' => 'rings']))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'luna')
            ->assertJsonPath('data.0.category', 'rings');
    }

    public function test_product_detail_does_not_expose_stock_count(): void
    {
        $product = Product::factory()->create(['stock' => 7]);

        $this->getJson(route('api.v1.products.show', $product))
            ->assertOk()
            ->assertJsonPath('data.slug', $product->slug)
            ->assertJsonPath('data.inStock', true)
            ->assertJsonMissingPath('data.stock');
    }

    public function test_inactive_product_detail_returns_not_found(): void
    {
        $product = Product::factory()->inactive()->create();

        $this->getJson(route('api.v1.products.show', $product))->assertNotFound();
    }

    public function test_product_photos_are_returned_in_order_with_the_first_as_main_image(): void
    {
        $product = Product::factory()->create([
            'images' => ['products/front.jpg', 'products/side.jpg'],
        ]);

        $this->getJson(route('api.v1.products.show', $product))
            ->assertOk()
            ->assertJsonCount(2, 'data.images')
            ->assertJsonPath('data.image', Storage::disk('public')->url('products/front.jpg'))
            ->assertJsonPath('data.images.1', Storage::disk('public')->url('products/side.jpg'));
    }

    public function test_product_without_photos_returns_an_empty_gallery(): void
    {
        $product = Product::factory()->create(['images' => null]);

        $this->getJson(route('api.v1.products.show', $product))
            ->assertOk()
            ->assertJsonPath('data.image', null)
            ->assertJsonPath('data.images', []);
    }

    public function test_products_can_be_filtered_to_the_homepage_hero(): void
    {
        Product::factory()->create(['slug' => 'in-hero', 'is_featured' => true]);
        Product::factory()->create(['slug' => 'not-in-hero']);

        $this->getJson(route('api.v1.products.index', ['featured' => 1]))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'in-hero')
            ->assertJsonPath('data.0.isFeatured', true);
    }
}
