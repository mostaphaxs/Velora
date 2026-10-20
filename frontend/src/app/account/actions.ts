"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { apiFetch, clearSessionToken, setSessionToken } from "@/lib/session";

export type AuthFormState = {
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "phone" | "password" | "passwordConfirmation", string>>;
  // Echoed back so the form keeps what the customer typed (never the password)
  values?: { name?: string; email?: string; phone?: string };
};

const loginSchema = z.object({
  email: z.email("Enter a valid email address.").max(255),
  password: z.string().min(1, "Enter your password.").max(255),
});

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name.").max(100),
    email: z.email("Enter a valid email address.").max(255),
    phone: z
      .string()
      .trim()
      .transform((value) => value.replace(/[\s.\-()]/g, ""))
      .pipe(
        z.union([
          z.literal(""),
          z.string().regex(/^(?:\+212|0)[5-7]\d{8}$/, "Enter a valid Moroccan number, e.g. 0612345678."),
        ]),
      ),
    password: z.string().min(8, "Use at least 8 characters.").max(255),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match.",
    path: ["passwordConfirmation"],
  });

const tokenResponseSchema = z.object({ token: z.string().min(1) });

function firstErrors(issues: z.core.$ZodIssue[]): AuthFormState["fieldErrors"] {
  const errors: NonNullable<AuthFormState["fieldErrors"]> = {};
  for (const issue of issues) {
    const field = issue.path[0] as keyof typeof errors;
    errors[field] ??= issue.message;
  }
  return errors;
}

// Where to go after signing in. Only same-site paths like "/checkout" are allowed,
// so a crafted link can't bounce customers to another website.
function safeNextPath(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value : "";
  return /^\/(?!\/)[\w\-/]*$/.test(path) ? path : "/account";
}

const unreachable = "We couldn't reach the shop right now. Please try again in a moment.";
const tooMany = "Too many attempts. Please wait a minute and try again.";

export async function login(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = { email: String(formData.get("email") ?? "").trim().toLowerCase() };
  const parsed = loginSchema.safeParse({ ...values, password: formData.get("password") ?? "" });
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error.issues), values };

  let response: Response;
  try {
    response = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify(parsed.data) });
  } catch {
    return { message: unreachable, values };
  }

  if (response.status === 429) return { message: tooMany, values };
  if (response.status === 422) return { message: "Incorrect email or password.", values };
  if (!response.ok) return { message: "Something went wrong. Please try again.", values };

  await setSessionToken(tokenResponseSchema.parse(await response.json()).token);
  redirect(safeNextPath(formData.get("next")));
}

export async function register(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    phone: String(formData.get("phone") ?? "").trim(),
  };
  const parsed = registerSchema.safeParse({
    ...values,
    password: formData.get("password") ?? "",
    passwordConfirmation: formData.get("passwordConfirmation") ?? "",
  });
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error.issues), values };

  const { passwordConfirmation, phone, ...rest } = parsed.data;

  let response: Response;
  try {
    response = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ ...rest, phone: phone || null, password_confirmation: passwordConfirmation }),
    });
  } catch {
    return { message: unreachable, values };
  }

  if (response.status === 429) return { message: tooMany, values };
  if (response.status === 422) {
    const body = (await response.json().catch(() => ({}))) as { errors?: Record<string, string[]> };
    const errors = body.errors ?? {};
    return {
      fieldErrors: {
        name: errors.name?.[0],
        email: errors.email?.[0],
        phone: errors.phone?.[0],
        password: errors.password?.[0],
      },
      values,
    };
  }
  if (!response.ok) return { message: "Something went wrong. Please try again.", values };

  await setSessionToken(tokenResponseSchema.parse(await response.json()).token);
  redirect(safeNextPath(formData.get("next")));
}

export async function logout() {
  // Revoke the token in Laravel too, so a copied cookie stops working
  await apiFetch("/auth/logout", { method: "POST" }).catch(() => null);
  await clearSessionToken();
  redirect("/");
}
