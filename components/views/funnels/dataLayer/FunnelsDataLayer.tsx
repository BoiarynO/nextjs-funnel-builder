/**
 * Persistence orchestration for the funnels page.
 * - Hydrates Zustand from server (authed) or localStorage (guest).
 * - Persists changes: debounced PUT for authed users, immediate localStorage for guests.
 * The store itself does not know about HTTP or localStorage.
 */
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import { useFunnelsStore } from "@/stores/funnelsStore";
import {
  loadFunnelsFromLocalStorage,
  saveFunnelsToLocalStorage,
} from "@/utils/funnelsStorage";
import { loadFunnelsFromServer, saveFunnelsToServer } from "@/utils/funnelsApi";

const FunnelsDataLayer = () => {
  const { data: session, status } = useSession();
  const initialize = useFunnelsStore((state) => state.initialize);
  const funnels = useFunnelsStore((state) => state.funnels);
  // Gate the save effect until initial load finished (avoid PUT with stale []).
  const isHydratedRef = useRef(false);

  // --- Hydration: run when session is known (not "loading") ---
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    let isCancelled = false;
    const isAuthorized = Boolean(session?.user?.email);

    async function hydrateStore() {
      if (isAuthorized) {
        try {
          const serverFunnels = await loadFunnelsFromServer();
          if (isCancelled) return;

          if (serverFunnels.length > 0) {
            initialize(serverFunnels);
            isHydratedRef.current = true;
            return;
          }

          // Server empty: seed from guest localStorage once, then upload (first-time account setup).
          const localFunnels = loadFunnelsFromLocalStorage();
          initialize(localFunnels);
          if (localFunnels.length > 0) {
            await saveFunnelsToServer(localFunnels);
          }
          isHydratedRef.current = true;
          return;
        } catch {
          // Network/API error: still show something; guest copy is the offline fallback.
          initialize(loadFunnelsFromLocalStorage());
          isHydratedRef.current = true;
          return;
        }
      }

      initialize(loadFunnelsFromLocalStorage());
      isHydratedRef.current = true;
    }

    void hydrateStore();

    return () => {
      isCancelled = true;
    };
  }, [initialize, session?.user?.email, status]);

  // --- Persistence: react to any change of the funnel list in Zustand ---
  useEffect(() => {
    if (!isHydratedRef.current || status === "loading") {
      return;
    }

    const isAuthorized = Boolean(session?.user?.email);
    if (!isAuthorized) {
      saveFunnelsToLocalStorage(funnels);
      return;
    }

    // Debounce rapid edits (typing, multiple store updates) into fewer PUT requests.
    const timerId = window.setTimeout(() => {
      void saveFunnelsToServer(funnels);
    }, 350);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [funnels, session?.user?.email, status]);

  return null;
};

export default FunnelsDataLayer;
