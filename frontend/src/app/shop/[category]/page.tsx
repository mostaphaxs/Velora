import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategoryTabs } from "@/components/category-tabs";
import { ProductGrid } from "@/components/product-card";
import { getCategories, getCategory, getProducts } from "@/lib/api";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  return { title: (await getCategory(slug))?.name };
}

async function CategoryContent({
  params,
}: Pick<PageProps<"/shop/[category]">, "params">) {
  const { category: slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const items = await getProducts({ category: category.slug });

  return (
    <>
      <h1 className="font-serif text-4xl">{category.name}</h1>
      <p className="mt-2 text-taupe">{category.tagline}</p>
      <CategoryTabs active={category.slug} />
      <div className="mt-10">
        <ProductGrid products={items} />
      </div>
    </>
  );
}

export default function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  return (
    <div className="py-14 px-4 sm:px-6 lg:px-10">
      {/* Categories added later in the admin render on first visit, then get cached */}
      <Suspense fallback={<p className="text-taupe">Loading…</p>}>
        <CategoryContent params={params} />
      </Suspense>
    </div>
  );
}
