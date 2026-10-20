"use client";

import { UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSessionSummary, type SessionSummary } from "@/app/account/actions";

// Account icon in the header: a gold dot shows when signed in.
// Re-checks on every page change, so signing in or out shows up straight away.
export function HeaderAccount() {
  const pathname = usePathname();
  const [session, setSession] = useState<SessionSummary | null>(null);

  useEffect(() => {
    let current = true;
    getSessionSummary()
      .then((summary) => current && setSession(summary))
      .catch(() => current && setSession({ signedIn: false, firstName: null }));
    return () => {
      current = false;
    };
  }, [pathname]);

  const signedIn = session?.signedIn ?? false;

  return (
    <Link
      href={signedIn ? "/account" : "/login"}
      aria-label={signedIn ? "My account" : "Sign in"}
      className="p-2 hover:text-gold-dark"
    >
      <span className="relative">
        <UserRound className="size-4.5" strokeWidth={1.5} />
        {signedIn && (
          <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full bg-gold ring-2 ring-ivory" aria-hidden="true" />
        )}
      </span>
    </Link>
  );
}
