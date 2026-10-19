import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { ProductGrid } from "@/components/product-card";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop all",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-serif text-4xl">Shop all</h1>
      <p className="mt-2 text-taupe">{products.length} pieces</p>
      <CategoryTabs />
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
