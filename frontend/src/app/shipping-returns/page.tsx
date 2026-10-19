import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/info-page";
import { storeConfig } from "@/lib/store-config";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shipping & returns",
};

export default function ShippingReturnsPage() {
  return (
    <InfoPage
      title="Shipping & returns"
      intro="Everything you need to know about getting your order, and sending it back if it's not right."
    >
      <InfoSection heading="Shipping">
        <p>
          Orders over {formatPrice(storeConfig.freeShippingThreshold)} ship
          free. Smaller orders have a flat{" "}
          {formatPrice(storeConfig.shippingCost)} shipping fee.
        </p>
        <p>
          We pack and ship orders within 1–2 business days. Delivery usually
          takes 3–7 business days after that.
        </p>
        <p>You’ll get a tracking link by email as soon as your order ships.</p>
      </InfoSection>
      <InfoSection heading="Returns">
        <p>
          You can return any unworn item within 30 days of delivery, in its
          original packaging.
        </p>
        <p>
          For hygiene reasons, earrings can only be returned if they are still
          sealed.
        </p>
        <p>
          To start a return, contact us with your order number. Refunds go back
          to your original payment method within 5 business days of us
          receiving the item.
        </p>
      </InfoSection>
      <InfoSection heading="Exchanges">
        <p>
          Need a different ring size or chain length? Contact us and we’ll swap
          it for free.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
