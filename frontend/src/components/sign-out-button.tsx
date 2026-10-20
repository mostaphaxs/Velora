"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/app/account/actions";
import { buttonVariants } from "@/components/ui/button";
import { useWishlist } from "@/lib/wishlist";

// Signs out and forgets the wishlist state, so hearts reload as a guest on the next page.
export function SignOutButton() {
  const invalidateWishlist = useWishlist((state) => state.invalidate);

  return (
    <form action={logout} onSubmit={invalidateWishlist}>
      <button type="submit" className={buttonVariants({ variant: "line", size: "lg" })}>
        <LogOut /> Sign out
      </button>
    </form>
  );
}
