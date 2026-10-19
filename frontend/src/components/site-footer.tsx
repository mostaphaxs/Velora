import Link from "next/link";
import { categories } from "@/lib/products";

const helpLinks = [
  { href: "/shipping-returns", label: "Shipping & returns" },
  { href: "/jewelry-care", label: "Jewelry care" },
  { href: "/contact", label: "Contact us" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          <p className="font-serif text-2xl font-semibold tracking-[0.3em]">
            VELORA
          </p>
          <p className="mt-3 max-w-xs text-sm text-taupe">
            Bags and jewelry made for everyday wear, with prices that make
            sense.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest uppercase">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-taupe">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/shop/${category.slug}`}
                  className="hover:text-ink"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest uppercase">Help</p>
          <ul className="mt-4 space-y-2 text-sm text-taupe">
            {helpLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-taupe">
        © Velora. All rights reserved.
      </div>
    </footer>
  );
}
