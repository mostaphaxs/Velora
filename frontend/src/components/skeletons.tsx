import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Placeholders shaped like the real content, so nothing shifts (and the footer
// doesn't jump) when the data arrives.

function Bone({ className }: { className?: string }) {
  return <Skeleton className={cn("rounded-none", className)} />;
}

function Loading({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

// Mirrors ProductCard: 4:5 photo tile, then name, price and material
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-[#f3f0eb]">
      <Bone className="aspect-[4/5] w-full bg-line/60" />
      <div className="space-y-2 px-3 pt-3 pb-4">
        <Bone className="h-3.5 w-3/4" />
        <Bone className="h-3.5 w-1/3" />
        <Bone className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Category page: title, tagline, category tabs, product grid
export function CategoryPageSkeleton() {
  return (
    <Loading label="Loading products">
      <Bone className="h-10 w-48" />
      <Bone className="mt-3 h-4 w-64" />
      <div className="mt-8 flex gap-2 overflow-hidden pb-1">
        {Array.from({ length: 6 }, (_, index) => (
          <Bone key={index} className="h-9 w-20 shrink-0" />
        ))}
      </div>
      <div className="mt-10">
        <ProductGridSkeleton />
      </div>
    </Loading>
  );
}

// Product page: breadcrumb, gallery with thumbnails, details column
export function ProductPageSkeleton() {
  return (
    <Loading label="Loading product">
      <Bone className="h-3 w-32" />
      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <Bone className="aspect-[4/5] w-full bg-line/60" />
          <div className="mt-3 grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Bone key={index} className="aspect-[4/5] w-full" />
            ))}
          </div>
        </div>
        <div className="md:py-6">
          <Bone className="h-6 w-20" />
          <Bone className="mt-4 h-12 w-3/4" />
          <Bone className="mt-4 h-7 w-28" />
          <div className="mt-6 space-y-2">
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-11/12" />
            <Bone className="h-4 w-2/3" />
          </div>
          <div className="mt-8 flex gap-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="size-9 rounded-full" />
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <Bone className="h-12 w-32" />
            <Bone className="h-12 flex-1" />
          </div>
          <div className="mt-10 space-y-3 border-t border-line pt-4">
            {Array.from({ length: 3 }, (_, index) => (
              <Bone key={index} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </Loading>
  );
}

// Account page: greeting, sign-out button, order rows
export function AccountSkeleton() {
  return (
    <Loading label="Loading your account">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Bone className="h-3 w-24" />
          <Bone className="mt-4 h-10 w-56" />
          <Bone className="mt-2 h-4 w-44" />
        </div>
        <Bone className="h-10 w-32" />
      </div>
      <Bone className="mt-14 h-7 w-36" />
      <div className="mt-6 divide-y divide-line border-y border-line">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="space-y-3 py-5">
            <div className="flex justify-between gap-4">
              <Bone className="h-4 w-32" />
              <Bone className="h-6 w-28" />
            </div>
            <Bone className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </Loading>
  );
}

function FieldSkeleton({ tall }: { tall?: boolean }) {
  return (
    <div>
      <Bone className="h-4 w-24" />
      <Bone className={cn("mt-2 w-full", tall ? "h-20" : "h-10")} />
    </div>
  );
}

// Order summary box used next to the cart and checkout
function SummarySkeleton() {
  return (
    <div className="h-fit space-y-4 bg-sand p-6">
      <Bone className="h-3 w-24 bg-line/70" />
      <Bone className="h-4 w-full bg-line/70" />
      <Bone className="h-4 w-full bg-line/70" />
      <Bone className="h-5 w-full bg-line/70" />
      <Bone className="h-12 w-full bg-line/70" />
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <Loading label="Loading checkout" className="mt-10 grid gap-12 md:grid-cols-[1fr_280px]">
      <div className="space-y-5">
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton tall />
        <FieldSkeleton tall />
        <Bone className="h-13 w-full" />
      </div>
      <SummarySkeleton />
    </Loading>
  );
}

export function CartSkeleton() {
  return (
    <Loading label="Loading your cart" className="mt-10 grid gap-12 md:grid-cols-[1fr_280px]">
      <div className="divide-y divide-line border-y border-line">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="flex gap-4 py-5">
            <Bone className="aspect-[4/5] w-20 shrink-0" />
            <div className="flex flex-1 flex-col justify-between">
              <div className="space-y-2">
                <Bone className="h-4 w-2/3" />
                <Bone className="h-3 w-1/3" />
              </div>
              <div className="flex justify-between">
                <Bone className="h-8 w-24" />
                <Bone className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <SummarySkeleton />
    </Loading>
  );
}

// Login, register and reset-password forms
export function AuthFormSkeleton({ fields = 2 }: { fields?: number }) {
  return (
    <Loading label="Loading form" className="mt-8 space-y-5">
      {Array.from({ length: fields }, (_, index) => (
        <FieldSkeleton key={index} />
      ))}
      <Bone className="h-13 w-full" />
      <Bone className="mx-auto h-4 w-48" />
    </Loading>
  );
}
