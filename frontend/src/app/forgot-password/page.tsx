import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/password-forms";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <p className="text-[11px] tracking-[0.3em] text-gold-dark uppercase">Account help</p>
      <h1 className="mt-3 font-serif text-4xl">Forgot your password?</h1>
      <p className="mt-2 text-sm text-taupe">
        Enter your email and we&apos;ll send you a link to choose a new one.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
