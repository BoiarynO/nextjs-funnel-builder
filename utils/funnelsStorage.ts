import type { Funnel } from "@/types/funnel";

const STORAGE_KEY = "funnels_storage_v1";

export function loadFunnels(): Funnel[] {
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

export function saveFunnels(funnels: Funnel[]): void {
  console.log("saving funnels to storage", funnels);
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(funnels));
    console.log("saved funnels to storage");
  } catch {
    // Ignore write errors for now
  }
}
