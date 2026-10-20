import { Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignOutButton } from "@/components/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentCustomer, getCustomerOrders, type CustomerOrder } from "@/lib/account";
import { cn, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My account",
};

const statusStyles: Record<CustomerOrder["status"], string> = {
  pending: "bg-sand text-ink",
  confirmed: "bg-ink text-ivory",
  shipped: "bg-gold text-ivory",
  delivered: "bg-[#4f6b4a] text-ivory",
  cancelled: "bg-destructive/10 text-destructive",
};

const dateFormatter = new Intl.DateTimeFormat("fr-MA", { dateStyle: "medium" });

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* Reads the session cookie, so it streams in at request time */}
      <Suspense fallback={<p className="text-taupe">Loading your account…</p>}>
        <AccountContent />
      </Suspense>
    </div>
  );
}

async function AccountContent() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/login");

  const orders = await getCustomerOrders();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.3em] text-gold-dark uppercase">My account</p>
          <h1 className="mt-3 font-serif text-4xl">Hello, {customer.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-taupe">{customer.email}</p>
        </div>
        <SignOutButton />
      </div>

      <h2 className="mt-14 font-serif text-2xl">My orders</h2>

      {orders.length === 0 ? (
        <div className="mt-6 flex flex-col items-center bg-sand px-6 py-12 text-center">
          <Package className="size-8 text-gold-dark" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-taupe">You haven&apos;t placed an order yet.</p>
          <Link href="/shop" className={cn(buttonVariants({ size: "xl" }), "mt-6")}>
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {orders.map((order) => (
            <li key={order.reference} className="py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium tracking-wide">{order.reference}</p>
                  <p className="text-xs text-taupe">
                    {order.createdAt && dateFormatter.format(new Date(order.createdAt))} · {order.city}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={cn("h-6 px-3 capitalize", statusStyles[order.status])}>
                    {order.status}
                  </Badge>
                  <p className="font-serif text-xl">{formatPrice(order.total)}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-taupe">
                {order.items.map((item) => `${item.quantity} × ${item.productName}`).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
