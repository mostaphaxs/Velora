"use client";

import { Check, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useProductColor } from "@/components/product-color";
import { type CartProduct, useCart } from "@/lib/cart";
import { storeConfig } from "@/lib/store-config";

export function AddToCart({
  product,
  inStock: productInStock,
}: {
  product: CartProduct;
  inStock: boolean;
}) {
  const add = useCart((state) => state.add);
  // For products sold in colors, stock and photo follow the chosen color
  const { colors, selected } = useProductColor();
  const inStock = colors.length > 0 ? Boolean(selected?.inStock) : productInStock;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    const { slug, name, price, image, category, material } = product;
    add(
      {
        slug,
        name,
        price,
        image: selected?.images[0] ?? image,
        category,
        material,
        color: selected?.name ?? null,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex gap-3">
      <div className="flex items-center border border-line">
        <button
          type="button"
          className="p-3 hover:text-gold disabled:opacity-40"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          onClick={() => setQuantity((value) => value - 1)}
        >
          <Minus className="size-4" />
        </button>
        <span className="w-8 text-center text-sm" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          className="p-3 hover:text-gold disabled:opacity-40"
          aria-label="Increase quantity"
          disabled={quantity >= storeConfig.maxQuantityPerItem}
          onClick={() => setQuantity((value) => value + 1)}
        >
          <Plus className="size-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!inStock}
        className="flex flex-1 items-center justify-center gap-2 bg-ink px-6 text-sm tracking-widest text-ivory uppercase transition-colors hover:bg-gold disabled:pointer-events-none disabled:bg-taupe"
      >
        {!inStock ? (
          "Sold out"
        ) : added ? (
          <>
            <Check className="size-4" /> Added
          </>
        ) : (
          "Add to cart"
        )}
      </button>
    </div>
  );
}
