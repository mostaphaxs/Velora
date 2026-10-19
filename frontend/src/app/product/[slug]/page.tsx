import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { ProductGrid } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import {
  getCategory,
  getProduct,
  getProductsByCategory,
  products,
} from "@/lib/products";
import { storeConfig } from "@/lib/store-config";
import { formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product?.name, description: product?.description };
}

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getProductsByCategory(product.category)
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-xs text-taupe">
        <Link href="/shop" className="hover:text-gold">
          Shop
        </Link>
        {" / "}
        <Link href={`/shop/${product.category}`} className="hover:text-gold">
          {category?.name}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
        <ProductImage
          product={product}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
        />

        <div className="md:py-6">
          <h1 className="font-serif text-4xl">{product.name}</h1>
          <p className="mt-4 text-xl">
            {formatPrice(product.price)}
            {product.compareAtPrice && (
              <span className="ml-3 text-base text-taupe line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </p>
          <p className="mt-6 leading-relaxed text-taupe">
            {product.description}
          </p>
          <dl className="mt-6 border-y border-line py-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-taupe">Material</dt>
              <dd>{product.material}</dd>
            </div>
          </dl>
          <div className="mt-8">
            <AddToCart slug={product.slug} />
          </div>
          <p className="mt-4 text-xs text-taupe">
            Free shipping over {formatPrice(storeConfig.freeShippingThreshold)}{" "}
            · 30-day returns
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-3xl">You may also like</h2>
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
