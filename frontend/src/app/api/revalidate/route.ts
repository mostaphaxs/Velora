import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

// Called by the Laravel backend whenever a product or category changes in the admin,
// so the shop shows the change on the very next page load.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET ?? "";
  const provided = request.headers.get("x-revalidate-secret") ?? "";

  if (!secret || !safeEqual(provided, secret)) {
    return Response.json({ revalidated: false }, { status: 401 });
  }

  // expire: 0 drops the cached catalog, so the next visitor gets fresh data
  revalidateTag("catalog", { expire: 0 });
  return Response.json({ revalidated: true });
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
