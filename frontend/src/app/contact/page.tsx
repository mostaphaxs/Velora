import { Clock, Mail, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { storeConfig } from "@/lib/store-config";

export const metadata: Metadata = {
  title: "Contact us",
};

export default function ContactPage() {
  const methods = [
    {
      icon: Mail,
      label: "Email",
      value: storeConfig.email,
      href: `mailto:${storeConfig.email}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: `+${storeConfig.whatsappNumber}`,
      href: `https://wa.me/${storeConfig.whatsappNumber}`,
    },
    { icon: Clock, label: "Hours", value: storeConfig.hours },
  ];

  return (
    <InfoPage
      title="Contact us"
      intro="Questions about an order, sizing or a piece you love? We usually reply within a day."
    >
      <ul className="grid gap-4 sm:grid-cols-3">
        {methods.map(({ icon: Icon, label, value, href }) => (
          <li key={label} className="border border-line p-5">
            <Icon className="size-5 text-gold" strokeWidth={1.5} />
            <p className="mt-3 text-xs tracking-widest uppercase">{label}</p>
            {href ? (
              <a href={href} className="mt-1 block text-sm hover:text-gold">
                {value}
              </a>
            ) : (
              <p className="mt-1 text-sm">{value}</p>
            )}
          </li>
        ))}
      </ul>
    </InfoPage>
  );
}
