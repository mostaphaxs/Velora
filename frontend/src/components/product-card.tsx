"use client";

import Link from "next/link";
import { useState } from "react";
import { QuickAddButton, WishlistButton } from "@/components/product-card-actions";
import { ProductImage } from "@/components/product-image";
import type { Product } from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";

function cardLabel(product: Product) {
  if (product.compareAtPrice) return "Sale";
  if (product.isNew) return "New";
  if (product.isBestseller) return "Bestseller";
  return null;
}

export function ProductCard({
  product,
  size = "default",
}: {
  product: Product;
  // "large" is used by the homepage rows, with bigger text
  size?: "default" | "large";
}) {
  const large = size === "large";
  const label = cardLabel(product);
  // Clicking a color dot switches the card to that color's photos
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const selected = product.colors.find((color) => color.name === selectedName) ?? null;

  const href = selected
    ? `/product/${product.slug}?color=${encodeURIComponent(selected.name)}`
    : `/product/${product.slug}`;
  const photos = selected && selected.images.length > 0 ? selected.images : null;
  const shown = {
    name: product.name,
    category: product.category,
    image: photos?.[0] ?? product.image,
    images: photos ?? product.images,
  };

  const { slug, name, price, category, material } = product;
  const snapshot = { slug, name, price, image: shown.image, category, material, color: selected?.name ?? null };

  return (
    <article className="group flex flex-col bg-[#f3f0eb] transition-transform duration-500 ease-out hover:scale-[1.03]">
      {/* Photo with label, wishlist heart and quick add layered on top */}
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <ProductImage
            product={shown}
            className="bg-transparent"
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        </Link>
        {label && (
          <span className={cn("pointer-events-none absolute top-3 left-3 text-ink/60", large ? "text-sm" : "text-xs")}>
            {label}
          </span>
        )}
        <WishlistButton product={snapshot} />
        {product.colors.length === 0 ? (
          <QuickAddButton product={snapshot} inStock={product.inStock} />
        ) : selected ? (
          // Once a color is picked on the card, it can go straight into the cart
          <QuickAddButton key={selected.name} product={snapshot} inStock={selected.inStock} />
        ) : (
          <Link
            href={href}
            className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 bg-ivory/90 px-3 py-1 text-xs tracking-[0.15em] whitespace-nowrap uppercase backdrop-blur transition hover:bg-ink hover:text-ivory"
          >
            {product.inStock ? "Choose color" : "Sold out"}
          </Link>
        )}
      </div>

      <Link href={href} className={cn("block px-3", large ? "pt-4" : "pt-3", product.colors.length > 0 ? "pb-1" : large ? "pb-5" : "pb-4")}>
        <h3
          className={cn(
            "truncate tracking-wide uppercase transition-colors group-hover:text-gold-dark",
            large ? "text-sm text-ink/80" : "text-[13px]",
          )}
        >
          {name}
        </h3>
        <p className={cn("mt-1 tabular-nums", large ? "text-[15px] tracking-[0.08em]" : "text-sm")}>
          {formatPrice(price)}
          {product.compareAtPrice && (
            <span className="ml-2 text-xs text-taupe line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </p>
        <p className={cn("mt-1 truncate", large ? "text-sm text-ink/70" : "text-xs text-taupe")}>
          {selected ? `${selected.name} · ${material}` : material}
        </p>
      </Link>

      {product.colors.length > 0 && (
        <div
          role="radiogroup"
          aria-label={`Colors of ${name}`}
          className={cn("flex flex-wrap items-center gap-2 px-3", large ? "pt-2 pb-5" : "pt-2 pb-4")}
        >
          {product.colors.map((color) => {
            const isSelected = color.name === selected?.name;
            return (
              <button
                key={color.name}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={color.inStock ? color.name : `${color.name}, sold out`}
                title={color.inStock ? color.name : `${color.name} (sold out)`}
                // Clicking the selected color again goes back to the main photo
                onClick={() => setSelectedName(isSelected ? null : color.name)}
                className={cn(
                  "relative size-5 rounded-full ring-offset-2 ring-offset-[#f3f0eb] transition",
                  isSelected ? "ring-2 ring-ink" : "ring-1 ring-ink/15 hover:ring-ink/50",
                )}
              >
                <span
                  className={cn("absolute inset-0.5 rounded-full", !color.inStock && "opacity-35")}
                  style={{ backgroundColor: color.hex }}
                />
                {!color.inStock && (
                  <span className="absolute top-1/2 left-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-ink/60" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
