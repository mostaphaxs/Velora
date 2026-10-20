import { Heart } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/skeletons";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentCustomer, getWishlistProducts } from "@/lib/account";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default function WishlistPage() {
  return (
    <div className="px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-serif text-4xl">Wishlist</h1>
      <p className="mt-2 text-taupe">Pieces you&apos;ve saved for later.</p>
      {/* Reads the session cookie, so it streams in at request time */}
      <Suspense fallback={<div className="mt-10"><ProductGridSkeleton count={5} /></div>}>
        <WishlistContent />
      </Suspense>
    </div>
  );
}

async function WishlistContent() {
  if (!(await getCurrentCustomer())) redirect("/login?next=/wishlist");

  const products = await getWishlistProducts();

  if (products.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center bg-sand px-6 py-14 text-center">
        <Heart className="size-8 text-gold-dark" strokeWidth={1.5} />
        <p className="mt-3 text-sm text-taupe">Tap the heart on any piece to save it here.</p>
        <Link href="/shop" className={cn(buttonVariants({ size: "xl" }), "mt-6")}>
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <ProductGrid products={products} />
    </div>
  );
}
