"use server";

import { z } from "zod";
import { apiFetch, getSessionToken } from "@/lib/session";

export type WishlistState = { signedIn: boolean; slugs: string[] };

const slugListSchema = z.object({ data: z.array(z.object({ slug: z.string() })) });

// Which products the visitor has saved. Guests get an empty list.
export async function getWishlistState(): Promise<WishlistState> {
  if (!(await getSessionToken())) return { signedIn: false, slugs: [] };

  const response = await apiFetch("/account/wishlist");
  if (response.status === 401) return { signedIn: false, slugs: [] };
  if (!response.ok) return { signedIn: true, slugs: [] };

  const { data } = slugListSchema.parse(await response.json());
  return { signedIn: true, slugs: data.map((product) => product.slug) };
}

const toggleSchema = z.object({
  slug: z.string().regex(/^[\w-]+$/).max(255),
  saved: z.boolean(),
});

// Saves or removes a product. Returns requiresLogin for guests so the UI can send them to sign in.
export async function setWishlisted(
  slug: string,
  saved: boolean,
): Promise<{ ok: true } | { ok: false; requiresLogin: boolean }> {
  const parsed = toggleSchema.safeParse({ slug, saved });
  if (!parsed.success) return { ok: false, requiresLogin: false };

  if (!(await getSessionToken())) return { ok: false, requiresLogin: true };

  const response = await apiFetch(`/account/wishlist/${encodeURIComponent(parsed.data.slug)}`, {
    method: parsed.data.saved ? "PUT" : "DELETE",
  }).catch(() => null);

  if (response?.status === 401) return { ok: false, requiresLogin: true };
  return response?.ok ? { ok: true } : { ok: false, requiresLogin: false };
}
