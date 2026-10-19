import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="font-serif text-4xl">Checkout</h1>
      <p className="mt-2 text-taupe">
        Fill in your details and send your order on WhatsApp. We&apos;ll confirm
        it with you there. Payment is cash on delivery.
      </p>
      <CheckoutForm />
    </div>
  );
}

