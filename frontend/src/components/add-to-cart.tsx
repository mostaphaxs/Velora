"use client";

import { Check, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export function AddToCart({ slug }: { slug: string }) {
  const add = useCart((state) => state.add);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(slug, quantity);
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
          className="p-3 hover:text-gold"
          aria-label="Increase quantity"
          onClick={() => setQuantity((value) => value + 1)}
        >
          <Plus className="size-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="flex flex-1 items-center justify-center gap-2 bg-ink px-6 text-sm tracking-widest text-ivory uppercase transition-colors hover:bg-gold"
      >
        {added ? (
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
