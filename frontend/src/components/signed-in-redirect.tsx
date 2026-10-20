import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/account";
import { safeNextPath } from "@/lib/safe-path";

// On the login and register pages: customers who are already signed in go straight on
// to their account (or wherever ?next= points), instead of seeing the form again.
export async function SignedInRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (await getCurrentCustomer()) {
    redirect(safeNextPath((await searchParams).next));
  }
  return null;
}
