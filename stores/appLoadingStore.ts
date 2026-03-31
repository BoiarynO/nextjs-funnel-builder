import { create } from "zustand";

type AppLoadingState = {
  /** NextAuth session resolution in progress (mirrors `status === "loading"`). */
  isAuthLoading: boolean;
  /** Funnels list fetch / hydrate from API or localStorage (FunnelsDataLayer). */
  isFunnelsDataLoading: boolean;
  setAuthLoading: (loading: boolean) => void;
  setFunnelsDataLoading: (loading: boolean) => void;
};

export const useAppLoadingStore = create<AppLoadingState>((set) => ({
  isAuthLoading: true,
  isFunnelsDataLoading: true,
  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
  setFunnelsDataLoading: (isFunnelsDataLoading) => set({ isFunnelsDataLoading }),
}));
