import {
  ArrowRight,
  ArrowUpRight,
  Droplets,
  HandCoins,
  RotateCcw,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { HeroBackground } from "@/components/hero-background";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { ProductRail } from "@/components/product-rail";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { getCategories, getProducts } from "@/lib/api";
import { getCategoryPhoto } from "@/lib/category-photos";
import { storeConfig } from "@/lib/store-config";
import { cn, formatPrice } from "@/lib/utils";

const perks = [
  {
    icon: Truck,
    title: "Free shipping",
    text: `On orders over ${formatPrice(storeConfig.freeShippingThreshold)}`,
  },
  { icon: HandCoins, title: "Cash on delivery", text: "Pay when it arrives" },
  { icon: RotateCcw, title: "30-day returns", text: "No questions asked" },
  { icon: Droplets, title: "Tarnish-resistant", text: "Made for everyday wear" },
];

function SectionHeading({ title }: { title: string }) {
  return (
    <Reveal className="mb-10">
      <h2 className="text-3xl font-medium tracking-[0.04em] uppercase sm:text-4xl lg:text-[2.6rem]">
        {title}
      </h2>
    </Reveal>
  );
}

// Vertical note framing the left or right edge of the hero (desktop only)
function HeroSideNote({ side, children }: { side: "left" | "right"; children: ReactNode }) {
  return (
    <div
      className={cn(
        "absolute top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex",
        side === "left" ? "left-8 xl:left-12" : "right-8 xl:right-12",
      )}
    >
      <span className="h-20 w-px bg-linear-to-b from-transparent to-gold/70" />
      <span className="text-gold" aria-hidden="true">✦</span>
      <p
        className={cn(
          "text-[10px] tracking-[0.35em] whitespace-nowrap text-ink/60 uppercase [writing-mode:vertical-rl]",
          side === "left" && "rotate-180",
        )}
      >
        {children}
      </p>
      <span className="h-20 w-px bg-linear-to-t from-transparent to-gold/70" />
    </div>
  );
}

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const bestsellers = products.filter((product) => product.isBestseller);
  const newArrivals = products.filter((product) => product.isNew);
  const lowestPrice = Math.min(...products.map((product) => product.price));

  return (
    <>
      {/* Hero */}
      {/* Pulled up under the transparent nav bar (h-14) so the background shows through it */}
      <section className="relative isolate -mt-14 overflow-hidden pt-14">
        <HeroBackground />
        <HeroSideNote side="left">
          Free shipping over {formatPrice(storeConfig.freeShippingThreshold)}
        </HeroSideNote>
        <HeroSideNote side="right">Cash on delivery · 30-day returns</HeroSideNote>
        <a
          href="#collections"
          aria-label="Scroll to collections"
          className="group absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-ink/50 uppercase transition-colors hover:text-gold-dark lg:flex"
        >
          Scroll
          <span className="relative h-10 w-px overflow-hidden bg-ink/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-hint_2s_ease-in-out_infinite] bg-gold-dark" />
          </span>
        </a>
        <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-3xl flex-col items-center justify-center px-4 pt-6 pb-20 text-center sm:px-6">
          <Reveal>
            <p className="text-[11px] tracking-[0.3em] text-gold-dark uppercase">
              ✦ The new collection
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Quiet gold, <em className="text-gold-dark">worn</em>
              <br />
              every day.
            </h1>
            <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-ink/70">
              Rings, chains and bags made to layer and last. Delivered across
              Morocco{products.length > 0 && <>, from {formatPrice(lowestPrice)}</>}.
            </p>
            <Link
              href="/shop"
              className={cn(buttonVariants({ size: "xl" }), "mt-8 h-11 px-7")}
            >
              Shop now <ArrowRight />
            </Link>
          </Reveal>

          <Reveal delay={0.2}>
            <nav aria-label="Shop by category" className="mt-14 flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
              {categories.map((category, index) => (
                <span key={category.slug} className="flex items-center">
                  {index > 0 && <span className="px-3 text-gold" aria-hidden="true">·</span>}
                  <Link
                    href={`/shop/${category.slug}`}
                    className="font-serif text-xl italic text-ink/80 transition-colors hover:text-gold-dark sm:text-2xl"
                  >
                    {category.name}
                  </Link>
                </span>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      {/* Category marquee */}
      <Marquee className="border-y border-line py-6 [--duration:50s] [--gap:4rem]">
        {categories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/shop/${category.slug}`}
            className={cn(
              "font-serif text-5xl font-light hover:text-gold-dark",
              index % 2 === 1 && "text-gold-dark italic",
            )}
          >
            {category.name} <span className="ml-16 text-xl text-gold">✦</span>
          </Link>
        ))}
      </Marquee>

      {/* Categories */}
      <section id="collections" className="scroll-mt-20 pt-24 px-4 sm:px-6 lg:px-10">
        <SectionHeading title="Shop by category" />
        {/* One horizontal row: scrolls sideways on phones, fits in one line on desktop */}
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 py-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-flow-col lg:auto-cols-fr lg:overflow-visible lg:px-0">
          {categories.map((category) => {
            const photo = getCategoryPhoto(category.slug);

            return (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                className="group w-40 shrink-0 snap-start transition-transform duration-500 ease-out hover:scale-[1.03] sm:w-48 lg:w-auto"
              >
                {/* Photos are prepared on the site's ivory, so they blend into the page */}
                <div className="relative aspect-[3/4] overflow-hidden bg-ivory">
                  {photo ? (
                    <Image
                      src={photo}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 20vw, 192px"
                      quality={90}
                      className="object-cover"
                    />
                  ) : (
                    <ProductArt category={category.slug} />
                  )}
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm tracking-wide uppercase transition-colors group-hover:text-gold-dark">
                      {category.name}
                    </h3>
                    <p className="mt-1 truncate text-xs text-taupe">{category.tagline}</p>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-ink/50 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-dark" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bestsellers: heading on the page margin, cards run edge to edge */}
      <section className="pt-28">
        <div className="px-4 sm:px-6 lg:px-10">
          <SectionHeading title="Bestsellers" />
        </div>
        <ProductRail>
          {bestsellers.map((product) => (
            <ProductCard key={product.slug} product={product} size="large" />
          ))}
        </ProductRail>
      </section>

      {/* New in */}
      <section className="pt-28">
        <div className="px-4 sm:px-6 lg:px-10">
          <SectionHeading title="New arrivals" />
        </div>
        <ProductRail>
          {newArrivals.map((product) => (
            <ProductCard key={product.slug} product={product} size="large" />
          ))}
        </ProductRail>
      </section>

      {/* Perks */}
      <section className="mt-28 grid grid-cols-2 gap-px border-y border-line bg-line lg:grid-cols-4 px-4 sm:px-6 lg:px-10">
        {perks.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col items-center gap-2 bg-ivory px-4 py-10 text-center">
            <Icon className="mb-2 size-12 rounded-full bg-sand p-3.5 text-gold-dark" strokeWidth={1.5} />
            <p className="font-serif text-xl">{title}</p>
            <p className="text-xs text-taupe">{text}</p>
          </div>
        ))}
      </section>

      {/* WhatsApp CTA */}
      <Reveal className="mt-24 px-4 sm:px-6 lg:px-10">
        <div className="bg-sand px-6 py-16 text-center">
          <p className="text-[11px] tracking-[0.3em] text-gold-dark uppercase">
            Need help choosing?
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl sm:text-5xl">
            Message us and we&apos;ll help you{" "}
            <em className="text-gold-dark">find your piece</em>.
          </h2>
          <a
            href={`https://wa.me/${storeConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "xl" }), "mt-9")}
          >
            Chat on WhatsApp <ArrowUpRight />
          </a>
        </div>
      </Reveal>
    </>
  );
}
