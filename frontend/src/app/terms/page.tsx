import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, InfoSection } from "@/components/info-page";
import { storeConfig } from "@/lib/store-config";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of sale",
};

// Draft terms of sale. Have them reviewed before launch.
export default function TermsPage() {
  return (
    <InfoPage
      title="Terms of sale"
      intro="The conditions that apply when you order from Velora."
    >
      <InfoSection heading="Ordering">
        <p>
          You can order as a guest or with an account. After you place an order we
          contact you by phone or WhatsApp to confirm it. An order is final once we
          have confirmed it with you.
        </p>
        <p>
          Orders that we can&apos;t confirm within a few days are cancelled
          automatically and the items are put back on sale.
        </p>
      </InfoSection>

      <InfoSection heading="Prices and payment">
        <p>
          Prices are in Moroccan dirhams (MAD), taxes included. Payment is cash on
          delivery: you pay the delivery person when you receive your order.
        </p>
      </InfoSection>

      <InfoSection heading="Delivery">
        <p>
          We deliver across Morocco. Shipping is free on orders over{" "}
          {formatPrice(storeConfig.freeShippingThreshold)}, otherwise{" "}
          {formatPrice(storeConfig.shippingCost)}. Delivery times are on our{" "}
          <Link href="/shipping-returns" className="underline">shipping &amp; returns</Link>{" "}
          page and are estimates, not guarantees.
        </p>
      </InfoSection>

      <InfoSection heading="Returns">
        <p>
          You can return unworn items within 30 days of delivery, in their original
          packaging. For hygiene reasons, earrings can only be returned if still
          sealed. Contact us with your order number to start a return.
        </p>
      </InfoSection>

      <InfoSection heading="Products">
        <p>
          We describe and photograph our pieces as accurately as possible, but colors
          can look slightly different depending on your screen. Plated jewelry lasts
          longest when cared for as described in our{" "}
          <Link href="/jewelry-care" className="underline">jewelry care</Link> guide.
        </p>
      </InfoSection>

      <InfoSection heading="Your data">
        <p>
          How we handle your personal data is explained in our{" "}
          <Link href="/privacy" className="underline">privacy policy</Link>.
        </p>
      </InfoSection>

      <InfoSection heading="Contact and applicable law">
        <p>
          Questions? Write to{" "}
          <a href={`mailto:${storeConfig.email}`} className="underline">
            {storeConfig.email}
          </a>
          . These terms are governed by Moroccan law, including Law 31-08 on
          consumer protection.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
