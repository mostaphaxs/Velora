<?php

namespace App\Actions;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Support\StorefrontCache;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PlaceOrder
{
    /**
     * Create an order from validated checkout data.
     *
     * Prices come from the database, never from the client. Product and color rows are
     * locked while stock is checked and decremented so two customers cannot buy the
     * last item at the same time.
     *
     * @param  array{customer_name: string, phone: string, city: string, address: string, notes?: string|null, items: list<array{slug: string, color?: string|null, quantity: int}>}  $data
     *
     * @throws ValidationException
     */
    public function handle(array $data, ?User $user = null): Order
    {
        return DB::transaction(function () use ($data, $user): Order {
            $requested = $this->mergeRequestedItems($data['items']);

            $products = Product::active()
                ->whereIn('slug', $requested->pluck('slug')->unique())
                ->with(['variants' => fn ($query) => $query->lockForUpdate()])
                ->lockForUpdate()
                ->get()
                ->keyBy('slug');

            $lines = $requested->map(fn (array $item): array => $this->resolveLine($item, $products))->all();

            $subtotal = array_sum(array_column($lines, 'line_total'));
            $shipping = $this->shippingFor($subtotal);

            $order = Order::create([
                'user_id' => $user?->id,
                'customer_name' => $data['customer_name'],
                'phone' => $data['phone'],
                'city' => $data['city'],
                'address' => $data['address'],
                'notes' => $data['notes'] ?? null,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $subtotal + $shipping,
                'status' => OrderStatus::Pending,
            ]);

            $soldOut = false;

            foreach ($lines as $line) {
                $order->items()->create([
                    'product_id' => $line['product']->id,
                    'product_variant_id' => $line['variant']?->id,
                    'product_name' => $line['product']->name,
                    'color' => $line['variant']?->name,
                    'unit_price' => $line['product']->price,
                    'quantity' => $line['quantity'],
                    'line_total' => $line['line_total'],
                ]);

                $stocked = $line['variant'] ?? $line['product'];
                $stocked->decrement('stock', $line['quantity']);
                $soldOut = $soldOut || $stocked->stock === 0;
            }

            // decrement() skips model events, so refresh the shop when something sells out
            if ($soldOut) {
                StorefrontCache::refresh();
            }

            return $order->load('items');
        });
    }

    public function shippingFor(int $subtotal): int
    {
        return $subtotal >= config('store.free_shipping_threshold')
            ? 0
            : config('store.shipping_cost');
    }

    /**
     * Combine repeated lines for the same product and color.
     *
     * @param  list<array{slug: string, color?: string|null, quantity: int}>  $items
     * @return Collection<int, array{slug: string, color: string|null, quantity: int}>
     *
     * @throws ValidationException
     */
    private function mergeRequestedItems(array $items): Collection
    {
        $merged = collect($items)
            ->groupBy(fn (array $item): string => $item['slug'].'|'.($item['color'] ?? ''))
            ->map(fn (Collection $group): array => [
                'slug' => $group->first()['slug'],
                'color' => $group->first()['color'] ?? null,
                'quantity' => (int) $group->sum('quantity'),
            ])
            ->values();

        if ($merged->contains(fn (array $item): bool => $item['quantity'] > config('store.max_quantity_per_item'))) {
            throw ValidationException::withMessages([
                'items' => 'You can order at most '.config('store.max_quantity_per_item').' of each piece.',
            ]);
        }

        return $merged;
    }

    /**
     * Match a requested line to its product (and color) and check the stock.
     *
     * @param  array{slug: string, color: string|null, quantity: int}  $item
     * @param  Collection<string, Product>  $products
     * @return array{product: Product, variant: ProductVariant|null, quantity: int, line_total: int}
     *
     * @throws ValidationException
     */
    private function resolveLine(array $item, Collection $products): array
    {
        $product = $products->get($item['slug']);

        if ($product === null) {
            throw ValidationException::withMessages([
                'items' => 'One of the products in your cart is no longer available.',
            ]);
        }

        $variant = null;

        if ($product->hasVariants()) {
            $variant = $product->variants->firstWhere('name', $item['color']);

            if ($variant === null) {
                throw ValidationException::withMessages([
                    'items' => "Please choose an available color for {$product->name}.",
                ]);
            }
        }

        $available = $variant?->stock ?? $product->stock;

        if ($available < $item['quantity']) {
            $label = $variant ? "{$product->name} in {$variant->name}" : $product->name;

            throw ValidationException::withMessages([
                'items' => $available > 0 ? "Only {$available} left of {$label}." : "{$label} is sold out.",
            ]);
        }

        return [
            'product' => $product,
            'variant' => $variant,
            'quantity' => $item['quantity'],
            'line_total' => $product->price * $item['quantity'],
        ];
    }
}
