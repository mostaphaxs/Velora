import { CircleDot, Gem, Link2, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";
import type { CategorySlug, Product } from "@/lib/products";
import { cn } from "@/lib/utils";

const placeholderIcons: Record<CategorySlug, typeof Gem> = {
  bags: ShoppingBag,
  rings: CircleDot,
  chains: Link2,
  earrings: Sparkles,
  bracelets: Gem,
};

export function ProductImage({
  product,
  sizes,
  priority,
  className,
}: {
  product: Product;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const Icon = placeholderIcons[product.category];

  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden bg-sand",
        className,
      )}
    >
      {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        // Shown until real product photos are added to /public/products
        <div className="flex h-full items-center justify-center bg-linear-to-br from-sand via-ivory to-line">
          <Icon className="size-12 text-gold" strokeWidth={1} />
        </div>
      )}
    </div>
  );
}
