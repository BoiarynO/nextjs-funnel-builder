/**
 * Persistence orchestration for the funnels page.
 * - Hydrates Zustand from server (authed) or localStorage (guest).
 * - Persists changes: debounced PUT for authed users, immediate localStorage for guests.
 * The store itself does not know about HTTP or localStorage.
 */
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import { useAppLoadingStore } from "@/stores/appLoadingStore";
import { useFunnelsStore } from "@/stores/funnelsStore";
import {
  loadFunnelsFromLocalStorage,
  saveFunnelsToLocalStorage,
} from "@/utils/funnelsStorage";
import { loadFunnelsFromServer, saveFunnelsToServer } from "@/utils/funnelsApi";

const FunnelsDataLayer = () => {
  const { data: session } = useSession();
  const isAuthLoading = useAppLoadingStore((s) => s.isAuthLoading);
  const setFunnelsDataLoading = useAppLoadingStore(
    (s) => s.setFunnelsDataLoading
  );
  const initialize = useFunnelsStore((state) => state.initialize);
  const funnels = useFunnelsStore((state) => state.funnels);
  // Gate the save effect until initial load finished (avoid PUT with stale []).
  const isHydratedRef = useRef(false);

  // --- Hydration: run when session is known (not "loading") ---
  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    let isCancelled = false;
    const isAuthorized = Boolean(session?.user?.email);

    setFunnelsDataLoading(true);

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

    void (async () => {
      try {
        await hydrateStore();
      } finally {
        if (!isCancelled) {
          setFunnelsDataLoading(false);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [initialize, isAuthLoading, session?.user?.email, setFunnelsDataLoading]);

  // --- Persistence: react to any change of the funnel list in Zustand ---
  useEffect(() => {
    if (!isHydratedRef.current || isAuthLoading) {
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
  }, [funnels, isAuthLoading, session?.user?.email]);

  return null;
};

export default FunnelsDataLayer;
