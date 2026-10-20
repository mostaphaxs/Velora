<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class StorefrontCacheTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'store.frontend_url' => 'http://shop.test',
            'store.frontend_revalidate_secret' => 'test-secret',
        ]);
        Http::fake(['shop.test/*' => Http::response(['revalidated' => true])]);
    }

    public function test_saving_a_product_refreshes_the_storefront(): void
    {
        $product = Product::factory()->create();
        Http::fake(['shop.test/*' => Http::response(['revalidated' => true])]);

        $product->update(['is_featured' => true]);

        Http::assertSent(fn (Request $request): bool => $request->url() === 'http://shop.test/api/revalidate'
            && $request->hasHeader('X-Revalidate-Secret', 'test-secret'));
    }

    public function test_deleting_a_category_refreshes_the_storefront(): void
    {
        $category = Category::factory()->create();

        $category->delete();

        Http::assertSentCount(2);
    }

    public function test_nothing_is_sent_without_a_secret(): void
    {
        config(['store.frontend_revalidate_secret' => null]);

        Product::factory()->create();

        Http::assertNothingSent();
    }

    public function test_a_storefront_outage_does_not_break_saving(): void
    {
        Http::fake(['shop.test/*' => Http::response(status: 500)]);

        $product = Product::factory()->create(['name' => 'Luna Ring']);

        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Luna Ring']);
    }
}
