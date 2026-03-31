/**
 * Client-side HTTP helpers for `/api/funnels`.
 * Runs in the browser; relies on NextAuth session cookies for auth on same-origin requests.
 */
import type { Funnel } from "@/types/funnel";

type SaveFunnelsRequestBody = {
  funnels: Funnel[];
};

/** Hydration: fetch persisted funnels after sign-in (or on funnel page mount when authed). */
export async function loadFunnelsFromServer(): Promise<Funnel[]> {
  const response = await fetch("/api/funnels", {
    method: "GET",
    // Always hit the network; do not use a cached GET from a previous session/tab.
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load funnels from server");
  }

  const payload = (await response.json()) as { funnels?: Funnel[] };
  return Array.isArray(payload.funnels) ? payload.funnels : [];
}

/** Persist full funnel list to the server (debounced caller is FunnelsDataLayer). */
export async function saveFunnelsToServer(funnels: Funnel[]): Promise<void> {
  const body: SaveFunnelsRequestBody = { funnels };

  const response = await fetch("/api/funnels", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to save funnels on server");
  }
}
