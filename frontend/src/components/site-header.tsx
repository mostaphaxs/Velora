"use client";

import { Heart, Menu, ShoppingBag } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { HeaderAccount } from "@/components/header-account";
import { Marquee } from "@/components/ui/marquee";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Category } from "@/lib/api";
import { useCartCount, useHydrated } from "@/lib/cart";
import { storeConfig } from "@/lib/store-config";
import { cn, formatPrice } from "@/lib/utils";

const announcements = [
  `Free shipping over ${formatPrice(storeConfig.freeShippingThreshold)}`,
  "Cash on delivery across Morocco",
  "Create an account to track your orders",
  "30-day returns",
];

export function SiteHeader({ categories }: { categories: Category[] }) {
  const navLinks = [
    { href: "/shop", label: "Shop all" },
    ...categories.map((category) => ({
      href: `/shop/${category.slug}`,
      label: category.name,
    })),
  ];
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const { scrollY } = useScroll();

  // Hide while scrolling down, reveal as soon as the user scrolls back up
  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? 0);
    if (Math.abs(delta) > 4) setHidden(delta > 0 && y > 120);
    setAtTop(y < 20);
  });
  const hydrated = useHydrated();
  const count = useCartCount();

  return (
    <motion.header
      className="sticky top-0 z-40"
      animate={{ y: hidden && !open ? "-100%" : 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Marquee className="bg-ink py-1 text-[10px] tracking-[0.25em] text-ivory uppercase [--duration:30s] [--gap:3rem]">
        {announcements.map((text) => (
          <span key={text}>
            {text} <span className="ml-12 text-gold">✦</span>
          </span>
        ))}
      </Marquee>

      <div
        className={cn(
          "transition-colors duration-300",
          !atTop && "bg-ivory/90 shadow-sm backdrop-blur-md",
        )}
      >
        <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-10">
          <div>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="-ml-2 p-2 lg:hidden" aria-label="Open menu">
                <Menu className="size-4.5" strokeWidth={1.5} />
              </SheetTrigger>
              <SheetContent side="left" className="p-8">
                <SheetTitle className="font-serif text-2xl tracking-[0.4em]">
                  VELORA
                </SheetTitle>
                <nav className="mt-10 flex flex-col divide-y divide-line border-y border-line">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="py-4 font-serif text-3xl hover:text-gold-dark"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="py-4 font-serif text-3xl hover:text-gold-dark"
                  >
                    My account
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setOpen(false)}
                    className="py-4 font-serif text-3xl hover:text-gold-dark"
                  >
                    Wishlist
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <nav className="hidden gap-6 text-xs lg:flex">
              {navLinks.slice(0, 3).map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-gold-dark">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/" className="font-serif text-xl tracking-[0.4em]">
            VELORA
          </Link>

          <div className="flex items-center justify-end gap-3 lg:gap-5">
            <nav className="hidden gap-6 text-xs lg:flex">
              {navLinks.slice(3).map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-gold-dark">
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/wishlist"
              className="hidden p-2 hover:text-gold-dark sm:block"
              aria-label="Wishlist"
            >
              <Heart className="size-4.5" strokeWidth={1.5} />
            </Link>
            <HeaderAccount />
            <Link
              href="/cart"
              className="relative -mr-2 p-2 hover:text-gold-dark"
              aria-label={`Cart, ${hydrated ? count : 0} items`}
            >
              <ShoppingBag className="size-4.5" strokeWidth={1.5} />
              {hydrated && count > 0 && (
                <span className="absolute top-0 right-0 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] text-ivory">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
