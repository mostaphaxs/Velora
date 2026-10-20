"use client";

import { Check, Heart, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type CartProduct, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist";

// Heart in the corner of a product card: saves the piece to the customer's account.
// Guests are sent to sign in first, then brought back to this page.
export function WishlistButton({ product }: { product: CartProduct }) {
  const router = useRouter();
  const pathname = usePathname();
  const saved = useWishlist((state) => Boolean(state.slugs[product.slug]));
  const load = useWishlist((state) => state.load);
  const toggle = useWishlist((state) => state.toggle);

  useEffect(() => {
    void load(pathname);
  }, [load, pathname]);

  async function handleClick() {
    const result = await toggle(product.slug);
    if (result === "login") {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className="absolute top-3 right-3 z-10 p-1 text-ink/70 transition hover:scale-110 hover:text-ink"
    >
      <Heart
        className={cn("size-5 transition-colors", saved && "fill-gold-dark text-gold-dark")}
        strokeWidth={1.5}
      />
    </button>
  );
}

// "ADD +" on the photo: puts one piece in the cart without opening the product page.
export function QuickAddButton({ product, inStock }: { product: CartProduct; inStock: boolean }) {
  const add = useCart((state) => state.add);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (!inStock) {
    return (
      <span className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 bg-ivory/90 px-3 py-1 text-xs tracking-[0.15em] text-taupe uppercase">
        Sold out
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Add ${product.name} to cart`}
      className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 bg-ivory/90 px-3 py-1 text-xs tracking-[0.15em] uppercase backdrop-blur transition hover:bg-ink hover:text-ivory"
    >
      {added ? (
        <>
          Added <Check className="size-3.5" />
        </>
      ) : (
        <>
          Add <Plus className="size-3.5" />
        </>
      )}
    </button>
  );
}
