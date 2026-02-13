import { create } from "zustand";

import type { Funnel } from "@/types/funnel";
import { MAX_FUNNELS } from "@/utils/config/limits";
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

export const useFunnelsStore = create<FunnelsStore>((set) => ({
  funnels: [],
  selectedFunnelId: null,
  isCreatingFunnel: false,

  /* initialize is used to load the funnels from the storage and select the first funnel as default */
  initialize: () => {
    const stored = loadFunnels();
    if (stored.length > 0) {
      set({
        funnels: stored,
        selectedFunnelId: stored[0].id,
      });
    }
  },

  /* selectFunnel is used to select a funnel from the list, view the funnel editor and reset the create funnel mode */
  selectFunnel: (funnel: Funnel) => {
    set({
      selectedFunnelId: funnel.id,
      isCreatingFunnel: false,
    });
  },

  /* startCreateFunnel is used to start the create funnel mode */
  startCreateFunnel: () => {
    set((state) => {
      if (state.funnels.length >= MAX_FUNNELS) return state;
      return { isCreatingFunnel: true };
    });
  },

  /* 
  createFunnel is used to create a new funnel and select it.
  input is a whole new funnel object with all the properties
  it also resets the create funnel mode 
  */
  createFunnel: (newFunnel: Funnel) => {
    set((state) => ({
      funnels: [...state.funnels, newFunnel],
      selectedFunnelId: newFunnel.id,
      isCreatingFunnel: false,
    }));
  },

  /*  
  deleteFunnel is used to delete a funnel from the list
  input is the id of the funnel to delete
  it also adjusts the selected funnel id if the deleted funnel was selected 
  */
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

  /* 
  updateFunnel is used to update a funnel in the list
  input is the updated funnel object with all the properties
  it also updates the funnel in the list
  */
  updateFunnel: (updatedFunnel: Funnel) => {
    set((state) => ({
      funnels: state.funnels.map((f) =>
        f.id === updatedFunnel.id ? updatedFunnel : f
      ),
    }));
  },
}));

/* 
subscribe is used to save the funnels to the storage whenever the funnels state changes
it is a subscriber that runs whenever the funnels state changes
it saves the funnels to the storage
*/
useFunnelsStore.subscribe((state, prevState) => {
  if (state.funnels !== prevState.funnels) {
    saveFunnels(state.funnels);
  }
});
