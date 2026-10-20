import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

// Server-side base URL of the Laravel API, e.g. http://localhost:8000/api/v1
export const API_URL = process.env.API_URL ?? "http://localhost:8000/api/v1";

export const categorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  tagline: z.string().nullable(),
});

export const productSchema = z.object({
  slug: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.number().int(),
  compareAtPrice: z.number().int().nullable(),
  material: z.string(),
  description: z.string(),
  // Main photo (first in the gallery) and the full ordered gallery
  image: z.string().nullable(),
  images: z.array(z.string()),
  inStock: z.boolean(),
  isNew: z.boolean(),
  isBestseller: z.boolean(),
  // Ticked "Show in homepage hero" in the admin
  isFeatured: z.boolean(),
});

export type Category = z.infer<typeof categorySchema>;
export type Product = z.infer<typeof productSchema>;

// Fetches `{ data: ... }` from the API and validates its shape. Returns null on 404.
async function getData<T extends z.ZodType>(
  path: string,
  schema: T,
): Promise<z.infer<T> | null> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json" },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Catalog request failed: ${path} (${response.status})`);
  }

  const body = z.object({ data: z.unknown() }).parse(await response.json());
  return schema.parse(body.data);
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag("catalog");
  cacheLife("minutes");

  return (await getData("/categories", z.array(categorySchema))) ?? [];
}

export async function getCategory(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getProducts(
  filters: { category?: string; new?: boolean; bestseller?: boolean; featured?: boolean } = {},
): Promise<Product[]> {
  "use cache";
  cacheTag("catalog");
  cacheLife("minutes");

  const query = new URLSearchParams();
  if (filters.category) query.set("category", filters.category);
  if (filters.new) query.set("new", "1");
  if (filters.bestseller) query.set("bestseller", "1");
  if (filters.featured) query.set("featured", "1");
  const search = query.size > 0 ? `?${query}` : "";

  return (await getData(`/products${search}`, z.array(productSchema))) ?? [];
}

export async function getProduct(slug: string): Promise<Product | null> {
  "use cache";
  cacheTag("catalog");
  cacheLife("minutes");

  return getData(`/products/${encodeURIComponent(slug)}`, productSchema);
}
