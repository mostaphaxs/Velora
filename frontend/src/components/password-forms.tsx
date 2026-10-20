"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import {
  requestPasswordReset,
  resetPassword,
  type PasswordFormState,
} from "@/app/account/actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1 w-full border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold aria-invalid:border-destructive";

function Notice({ state }: { state: PasswordFormState }) {
  if (state.success) {
    return <p role="status" className="bg-sand px-4 py-3 text-sm">{state.success}</p>;
  }
  if (state.message) {
    return (
      <p role="alert" className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {state.message}
      </p>
    );
  }
  return null;
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<PasswordFormState, FormData>(requestPasswordReset, {});

  return (
    <form action={action} noValidate className="mt-8 space-y-5">
      <Notice state={state} />
      <label className="block text-sm">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(state.fieldErrors?.email)}
          className={inputClass}
        />
        {state.fieldErrors?.email && (
          <span className="mt-1 block text-xs text-destructive">{state.fieldErrors.email}</span>
        )}
      </label>
      <button type="submit" disabled={pending} className={cn(buttonVariants({ size: "xl" }), "w-full")}>
        {pending && <LoaderCircle className="animate-spin" />}
        Send reset link
      </button>
      <p className="text-center text-sm text-taupe">
        Remembered it?{" "}
        <Link href="/login" className="text-ink underline underline-offset-4 hover:text-gold-dark">
          Sign in
        </Link>
      </p>
    </form>
  );
}

// The email links here with ?token=...&email=...
export function ResetPasswordForm() {
  const params = useSearchParams();
  const [state, action, pending] = useActionState<PasswordFormState, FormData>(resetPassword, {});

  return (
    <form action={action} noValidate className="mt-8 space-y-5">
      <input type="hidden" name="token" value={params.get("token") ?? ""} />
      <input type="hidden" name="email" value={params.get("email") ?? ""} />
      <Notice state={state} />
      {state.message && (
        <Link href="/forgot-password" className="block text-sm underline underline-offset-4">
          Request a new reset link
        </Link>
      )}
      {(
        [
          ["password", "New password"],
          ["passwordConfirmation", "Confirm new password"],
        ] as const
      ).map(([name, label]) => (
        <label key={name} className="block text-sm">
          {label}
          <input
            name={name}
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(state.fieldErrors?.[name])}
            className={inputClass}
          />
          {state.fieldErrors?.[name] && (
            <span className="mt-1 block text-xs text-destructive">{state.fieldErrors[name]}</span>
          )}
        </label>
      ))}
      <button type="submit" disabled={pending} className={cn(buttonVariants({ size: "xl" }), "w-full")}>
        {pending && <LoaderCircle className="animate-spin" />}
        Change password
      </button>
    </form>
  );
}
