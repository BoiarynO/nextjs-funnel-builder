"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { useAppLoadingStore } from "@/stores/appLoadingStore";

/**
 * Keeps `isAuthLoading` in Zustand in sync with NextAuth session status.
 * Must render under SessionProvider.
 */
export default function SessionLoadingSync() {
  const status = useSession().status;
  const setAuthLoading = useAppLoadingStore((s) => s.setAuthLoading);

  useEffect(() => {
    setAuthLoading(status === "loading");
  }, [setAuthLoading, status]);

  return null;
}
