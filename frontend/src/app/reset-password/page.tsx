import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/password-forms";
import { AuthFormSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Choose a new password",
};

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <p className="text-[11px] tracking-[0.3em] text-gold-dark uppercase">Account help</p>
      <h1 className="mt-3 font-serif text-4xl">Choose a new password</h1>
      {/* Reads the token from the link in the email */}
      <Suspense fallback={<AuthFormSkeleton fields={2} />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
