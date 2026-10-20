import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { ProductGrid } from "@/components/product-card";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Shop all",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="py-14 px-4 sm:px-6 lg:px-10">
      <h1 className="font-serif text-4xl">Shop all</h1>
      <p className="mt-2 text-taupe">{products.length} pieces</p>
      <CategoryTabs />
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
