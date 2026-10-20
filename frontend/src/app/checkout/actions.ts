"use server";

import { z } from "zod";
import { apiFetch } from "@/lib/session";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name.").max(100),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s.\-()]/g, ""))
    .pipe(
      z
        .string()
        .regex(/^(?:\+212|0)[5-7]\d{8}$/, "Enter a valid Moroccan number, e.g. 0612345678."),
    ),
  city: z.string().trim().min(2, "Please enter your city.").max(80),
  address: z.string().trim().min(5, "Please enter your full address.").max(255),
  notes: z.string().trim().max(500).optional(),
  items: z
    .array(
      z.object({
        slug: z.string().min(1).max(255),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1, "Your cart is empty.")
    .max(30),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;
export type FieldErrors = Partial<Record<"customerName" | "phone" | "city" | "address" | "notes" | "items", string>>;

const placedOrderSchema = z.object({
  data: z.object({
    reference: z.string(),
    subtotal: z.number(),
    shipping: z.number(),
    total: z.number(),
    items: z.array(
      z.object({
        productName: z.string(),
        quantity: z.number(),
        lineTotal: z.number(),
      }),
    ),
  }),
});

export type PlacedOrder = z.infer<typeof placedOrderSchema>["data"];

export type CheckoutResult =
  | { ok: true; order: PlacedOrder }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

// Laravel field names -> form field names
const backendFields: Record<string, keyof FieldErrors> = {
  customer_name: "customerName",
  phone: "phone",
  city: "city",
  address: "address",
  notes: "notes",
};

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof FieldErrors;
      fieldErrors[field] ??= issue.message;
    }
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }

  const { customerName, notes, ...rest } = parsed.data;

  let response: Response;
  try {
    // Sends the session token when signed in, so the order shows up under "My orders"
    response = await apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify({ ...rest, customer_name: customerName, notes: notes || null }),
    });
  } catch {
    return { ok: false, message: "We couldn't reach the shop right now. Please try again in a moment." };
  }

  if (response.status === 201) {
    return { ok: true, order: placedOrderSchema.parse(await response.json()).data };
  }

  if (response.status === 422) {
    const body = (await response.json().catch(() => ({}))) as { errors?: Record<string, string[]> };
    const fieldErrors: FieldErrors = {};
    for (const [key, messages] of Object.entries(body.errors ?? {})) {
      const field = backendFields[key] ?? (key.startsWith("items") ? "items" : undefined);
      if (field) fieldErrors[field] ??= messages[0];
    }
    return {
      ok: false,
      message: fieldErrors.items ?? "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  if (response.status === 429) {
    return { ok: false, message: "Too many attempts. Please wait a minute and try again." };
  }

  return { ok: false, message: "Something went wrong while placing your order. Please try again." };
}
