import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCategories } from "@/lib/api";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Velora",
    template: "%s · Velora",
  },
  description:
    "Velora is an accessories store for bags, rings, chains, earrings and bracelets, with pieces made for everyday wear.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const categories = await getCategories();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader categories={categories} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
