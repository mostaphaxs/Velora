import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { SignedInRedirect } from "@/components/signed-in-redirect";
import { AuthFormSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <p className="text-[11px] tracking-[0.3em] text-gold-dark uppercase">Welcome back</p>
      <h1 className="mt-3 font-serif text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-taupe">Track your orders and check out faster.</p>
      {/* Reads the session cookie and ?next= from the URL */}
      <Suspense fallback={<AuthFormSkeleton fields={2} />}>
        <SignedInRedirect searchParams={searchParams} />
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
