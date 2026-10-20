"use client";

import { create } from "zustand";
import { getWishlistState, setWishlisted } from "@/app/wishlist/actions";

// The wishlist lives on the customer's account. This store mirrors it in the browser
// so hearts can show their state and update instantly.
type WishlistStore = {
  signedIn: boolean;
  slugs: Record<string, true>;
  // Page the state was last loaded for; signing in or out navigates, which triggers a reload
  loadedFor: string | null;
  load: (pathname: string) => Promise<void>;
  // Forget the loaded state, e.g. when the customer signs in, so the next page reloads it
  invalidate: () => void;
  toggle: (slug: string) => Promise<"saved" | "removed" | "login" | "error">;
};

// The load in progress, so a click made before it finishes waits for the real state
let pendingLoad: Promise<void> | null = null;

export const useWishlist = create<WishlistStore>()((set, get) => ({
  signedIn: false,
  slugs: {},
  loadedFor: null,
  load: async (pathname) => {
    if (get().loadedFor === pathname) return pendingLoad ?? undefined;
    set({ loadedFor: pathname });
    pendingLoad = getWishlistState()
      .then((state) =>
        set({
          signedIn: state.signedIn,
          slugs: Object.fromEntries(state.slugs.map((slug) => [slug, true as const])),
        }),
      )
      .catch(() => set({ loadedFor: null }));
    return pendingLoad;
  },
  invalidate: () => set({ loadedFor: null }),
  toggle: async (slug) => {
    if (pendingLoad) await pendingLoad;

    // The remembered state can be stale (e.g. signed in since it loaded), so ask the
    // server again before sending the customer to the login page
    if (!get().signedIn) {
      const fresh = await getWishlistState();
      set({
        signedIn: fresh.signedIn,
        slugs: Object.fromEntries(fresh.slugs.map((saved) => [saved, true as const])),
      });
      if (!fresh.signedIn) return "login";
    }

    const wasSaved = Boolean(get().slugs[slug]);
    const update = (saved: boolean) =>
      set((state) => {
        const slugs = { ...state.slugs };
        if (saved) slugs[slug] = true;
        else delete slugs[slug];
        return { slugs };
      });

    update(!wasSaved);
    const result = await setWishlisted(slug, !wasSaved);
    if (result.ok) return wasSaved ? "removed" : "saved";

    update(wasSaved);
    if (result.requiresLogin) {
      set({ signedIn: false });
      return "login";
    }
    return "error";
  },
}));
