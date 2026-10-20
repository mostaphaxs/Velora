import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { ProductGrid } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getCategory, getProduct, getProducts } from "@/lib/api";
import { storeConfig } from "@/lib/store-config";
import { formatPrice } from "@/lib/utils";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product?.name, description: product?.description };
}

export default function ProductPage({ params }: PageProps<"/product/[slug]">) {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-10">
      {/* Products added later in the admin render on first visit, then get cached */}
      <Suspense fallback={<p className="text-taupe">Loading…</p>}>
        <ProductDetails params={params} />
      </Suspense>
    </div>
  );
}

async function ProductDetails({
  params,
}: Pick<PageProps<"/product/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [category, sameCategory] = await Promise.all([
    getCategory(product.category),
    getProducts({ category: product.category }),
  ]);
  const related = sameCategory
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
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
        <ProductGallery product={product} />

        <div className="md:sticky md:top-32 md:self-start md:py-6">
          <Badge variant="outline" className="uppercase">
            {category?.name}
          </Badge>
          <h1 className="mt-4 font-serif text-5xl">{product.name}</h1>
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
          <div className="mt-8">
            <AddToCart product={product} inStock={product.inStock} />
          </div>
          <Accordion defaultValue={["details"]} className="mt-10 border-t border-line">
            <AccordionItem value="details">
              <AccordionTrigger className="text-sm">Details</AccordionTrigger>
              <AccordionContent className="text-taupe">
                Material: {product.material}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-sm">
                Shipping & returns
              </AccordionTrigger>
              <AccordionContent className="text-taupe">
                Free shipping over{" "}
                {formatPrice(storeConfig.freeShippingThreshold)}, otherwise{" "}
                {formatPrice(storeConfig.shippingCost)}. Cash on delivery and
                30-day returns.{" "}
                <Link href="/shipping-returns" className="underline">
                  Learn more
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger className="text-sm">Care</AccordionTrigger>
              <AccordionContent className="text-taupe">
                Store pieces separately and wipe with a soft cloth.{" "}
                <Link href="/jewelry-care" className="underline">
                  Full care guide
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-4xl">You may also <em className="text-gold-dark">like</em></h2>
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  );
}
