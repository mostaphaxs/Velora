import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { ProductGrid } from "@/components/product-card";
import { categories, products } from "@/lib/products";
import { storeConfig } from "@/lib/store-config";
import { formatPrice } from "@/lib/utils";

const perks = [
  {
    icon: Truck,
    title: "Free shipping",
    text: `On every order over ${formatPrice(storeConfig.freeShippingThreshold)}`,
  },
  { icon: RotateCcw, title: "30-day returns", text: "Easy, no questions asked" },
  { icon: ShieldCheck, title: "Tarnish-resistant", text: "Made for everyday wear" },
];

export default function Home() {
  const bestsellers = products.filter((product) => product.isBestseller);
  const newArrivals = products.filter((product) => product.isNew);

  return (
    <>
      <section className="bg-sand">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:py-32">
          <p className="text-xs tracking-[0.3em] text-gold uppercase">
            New collection
          </p>
          <h1 className="mt-5 max-w-2xl font-serif text-5xl leading-tight sm:text-6xl">
            Accessories you&apos;ll reach for every day
          </h1>
          <p className="mt-5 max-w-md text-taupe">
            Bags, rings, chains and more, designed to mix, layer and last.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="bg-ink px-8 py-3.5 text-sm tracking-widest text-ivory uppercase transition-colors hover:bg-gold"
            >
              Shop now
            </Link>
            <Link
              href="/shop/rings"
              className="border border-ink px-8 py-3.5 text-sm tracking-widest uppercase transition-colors hover:border-gold hover:text-gold"
            >
              Explore rings
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="font-serif text-3xl">Shop by category</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop/${category.slug}`}
              className="group flex aspect-square flex-col items-center justify-center border border-line bg-ivory p-4 text-center transition-colors hover:border-gold"
            >
              <span className="font-serif text-2xl group-hover:text-gold">
                {category.name}
              </span>
              <span className="mt-2 text-xs text-taupe">
                {category.tagline}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl">Bestsellers</h2>
          <Link href="/shop" className="text-sm text-taupe hover:text-gold">
            View all
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={bestsellers} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="font-serif text-3xl">New in</h2>
        <div className="mt-8">
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="grid gap-8 border-y border-line py-12 sm:grid-cols-3">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <Icon className="size-6 shrink-0 text-gold" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-sm text-taupe">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
