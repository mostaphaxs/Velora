import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { SignedInRedirect } from "@/components/signed-in-redirect";
import { AuthFormSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Create an account",
};

export default function RegisterPage({ searchParams }: PageProps<"/register">) {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <p className="text-[11px] tracking-[0.3em] text-gold-dark uppercase">Join Velora</p>
      <h1 className="mt-3 font-serif text-4xl">Create an account</h1>
      <p className="mt-2 text-sm text-taupe">
        See your orders and their status in one place.
      </p>
      {/* Reads the session cookie and ?next= from the URL */}
      <Suspense fallback={<AuthFormSkeleton fields={5} />}>
        <SignedInRedirect searchParams={searchParams} />
        <AuthForm mode="register" />
      </Suspense>
    </div>
  );
}
