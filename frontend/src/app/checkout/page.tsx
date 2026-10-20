import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout-form";
import { getCurrentCustomer } from "@/lib/account";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="font-serif text-4xl">Checkout</h1>
      <p className="mt-2 text-taupe">Payment is cash on delivery.</p>
      {/* Reads the session cookie, so it streams in at request time */}
      <Suspense fallback={<p className="mt-10 text-taupe">Loading your order…</p>}>
        <CheckoutForCustomer />
      </Suspense>
    </div>
  );
}

async function CheckoutForCustomer() {
  const customer = await getCurrentCustomer();
  return (
    <CheckoutForm
      customer={customer ? { name: customer.name, phone: customer.phone } : null}
    />
  );
}
