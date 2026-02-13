import { create } from "zustand";

import type { Funnel } from "@/types/funnel";
import { MAX_FUNNELS } from "@/config/limits";
import { loadFunnels, saveFunnels } from "@/utils/funnelsStorage";

type FunnelsState = {
  funnels: Funnel[];
  selectedFunnelId: string | null;
  isCreatingFunnel: boolean;
};

type FunnelsActions = {
  initialize: () => void;
  selectFunnel: (funnel: Funnel) => void;
  startCreateFunnel: () => void;
  createFunnel: (newFunnel: Funnel) => void;
  deleteFunnel: (id: string) => void;
  updateFunnel: (updatedFunnel: Funnel) => void;
};

export type FunnelsStore = FunnelsState & FunnelsActions;

export const useFunnelsStore = create<FunnelsStore>((set, get) => ({
  funnels: [],
  selectedFunnelId: null,
  isCreatingFunnel: false,

  initialize: () => {
    const stored = loadFunnels();
    if (stored.length > 0) {
      set({
        funnels: stored,
        selectedFunnelId: stored[0].id,
      });
    }
  },

  selectFunnel: (funnel: Funnel) => {
    set({
      selectedFunnelId: funnel.id,
      isCreatingFunnel: false,
    });
  },

  startCreateFunnel: () => {
    const { funnels } = get();
    if (funnels.length >= MAX_FUNNELS) return;
    set({ isCreatingFunnel: true });
  },

  createFunnel: (newFunnel: Funnel) => {
    set((state) => ({
      funnels: [...state.funnels, newFunnel],
      selectedFunnelId: newFunnel.id,
      isCreatingFunnel: false,
    }));
  },

  deleteFunnel: (id: string) => {
    set((state) => {
      const updated = state.funnels.filter((f) => f.id !== id);
      const selectedFunnelId =
        updated.length === 0
          ? null
          : state.selectedFunnelId === id
            ? updated[0].id
            : state.selectedFunnelId;
      return {
        funnels: updated,
        selectedFunnelId,
        isCreatingFunnel: false,
      };
    });
  },

  updateFunnel: (updatedFunnel: Funnel) => {
    set((state) => ({
      funnels: state.funnels.map((f) =>
        f.id === updatedFunnel.id ? updatedFunnel : f
      ),
    }));
  },
}));

useFunnelsStore.subscribe((state, prevState) => {
  if (state.funnels !== prevState.funnels) {
    saveFunnels(state.funnels);
  }
});
