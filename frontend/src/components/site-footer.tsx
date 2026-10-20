import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getCategories } from "@/lib/api";
import { storeConfig } from "@/lib/store-config";

const helpLinks = [
  { href: "/shipping-returns", label: "Shipping & returns" },
  { href: "/jewelry-care", label: "Jewelry care" },
  { href: "/contact", label: "Contact us" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of sale" },
];

export async function SiteFooter() {
  const categories = await getCategories();

  return (
    <footer className="mt-28 bg-ink text-ivory">
      <div className="grid gap-12 pt-20 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-6 lg:px-10">
        <div className="lg:col-span-2">
          <p className="max-w-sm font-serif text-3xl leading-snug">
            Bags and jewelry made for everyday wear, with prices that{" "}
            <em className="text-gold">make sense</em>.
          </p>
          <a
            href={`https://wa.me/${storeConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm text-ivory/60 hover:text-gold"
          >
            WhatsApp · {storeConfig.hours}
          </a>
        </div>
        {[
          {
            title: "Shop",
            links: categories.map((category) => ({
              href: `/shop/${category.slug}`,
              label: category.name,
            })),
          },
          { title: "Help", links: helpLinks },
        ].map((group) => (
          <div key={group.title}>
            <p className="text-[11px] tracking-[0.3em] text-gold uppercase">
              {group.title}
            </p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/70">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p
        aria-hidden="true"
        className="mt-16 overflow-hidden text-center font-serif text-[22vw] leading-[0.8] tracking-[0.08em] text-ivory/[0.06] select-none"
      >
        VELORA
      </p>
      <Separator className="bg-ivory/10" />
      <p className="py-6 text-center text-xs text-ivory/50">
        © Velora. All rights reserved.
      </p>
    </footer>
  );
}
