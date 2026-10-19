"use client";

import { useMemo, useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, type Product } from "@/lib/products";

export type CartLine = { product: Product; quantity: number };

type CartState = {
  // product slug -> quantity
  items: Record<string, number>;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      add: (slug, quantity = 1) =>
        set((state) => ({
          items: { ...state.items, [slug]: (state.items[slug] ?? 0) + quantity },
        })),
      setQuantity: (slug, quantity) =>
        set((state) => {
          const items = { ...state.items };
          if (quantity <= 0) delete items[slug];
          else items[slug] = quantity;
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
    { name: "velora-cart" },
  ),
);

export function useCartLines(): CartLine[] {
  const items = useCart((state) => state.items);
  return useMemo(
    () =>
      Object.entries(items).flatMap(([slug, quantity]) => {
        const product = getProduct(slug);
        // Skip items whose product was removed from the catalog
        return product ? [{ product, quantity }] : [];
      }),
    [items],
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
