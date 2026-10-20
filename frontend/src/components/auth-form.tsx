"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login, register, type AuthFormState } from "@/app/account/actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist";

const inputClass =
  "mt-1 w-full border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold aria-invalid:border-destructive";

function Field({
  label,
  error,
  hint,
  ...props
}: React.ComponentProps<"input"> & { label: string; error?: string; hint?: string }) {
  return (
    <label className="block text-sm">
      {label}
      {hint && <span className="text-taupe"> {hint}</span>}
      <input aria-invalid={Boolean(error)} className={inputClass} {...props} />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    mode === "login" ? login : register,
    {},
  );
  // e.g. /login?next=/checkout sends the customer back to checkout after signing in
  const next = useSearchParams().get("next") ?? "";
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : "";
  const invalidateWishlist = useWishlist((store) => store.invalidate);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    // Signing in changes the wishlist, so hearts reload it on the next page
    <form action={action} onSubmit={invalidateWishlist} noValidate className="mt-8 space-y-5">
      <input type="hidden" name="next" value={next} />
      {state.message && (
        <p role="alert" className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.message}
        </p>
      )}

      {mode === "register" && (
        <Field label="Full name" name="name" autoComplete="name" defaultValue={values.name} error={errors.name} />
      )}
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={values.email}
        error={errors.email}
      />
      {mode === "register" && (
        <Field
          label="Phone"
          hint="(optional)"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="06 12 34 56 78"
          defaultValue={values.phone}
          error={errors.phone}
        />
      )}
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        error={errors.password}
      />
      {mode === "register" && (
        <Field
          label="Confirm password"
          name="passwordConfirmation"
          type="password"
          autoComplete="new-password"
          error={errors.passwordConfirmation}
        />
      )}

      <button type="submit" disabled={pending} className={cn(buttonVariants({ size: "xl" }), "w-full")}>
        {pending && <LoaderCircle className="animate-spin" />}
        {mode === "login" ? "Sign in" : "Create account"}
      </button>

      <p className="text-center text-sm text-taupe">
        {mode === "login" ? (
          <>
            New to Velora?{" "}
            <Link href={`/register${nextQuery}`} className="text-ink underline underline-offset-4 hover:text-gold-dark">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href={`/login${nextQuery}`} className="text-ink underline underline-offset-4 hover:text-gold-dark">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
