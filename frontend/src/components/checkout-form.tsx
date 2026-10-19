"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  getSubtotal,
  useCart,
  useCartLines,
  useHydrated,
  type CartLine,
} from "@/lib/cart";
import { getShipping, storeConfig } from "@/lib/store-config";
import { formatPrice } from "@/lib/utils";

type Customer = {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
};

function buildOrderMessage(customer: Customer, lines: CartLine[]) {
  const subtotal = getSubtotal(lines);
  const shipping = getShipping(subtotal);

  return [
    "Hello Velora, I'd like to place an order:",
    "",
    ...lines.map(
      ({ product, quantity }) =>
        `• ${quantity} × ${product.name} (${formatPrice(product.price * quantity)})`,
    ),
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `Shipping: ${shipping === 0 ? "Free" : formatPrice(shipping)}`,
    `Total: ${formatPrice(subtotal + shipping)}`,
    "",
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `City: ${customer.city}`,
    `Address: ${customer.address}`,
    ...(customer.notes ? [`Notes: ${customer.notes}`] : []),
  ].join("\n");
}

const inputClass =
  "mt-1 w-full border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold";

export function CheckoutForm() {
  const hydrated = useHydrated();
  const lines = useCartLines();
  const clear = useCart((state) => state.clear);
  const [sent, setSent] = useState(false);

  if (!hydrated) {
    return <p className="mt-10 text-taupe">Loading your order…</p>;
  }

  if (sent) {
    return (
      <div className="mt-10 bg-sand p-8 text-center">
        <h2 className="font-serif text-3xl">Thank you!</h2>
        <p className="mt-3 text-taupe">
          Your order was opened in WhatsApp. Send the message there and
          we&apos;ll confirm your order shortly.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-ink px-8 py-3.5 text-sm tracking-widest text-ivory uppercase hover:bg-gold"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mt-10">
        <p className="text-taupe">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-ink px-8 py-3.5 text-sm tracking-widest text-ivory uppercase hover:bg-gold"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal(lines);
  const shipping = getShipping(subtotal);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const customer: Customer = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      city: String(data.get("city") ?? "").trim(),
      address: String(data.get("address") ?? "").trim(),
      notes: String(data.get("notes") ?? "").trim(),
    };

    const message = buildOrderMessage(customer, lines);
    window.open(
      `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    clear();
    setSent(true);
  }

  return (
    <div className="mt-10 grid gap-12 md:grid-cols-[1fr_280px]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-sm">
          Full name
          <input name="name" required autoComplete="name" className={inputClass} />
        </label>
        <label className="block text-sm">
          Phone number
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          City
          <input
            name="city"
            required
            autoComplete="address-level2"
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          Address
          <textarea
            name="address"
            required
            rows={3}
            autoComplete="street-address"
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          Notes <span className="text-taupe">(optional)</span>
          <textarea
            name="notes"
            rows={2}
            placeholder="Ring size, chain length, delivery time…"
            className={inputClass}
          />
        </label>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 bg-ink py-3.5 text-sm tracking-widest text-ivory uppercase transition-colors hover:bg-gold"
        >
          <MessageCircle className="size-4" />
          Send order on WhatsApp
        </button>
      </form>

      <aside className="h-fit bg-sand p-6">
        <h2 className="text-xs font-medium tracking-widest uppercase">
          Your order
        </h2>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map(({ product, quantity }) => (
            <li key={product.slug} className="flex justify-between gap-4">
              <span>
                {quantity} × {product.name}
              </span>
              <span>{formatPrice(product.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
            <dt>Total</dt>
            <dd>{formatPrice(subtotal + shipping)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
