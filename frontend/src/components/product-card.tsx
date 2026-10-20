import Link from "next/link";
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
  const href = `/product/${product.slug}`;
  const label = cardLabel(product);
  const { slug, name, price, image, category, material } = product;
  const snapshot = { slug, name, price, image, category, material };

  return (
    <article className="group flex flex-col bg-[#f3f0eb] transition-transform duration-500 ease-out hover:scale-[1.03]">
      {/* Photo with label, wishlist heart and quick add layered on top */}
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <ProductImage
            product={product}
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
        <QuickAddButton product={snapshot} inStock={product.inStock} />
      </div>

      <Link href={href} className={cn("block px-3", large ? "pt-4 pb-5" : "pt-3 pb-4")}>
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
          {material}
        </p>
      </Link>
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
