import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <p className="text-[11px] tracking-[0.3em] text-gold-dark uppercase">Welcome back</p>
      <h1 className="mt-3 font-serif text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-taupe">Track your orders and check out faster.</p>
      {/* Reads ?next= from the URL */}
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
