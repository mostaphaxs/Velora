import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, InfoSection } from "@/components/info-page";
import { storeConfig } from "@/lib/store-config";

export const metadata: Metadata = {
  title: "Privacy policy",
};

// Draft written for Moroccan Law 09-08. Have it reviewed before launch, and once the
// processing is declared to the CNDP, add the declaration/authorisation number below.
export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy policy"
      intro="How Velora collects and uses your personal data, in line with Moroccan Law 09-08 on the protection of personal data."
    >
      <InfoSection heading="Who we are">
        <p>
          Velora is an online store for bags and jewelry based in Morocco. For any
          question about your data, write to{" "}
          <a href={`mailto:${storeConfig.email}`} className="underline">
            {storeConfig.email}
          </a>
          .
        </p>
      </InfoSection>

      <InfoSection heading="What we collect">
        <p>
          <strong>When you order:</strong> your name, phone number, city, delivery
          address, any notes you add, and the items you buy.
        </p>
        <p>
          <strong>If you create an account:</strong> your name, email address,
          optional phone number, password (stored encrypted, we can&apos;t read it),
          your order history and your wishlist.
        </p>
        <p>
          <strong>In your browser:</strong> your cart is saved on your device, and
          signed-in customers get a secure session cookie that keeps them logged in.
          We don&apos;t use advertising cookies.
        </p>
      </InfoSection>

      <InfoSection heading="Why we use it">
        <p>Only to run the store:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>to prepare, confirm and deliver your orders, including contacting you by phone or WhatsApp;</li>
          <li>to manage your account, order history and wishlist;</li>
          <li>to handle returns and answer your questions;</li>
          <li>to keep the records required by Moroccan accounting and tax rules.</li>
        </ul>
        <p>We never sell your data or use it for advertising without your consent.</p>
      </InfoSection>

      <InfoSection heading="Who can see it">
        <p>
          Only the Velora team, the delivery company that brings you your order
          (name, phone and address only), and the technical providers that host the
          store and send our internal order notifications. They may only use your
          data to provide that service.
        </p>
      </InfoSection>

      <InfoSection heading="How long we keep it">
        <p>
          Order records are kept for as long as accounting rules require. Account
          data is kept until you ask us to delete your account. You can empty your
          cart at any time.
        </p>
      </InfoSection>

      <InfoSection heading="Your rights">
        <p>
          Under Law 09-08 you can ask to access, correct or delete your data, and
          object to its use for legitimate reasons. Email{" "}
          <a href={`mailto:${storeConfig.email}`} className="underline">
            {storeConfig.email}
          </a>{" "}
          and we&apos;ll answer as quickly as possible. You can also contact the
          Commission Nationale de contrôle de la protection des Données à caractère
          Personnel (CNDP).
        </p>
      </InfoSection>

      <InfoSection heading="Security">
        <p>
          Your data travels over an encrypted connection, passwords are stored
          encrypted, and only authorised staff can access order details.
        </p>
        <p>
          See also our <Link href="/terms" className="underline">terms of sale</Link>.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
