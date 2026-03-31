/**
 * Guest persistence: entire funnel list as one JSON string in localStorage.
 * Signed-in users use the server instead (see FunnelsDataLayer + funnelsApi).
 */
import type { Funnel } from "@/types/funnel";

const STORAGE_KEY = "funnels_storage_v1";

/** Read persisted funnels for guests; returns [] on SSR, corrupt JSON, or missing key. */
export function loadFunnelsFromLocalStorage(): Funnel[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as Funnel[];
  } catch {
    return [];
  }
}

/** Write-through for guests whenever the Zustand `funnels` array changes. */
export function saveFunnelsToLocalStorage(funnels: Funnel[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(funnels));
  } catch {
    // Quota exceeded or private mode; fail silently for now.
  }
}

// Backward-compatible aliases for existing imports.
export const loadFunnels = loadFunnelsFromLocalStorage;
export const saveFunnels = saveFunnelsToLocalStorage;
