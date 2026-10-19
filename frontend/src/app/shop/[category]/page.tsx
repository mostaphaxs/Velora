import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryTabs } from "@/components/category-tabs";
import { ProductGrid } from "@/components/product-card";
import { categories, getCategory, getProductsByCategory } from "@/lib/products";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  return { title: getCategory(slug)?.name };
}

export default async function CategoryPage({
  params,
}: PageProps<"/shop/[category]">) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = getProductsByCategory(category.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-serif text-4xl">{category.name}</h1>
      <p className="mt-2 text-taupe">{category.tagline}</p>
      <CategoryTabs active={category.slug} />
      <div className="mt-10">
        <ProductGrid products={items} />
      </div>
    </div>
  );
}
