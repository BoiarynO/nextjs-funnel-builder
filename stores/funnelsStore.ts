import { create } from "zustand";

import type { Funnel, Step, TranslationKeyFormat } from "@/types/funnel";
import { MAX_FUNNELS } from "@/utils/config/limits";
import { loadFunnels, saveFunnels } from "@/utils/funnelsStorage";
import { DEFAULT_COMPONENT_TYPES } from "@/utils/variables";
import { ReorderItem } from "@/components/ui/reorderList/ReorderList";

function reorderSteps(
  prevSteps: Step[],
  reorderedItems: ReorderItem[]
): Step[] {
  const stepMap = new Map(prevSteps.map((s) => [s.id, s]));
  return reorderedItems
    .map((item) => stepMap.get(item.id))
    .filter((s) => s != null);
}

type Draft = {
  name: string;
  translationKeyFormat: TranslationKeyFormat;
  componentTypes: string[];
  steps: Step[];
};

type FunnelsState = {
  funnels: Funnel[];
  selectedFunnelId: string | null;
  isCreatingFunnel: boolean;

  draft: Draft | null;
  editingStepId: string | null;
};

type FunnelsActions = {
  initialize: () => void;
  selectFunnel: (funnel: Funnel) => void;
  startCreateFunnel: () => void;
  createFunnel: (newFunnel: Funnel) => void;
  deleteFunnel: (id: string) => void;
  updateFunnel: (updatedFunnel: Funnel) => void;
  // settings via draft
  setEditingStepId: (id: string | null) => void;
  onDraftStartEdit: () => void;
  onDraftNameChange: (name: string) => void;
  onDraftTranslationKeyFormatChange: (format: TranslationKeyFormat) => void;
  onDraftComponentTypesChange: (types: string[]) => void;
  onDraftReorder: (reorderedItems: ReorderItem[]) => void;
  onSettingsSave: () => void;
  onSettingsCancel: () => void;
};

export type FunnelsStore = FunnelsState & FunnelsActions;

const resetDraftState = {
  draft: null,
  editingStepId: null,
};

export const useFunnelsStore = create<FunnelsStore>((set) => ({
  funnels: [],
  selectedFunnelId: null,
  isCreatingFunnel: false,

  draft: null,
  editingStepId: null,

  /* initialize is used to load the funnels from the storage and select the first funnel as default */
  initialize: () => {
    const stored = loadFunnels();
    if (stored.length > 0) {
      set({
        funnels: stored,
        selectedFunnelId: stored[0].id,
        ...resetDraftState,
      });
    }
  },

  /* selectFunnel is used to select a funnel from the list, view the funnel editor and reset the create funnel mode */
  selectFunnel: (funnel: Funnel) => {
    set({
      selectedFunnelId: funnel.id,
      isCreatingFunnel: false,
      ...resetDraftState,
    });
  },

  /* startCreateFunnel is used to start the create funnel mode */
  startCreateFunnel: () => {
    set((state) => {
      if (state.funnels.length >= MAX_FUNNELS) return state;
      return { isCreatingFunnel: true, ...resetDraftState };
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
      ...resetDraftState,
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

  /* 
  setEditingStepId is used to set the id of the step that is being edited
  input is the id of the step to edit
  */
  setEditingStepId: (id) => {
    set({ editingStepId: id });
  },

  /* 
  onDraftStartEdit is used to start the edit of the draft
  it is used to set the draft to the selected funnel
  it is used to set the editing step id to the id of the step that is being edited
  */
  onDraftStartEdit: () => {
    set((state) => {
      const selectedFunnel = state.funnels.find(
        (f) => f.id === state.selectedFunnelId
      );
      const isFunnelEditDisabled = state.editingStepId !== null;
      if (!selectedFunnel || isFunnelEditDisabled) return state;

      return {
        draft: {
          name: selectedFunnel.name,
          translationKeyFormat:
            selectedFunnel.translationKeyFormat ?? "camelCase",
          componentTypes: selectedFunnel.componentTypes ?? [
            ...DEFAULT_COMPONENT_TYPES,
          ],
          steps: [...selectedFunnel.steps],
        },
      };
    });
  },

  /* 
  onSettingsSave is used to save the settings of the draft
  it is used to update the funnel in the list
  it is used to reset the draft and the editing step id
  */
  onSettingsSave: () => {
    set((state) => {
      const selectedFunnel = state.funnels.find(
        (f) => f.id === state.selectedFunnelId
      );
      if (!selectedFunnel || !state.draft) return state;

      const updated: Funnel = {
        ...selectedFunnel,
        name: state.draft.name,
        translationKeyFormat: state.draft.translationKeyFormat,
        componentTypes: state.draft.componentTypes,
        steps: state.draft.steps,
      };

      return {
        funnels: state.funnels.map((f) =>
          f.id === selectedFunnel.id ? updated : f
        ),
        draft: null,
        editingStepId: null,
      };
    });
  },

  /* 
  onSettingsCancel is used to cancel the edit of the draft
  it is used to reset the draft and the editing step id
  */
  onSettingsCancel: () => {
    set(() => {
      return resetDraftState;
    });
  },

  /* 
  onDraftNameChange is used to change the name of the draft
  input is the new name of the draft
  it is used to update the name of the draft
  */
  onDraftNameChange: (name: string) => {
    set((state) => {
      if (!state.draft) return state;
      return {
        draft: { ...state.draft, name },
      };
    });
  },

  /* 
  onDraftTranslationKeyFormatChange is used to change the translation key format of the draft
  input is the new translation key format of the draft
  it is used to update the translation key format of the draft
  */
  onDraftTranslationKeyFormatChange: (format: TranslationKeyFormat) => {
    set((state) => {
      if (!state.draft) return state;
      return {
        draft: { ...state.draft, translationKeyFormat: format },
      };
    });
  },

  /* 
  onDraftComponentTypesChange is used to change the component types of the draft
  input is the new component types of the draft
  it is used to update the component types of the draft
  */
  onDraftComponentTypesChange: (types: string[]) => {
    set((state) => {
      if (!state.draft) return state;
      return {
        draft: { ...state.draft, componentTypes: types },
      };
    });
  },

  /* 
  onDraftReorder is used to reorder the steps of the draft
  input is the reordered items of the steps
  it is used to update the steps of the draft
  */
  onDraftReorder: (reorderedItems: ReorderItem[]) => {
    set((state) => {
      if (!state.draft) return state;
      return {
        draft: {
          ...state.draft,
          steps: reorderSteps(state.draft.steps, reorderedItems),
        },
      };
    });
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

/* Selectors for funnel editor derived state */
export const selectSelectedFunnel = (s: FunnelsStore) =>
  s.funnels.find((f) => f.id === s.selectedFunnelId) ?? null;

export const selectIsEditMode = (s: FunnelsStore) => s.draft !== null;

export const selectDisplayName = (s: FunnelsStore) =>
  s.draft ? s.draft.name : (selectSelectedFunnel(s)?.name ?? "");

export const selectIsFunnelEditDisabled = (s: FunnelsStore) =>
  s.editingStepId !== null;

export const selectReorderItems = (s: FunnelsStore): ReorderItem[] => {
  const funnel = selectSelectedFunnel(s);
  const steps = s.draft ? s.draft.steps : (funnel?.steps ?? []);
  return steps.map((step) => ({ id: step.id, label: step.commonTitle }));
};

export const selectDraftTranslationKeyFormat = (
  s: FunnelsStore
): TranslationKeyFormat =>
  s.draft?.translationKeyFormat ??
  selectSelectedFunnel(s)?.translationKeyFormat ??
  "camelCase";

export const selectDraftComponentTypes = (s: FunnelsStore): string[] =>
  s.draft?.componentTypes ??
  selectSelectedFunnel(s)?.componentTypes ?? [...DEFAULT_COMPONENT_TYPES];
