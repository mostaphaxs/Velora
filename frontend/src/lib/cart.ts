"use client";

import { useMemo, useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/api";
import { storeConfig } from "@/lib/store-config";

// What the cart remembers about a product. Prices here are for display only;
// the backend recalculates every total from its own prices at checkout.
export type CartProduct = Pick<
  Product,
  "slug" | "name" | "price" | "image" | "category" | "material"
>;

export type CartLine = { product: CartProduct; quantity: number };

type CartState = {
  // product slug -> line
  items: Record<string, CartLine>;
  add: (product: CartProduct, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      add: (product, quantity = 1) =>
        set((state) => ({
          items: {
            ...state.items,
            [product.slug]: {
              product,
              quantity: Math.min(
                (state.items[product.slug]?.quantity ?? 0) + quantity,
                storeConfig.maxQuantityPerItem,
              ),
            },
          },
        })),
      setQuantity: (slug, quantity) =>
        set((state) => {
          const items = { ...state.items };
          if (quantity <= 0) delete items[slug];
          else if (items[slug]) {
            items[slug] = {
              ...items[slug],
              quantity: Math.min(quantity, storeConfig.maxQuantityPerItem),
            };
          }
          return { items };
        }),
      remove: (slug) =>
        set((state) => {
          const items = { ...state.items };
          delete items[slug];
          return { items };
        }),
      clear: () => set({ items: {} }),
    }),
    {
      name: "velora-cart",
      // v1 stores product details instead of bare quantities; older carts are dropped
      version: 1,
      migrate: () => ({ items: {} }),
    },
  ),
);

export function useCartLines(): CartLine[] {
  const items = useCart((state) => state.items);
  return useMemo(() => Object.values(items), [items]);
}

export function useCartCount() {
  return useCart((state) =>
    Object.values(state.items).reduce((sum, line) => sum + line.quantity, 0),
  );
}

export function getSubtotal(lines: CartLine[]) {
  return lines.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  );
}

const subscribeNoop = () => () => {};

// The cart lives in localStorage, so the server render always sees an empty cart.
// Components use this to avoid a hydration mismatch before the saved cart loads.
export function useHydrated() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}
