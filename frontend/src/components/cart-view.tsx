"use client";

import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { getSubtotal, useCart, useCartLines, useHydrated } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { getShipping, storeConfig } from "@/lib/store-config";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const hydrated = useHydrated();
  const lines = useCartLines();
  const setQuantity = useCart((state) => state.setQuantity);
  const remove = useCart((state) => state.remove);

  if (!hydrated) {
    return <p className="mt-10 text-taupe">Loading your cart…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="mt-10">
        <p className="text-taupe">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-ink px-8 py-3.5 text-sm tracking-widest text-ivory uppercase hover:bg-gold"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal(lines);
  const shipping = getShipping(subtotal);

  return (
    <div className="mt-10 grid gap-12 md:grid-cols-[1fr_280px]">
      <ul className="divide-y divide-line border-y border-line">
        {lines.map(({ product, quantity }) => (
          <CartLine
            key={product.slug}
            product={product}
            quantity={quantity}
            onQuantityChange={(value) => setQuantity(product.slug, value)}
            onRemove={() => remove(product.slug)}
          />
        ))}
      </ul>

      <aside className="h-fit bg-sand p-6">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
            <dt>Total</dt>
            <dd>{formatPrice(subtotal + shipping)}</dd>
          </div>
        </dl>
        {shipping > 0 && (
          <p className="mt-4 text-xs text-taupe">
            Add {formatPrice(storeConfig.freeShippingThreshold - subtotal)} more
            for free shipping.
          </p>
        )}
        <Link
          href="/checkout"
          className="mt-6 block w-full bg-ink py-3.5 text-center text-sm tracking-widest text-ivory uppercase hover:bg-gold"
        >
          Checkout
        </Link>
      </aside>
    </div>
  );
}

function CartLine({
  product,
  quantity,
  onQuantityChange,
  onRemove,
}: {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex gap-4 py-5">
      <Link href={`/product/${product.slug}`} className="w-20 shrink-0">
        <ProductImage product={product} sizes="80px" />
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-4">
          <div>
            <Link
              href={`/product/${product.slug}`}
              className="text-sm hover:text-gold"
            >
              {product.name}
            </Link>
            <p className="text-xs text-taupe">{product.material}</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${product.name}`}
            className="h-fit text-taupe hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-line">
            <button
              type="button"
              className="p-2 hover:text-gold"
              aria-label="Decrease quantity"
              onClick={() => onQuantityChange(quantity - 1)}
            >
              <Minus className="size-3" />
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button
              type="button"
              className="p-2 hover:text-gold"
              aria-label="Increase quantity"
              onClick={() => onQuantityChange(quantity + 1)}
            >
              <Plus className="size-3" />
            </button>
          </div>
          <p className="text-sm">{formatPrice(product.price * quantity)}</p>
        </div>
      </div>
    </li>
  );
}
