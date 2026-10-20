<?php

namespace App\Actions;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Support\StorefrontCache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PlaceOrder
{
    /**
     * Create an order from validated checkout data.
     *
     * Prices come from the database, never from the client. Product rows are
     * locked while stock is checked and decremented so two customers cannot buy
     * the last item at the same time.
     *
     * @param  array{customer_name: string, phone: string, city: string, address: string, notes?: string|null, items: list<array{slug: string, quantity: int}>}  $data
     *
     * @throws ValidationException
     */
    public function handle(array $data, ?User $user = null): Order
    {
        return DB::transaction(function () use ($data, $user): Order {
            $quantities = collect($data['items'])->pluck('quantity', 'slug');

            $products = Product::active()
                ->whereIn('slug', $quantities->keys())
                ->lockForUpdate()
                ->get()
                ->keyBy('slug');

            $lines = [];

            foreach ($quantities as $slug => $quantity) {
                $product = $products->get($slug);

                if ($product === null) {
                    throw ValidationException::withMessages([
                        'items' => 'One of the products in your cart is no longer available.',
                    ]);
                }

                if ($product->stock < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => "Only {$product->stock} left of {$product->name}.",
                    ]);
                }

                $lines[] = [
                    'product' => $product,
                    'quantity' => (int) $quantity,
                    'line_total' => $product->price * $quantity,
                ];
            }

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

            foreach ($lines as $line) {
                $order->items()->create([
                    'product_id' => $line['product']->id,
                    'product_name' => $line['product']->name,
                    'unit_price' => $line['product']->price,
                    'quantity' => $line['quantity'],
                    'line_total' => $line['line_total'],
                ]);

                $line['product']->decrement('stock', $line['quantity']);
            }

            // decrement() skips model events, so refresh the shop when an item sells out
            if (collect($lines)->contains(fn (array $line): bool => $line['product']->stock === 0)) {
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
}
