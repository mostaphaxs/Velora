"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart, useHydrated } from "@/lib/cart";
import { categories } from "@/lib/products";
import { storeConfig } from "@/lib/store-config";
import { formatPrice } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const count = useCart((state) =>
    Object.values(state.items).reduce((sum, quantity) => sum + quantity, 0),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/90 backdrop-blur">
      <div className="bg-ink py-2 text-center text-xs tracking-wide text-ivory">
        Free shipping on orders over{" "}
        {formatPrice(storeConfig.freeShippingThreshold)}
      </div>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <button
          type="button"
          className="-ml-2 p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link
          href="/"
          className="font-serif text-2xl font-semibold tracking-[0.3em]"
          onClick={() => setOpen(false)}
        >
          VELORA
        </Link>

        <nav className="hidden gap-8 text-sm md:flex">
          <Link href="/shop" className="hover:text-gold">
            Shop all
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop/${category.slug}`}
              className="hover:text-gold"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="relative -mr-2 p-2 hover:text-gold"
          aria-label={`Cart, ${hydrated ? count : 0} items`}
          onClick={() => setOpen(false)}
        >
          <ShoppingBag className="size-5" />
          {hydrated && count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium text-ivory">
              {count}
            </span>
          )}
        </Link>
      </div>

      {open && (
        <nav className="border-t border-line px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3 text-base">
            <li>
              <Link href="/shop" onClick={() => setOpen(false)}>
                Shop all
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/shop/${category.slug}`}
                  onClick={() => setOpen(false)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
