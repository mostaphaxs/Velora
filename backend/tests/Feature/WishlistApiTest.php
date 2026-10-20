<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WishlistApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_must_sign_in_to_use_the_wishlist(): void
    {
        $product = Product::factory()->create();

        $this->getJson(route('api.v1.account.wishlist.index'))->assertUnauthorized();
        $this->putJson(route('api.v1.account.wishlist.store', $product))->assertUnauthorized();
    }

    public function test_customer_can_save_and_list_products(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['slug' => 'luna-ring']);

        $this->actingAs($user, 'sanctum')
            ->putJson(route('api.v1.account.wishlist.store', $product))
            ->assertNoContent();

        $this->actingAs($user, 'sanctum')
            ->getJson(route('api.v1.account.wishlist.index'))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'luna-ring');
    }

    public function test_saving_the_same_product_twice_does_not_duplicate_it(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $this->actingAs($user, 'sanctum')->putJson(route('api.v1.account.wishlist.store', $product));
        $this->actingAs($user, 'sanctum')->putJson(route('api.v1.account.wishlist.store', $product));

        $this->assertDatabaseCount('wishlist_items', 1);
    }

    public function test_customer_can_remove_a_product(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $user->wishlist()->attach($product);

        $this->actingAs($user, 'sanctum')
            ->deleteJson(route('api.v1.account.wishlist.destroy', $product))
            ->assertNoContent();

        $this->assertDatabaseCount('wishlist_items', 0);
    }

    public function test_customers_only_see_their_own_wishlist(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $other->wishlist()->attach(Product::factory()->create());

        $this->actingAs($user, 'sanctum')
            ->getJson(route('api.v1.account.wishlist.index'))
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_hidden_products_cannot_be_saved_and_drop_off_the_list(): void
    {
        $user = User::factory()->create();
        $hidden = Product::factory()->inactive()->create();
        $later = Product::factory()->create();
        $user->wishlist()->attach($later);
        $later->update(['is_active' => false]);

        $this->actingAs($user, 'sanctum')
            ->putJson(route('api.v1.account.wishlist.store', $hidden))
            ->assertNotFound();

        $this->actingAs($user, 'sanctum')
            ->getJson(route('api.v1.account.wishlist.index'))
            ->assertJsonCount(0, 'data');
    }
}
