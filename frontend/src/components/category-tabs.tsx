import Link from "next/link";
import { categories } from "@/lib/products";
import { cn } from "@/lib/utils";

export function CategoryTabs({ active }: { active?: string }) {
  const tabClass = (isActive: boolean) =>
    cn(
      "shrink-0 border px-4 py-2 text-sm transition-colors",
      isActive
        ? "border-ink bg-ink text-ivory"
        : "border-line hover:border-gold hover:text-gold",
    );

  return (
    <nav className="mt-8 flex gap-2 overflow-x-auto pb-1">
      <Link href="/shop" className={tabClass(!active)}>
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/shop/${category.slug}`}
          className={tabClass(active === category.slug)}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
