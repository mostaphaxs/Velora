import "server-only";
import { z } from "zod";
import { productSchema, type Product } from "@/lib/api";
import { apiFetch, getSessionToken } from "@/lib/session";

const userSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
});

const orderSchema = z.object({
  reference: z.string(),
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
  total: z.number(),
  shipping: z.number(),
  city: z.string(),
  createdAt: z.string().nullable(),
  items: z.array(
    z.object({
      productName: z.string(),
      color: z.string().nullable(),
      quantity: z.number(),
      lineTotal: z.number(),
    }),
  ),
});

export type Customer = z.infer<typeof userSchema>;
export type CustomerOrder = z.infer<typeof orderSchema>;

// The signed-in customer, or null when there is no valid session.
export async function getCurrentCustomer(): Promise<Customer | null> {
  if (!(await getSessionToken())) return null;

  const response = await apiFetch("/account");
  if (response.status === 401) return null;
  if (!response.ok) throw new Error(`Account request failed (${response.status})`);

  return z.object({ data: userSchema }).parse(await response.json()).data;
}

// The signed-in customer's most recent orders.
export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  const response = await apiFetch("/account/orders");
  if (response.status === 401) return [];
  if (!response.ok) throw new Error(`Orders request failed (${response.status})`);

  return z.object({ data: z.array(orderSchema) }).parse(await response.json()).data;
}

// The signed-in customer's saved products, most recent first.
export async function getWishlistProducts(): Promise<Product[]> {
  const response = await apiFetch("/account/wishlist");
  if (response.status === 401) return [];
  if (!response.ok) throw new Error(`Wishlist request failed (${response.status})`);

  return z.object({ data: z.array(productSchema) }).parse(await response.json()).data;
}
