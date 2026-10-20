import Image from "next/image";
import { ProductArt } from "@/components/product-art";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

export function ProductImage({
  product,
  sizes,
  priority,
  className,
}: {
  product: Pick<Product, "name" | "image" | "category"> & { images?: string[] };
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  // A second photo, when there is one, fades in on hover
  const hoverImage = product.images?.[1];

  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden bg-sand",
        className,
      )}
    >
      {product.image ? (
        <>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={sizes}
            preload={priority}
            className="object-cover"
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </>
      ) : (
        // Shown until photos are uploaded in the admin
        <ProductArt category={product.category} />
      )}
    </div>
  );
}
