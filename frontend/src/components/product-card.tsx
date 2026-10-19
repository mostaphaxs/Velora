import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative">
        <ProductImage
          product={product}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />
        {(product.isNew || product.compareAtPrice) && (
          <span className="absolute top-3 left-3 bg-ivory px-2 py-1 text-[10px] font-medium tracking-widest uppercase">
            {product.compareAtPrice ? "Sale" : "New"}
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm group-hover:text-gold">{product.name}</h3>
        <p className="text-xs text-taupe">{product.material}</p>
        <p className="text-sm">
          {formatPrice(product.price)}
          {product.compareAtPrice && (
            <span className="ml-2 text-taupe line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
