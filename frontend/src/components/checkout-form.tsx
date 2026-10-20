"use client";

import { Check, LoaderCircle, MessageCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import {
  placeOrder,
  type FieldErrors,
  type PlacedOrder,
} from "@/app/checkout/actions";
import { CheckoutSkeleton } from "@/components/skeletons";
import { buttonVariants } from "@/components/ui/button";
import { cartLineKey, getSubtotal, useCart, useCartLines, useHydrated } from "@/lib/cart";
import { getShipping, storeConfig } from "@/lib/store-config";
import { cn, formatPrice } from "@/lib/utils";

type CustomerDetails = {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
};

// Guests confirm their order over WhatsApp. Built from the saved order so the totals match.
function buildOrderMessage(customer: CustomerDetails, order: PlacedOrder) {
  return [
    `Hello Velora, I'd like to confirm my order ${order.reference}:`,
    "",
    ...order.items.map(
      (item) =>
        `• ${item.quantity} × ${item.productName}${item.color ? ` (${item.color})` : ""}: ${formatPrice(item.lineTotal)}`,
    ),
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Shipping: ${order.shipping === 0 ? "Free" : formatPrice(order.shipping)}`,
    `Total: ${formatPrice(order.total)}`,
    "",
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `City: ${customer.city}`,
    `Address: ${customer.address}`,
    ...(customer.notes ? [`Notes: ${customer.notes}`] : []),
  ].join("\n");
}

const inputClass =
  "mt-1 w-full border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold aria-invalid:border-destructive";

const accountPerks = [
  "Follow your order's status in My orders",
  "We contact you to confirm, no need to message us",
  "Your details are filled in next time",
];

function FieldError({ message }: { message?: string }) {
  return message ? (
    <span className="mt-1 block text-xs text-destructive">{message}</span>
  ) : null;
}

export function CheckoutForm({
  customer,
}: {
  // The signed-in customer, or null for guests
  customer: { name: string; phone: string | null } | null;
}) {
  const hydrated = useHydrated();
  const lines = useCartLines();
  const clear = useCart((state) => state.clear);
  const [checkoutAsGuest, setCheckoutAsGuest] = useState(false);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, startTransition] = useTransition();

  const signedIn = customer !== null;

  if (!hydrated) {
    return <CheckoutSkeleton />;
  }

  if (placed) {
    return (
      <div className="mt-10 bg-sand p-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold text-ivory">
          <Check className="size-5" />
        </span>
        <p className="mt-4 text-xs tracking-[0.3em] text-gold-dark uppercase">
          Order {placed.reference}
        </p>
        <h2 className="mt-3 font-serif text-3xl">Thank you!</h2>
        <p className="mx-auto mt-3 max-w-md text-taupe">
          {signedIn
            ? "Your order is placed. We'll contact you on WhatsApp shortly to confirm delivery."
            : "Your order is saved and WhatsApp has opened with the details. Send the message there and we'll confirm your order shortly."}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {signedIn && (
            <Link href="/account" className={buttonVariants({ size: "xl" })}>
              View my orders
            </Link>
          )}
          <Link
            href="/shop"
            className={buttonVariants({ size: "xl", variant: signedIn ? "line" : "default" })}
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mt-10">
        <p className="text-taupe">Your cart is empty.</p>
        <Link href="/shop" className={cn(buttonVariants({ size: "xl" }), "mt-6")}>
          Continue shopping
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal(lines);
  const shipping = getShipping(subtotal);

  const summary = (
    <aside className="h-fit bg-sand p-6">
      <h2 className="text-xs font-medium tracking-widest uppercase">Your order</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {lines.map(({ product, quantity }) => (
          <li key={cartLineKey(product)} className="flex justify-between gap-4">
            <span>
              {quantity} × {product.name}
              {product.color && <span className="text-taupe"> ({product.color})</span>}
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
  );

  // Guests are invited to sign in first; WhatsApp checkout stays available if they decline
  if (!signedIn && !checkoutAsGuest) {
    return (
      <div className="mt-10 grid gap-12 md:grid-cols-[1fr_280px]">
        <div className="border border-line p-8">
          <p className="text-[11px] tracking-[0.3em] text-gold-dark uppercase">
            Before you order
          </p>
          <h2 className="mt-3 font-serif text-3xl">Sign in for easier order handling</h2>
          <ul className="mt-5 space-y-2 text-sm text-ink/80">
            {accountPerks.map((perk) => (
              <li key={perk} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-gold-dark" />
                {perk}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/login?next=/checkout" className={buttonVariants({ size: "xl" })}>
              Sign in
            </Link>
            <Link
              href="/register?next=/checkout"
              className={buttonVariants({ size: "xl", variant: "line" })}
            >
              Create an account
            </Link>
          </div>
          <div className="mt-8 border-t border-line pt-6">
            <button
              type="button"
              onClick={() => setCheckoutAsGuest(true)}
              className="inline-flex items-center gap-2 text-sm underline underline-offset-4 hover:text-gold-dark"
            >
              <MessageCircle className="size-4" />
              No thanks, continue as a guest
            </button>
            <p className="mt-1 text-xs text-taupe">
              As a guest, you&apos;ll send your order to us on WhatsApp to confirm it.
            </p>
          </div>
        </div>
        {summary}
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const details: CustomerDetails = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      city: String(data.get("city") ?? "").trim(),
      address: String(data.get("address") ?? "").trim(),
      notes: String(data.get("notes") ?? "").trim(),
    };

    // Guests confirm on WhatsApp. Open the tab now, while the click still counts as a
    // user action, so pop-up blockers allow it once the order is saved.
    const whatsappTab = signedIn ? null : window.open("", "_blank");
    if (whatsappTab) whatsappTab.opener = null;

    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const result = await placeOrder({
        customerName: details.name,
        phone: details.phone,
        city: details.city,
        address: details.address,
        notes: details.notes || undefined,
        items: lines.map(({ product, quantity }) => ({
          slug: product.slug,
          color: product.color ?? undefined,
          quantity,
        })),
      });

      if (!result.ok) {
        whatsappTab?.close();
        setError(result.message);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }

      if (!signedIn) {
        const url = `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(
          buildOrderMessage(details, result.order),
        )}`;
        if (whatsappTab) whatsappTab.location.href = url;
        else window.location.href = url;
      }

      clear();
      setPlaced(result.order);
    });
  }

  return (
    <div className="mt-10 grid gap-12 md:grid-cols-[1fr_280px]">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {!signedIn && (
          <p className="flex items-center justify-between gap-3 bg-sand px-4 py-3 text-sm">
            <span>Checking out as a guest via WhatsApp.</span>
            <Link href="/login?next=/checkout" className="shrink-0 underline underline-offset-4 hover:text-gold-dark">
              Sign in instead
            </Link>
          </p>
        )}
        {error && (
          <p role="alert" className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}
        <label className="block text-sm">
          Full name
          <input
            name="name"
            required
            autoComplete="name"
            defaultValue={customer?.name}
            aria-invalid={Boolean(fieldErrors.customerName)}
            className={inputClass}
          />
          <FieldError message={fieldErrors.customerName} />
        </label>
        <label className="block text-sm">
          Phone number
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            defaultValue={customer?.phone ?? undefined}
            aria-invalid={Boolean(fieldErrors.phone)}
            className={inputClass}
          />
          <FieldError message={fieldErrors.phone} />
        </label>
        <label className="block text-sm">
          City
          <input
            name="city"
            required
            autoComplete="address-level2"
            aria-invalid={Boolean(fieldErrors.city)}
            className={inputClass}
          />
          <FieldError message={fieldErrors.city} />
        </label>
        <label className="block text-sm">
          Address
          <textarea
            name="address"
            required
            rows={3}
            autoComplete="street-address"
            aria-invalid={Boolean(fieldErrors.address)}
            className={inputClass}
          />
          <FieldError message={fieldErrors.address} />
        </label>
        <label className="block text-sm">
          Notes <span className="text-taupe">(optional)</span>
          <textarea
            name="notes"
            rows={2}
            placeholder="Ring size, chain length, delivery time…"
            className={inputClass}
          />
          <FieldError message={fieldErrors.notes} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className={cn(buttonVariants({ size: "xl" }), "w-full", pending && "opacity-70")}
        >
          {pending ? (
            <LoaderCircle className="animate-spin" />
          ) : signedIn ? (
            <ShoppingBag />
          ) : (
            <MessageCircle />
          )}
          {pending
            ? "Placing your order…"
            : signedIn
              ? "Place order"
              : "Send order on WhatsApp"}
        </button>
      </form>

      {summary}
    </div>
  );
}
