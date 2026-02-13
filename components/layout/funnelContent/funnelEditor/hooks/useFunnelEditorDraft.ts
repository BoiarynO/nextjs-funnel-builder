"use client";

import { useState, useEffect } from "react";

import type { Funnel, Step, TranslationKeyFormat } from "@/types/funnel";
import { DEFAULT_COMPONENT_TYPES } from "@/utils/variables";
import { useFunnelsStore } from "@/stores/funnelsStore";
import type { ReorderItem } from "@/components/ui/reorderList/ReorderList";

type DraftState = {
  name: string;
  translationKeyFormat: TranslationKeyFormat;
  componentTypes: string[];
  steps: Step[];
};

function reorderSteps(
  prevSteps: Step[],
  reorderedItems: ReorderItem[]
): Step[] {
  const stepMap = new Map(prevSteps.map((s) => [s.id, s]));
  return reorderedItems
    .map((item) => stepMap.get(item.id))
    .filter((s): s is Step => s != null);
}

export function useFunnelEditorDraft() {
  // --- Store ---
  const funnels = useFunnelsStore((s) => s.funnels);
  const selectedFunnelId = useFunnelsStore((s) => s.selectedFunnelId);
  const updateFunnel = useFunnelsStore((s) => s.updateFunnel);

  // --- Draft state ---
  const [draft, setDraft] = useState<DraftState | null>(null);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  // --- Reset on funnel switch ---
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(null);
    setEditingStepId(null);
  }, [selectedFunnelId]);

  // --- Derived values ---
  const selectedFunnel =
    funnels.find((f: Funnel) => f.id === selectedFunnelId) ?? null;
  const isEditMode = draft !== null;
  const isFunnelEditDisabled = editingStepId !== null;

  const displayName = isEditMode
    ? (draft?.name ?? "")
    : (selectedFunnel?.name ?? "");

  const stepsForReorder = isEditMode
    ? (draft?.steps ?? [])
    : (selectedFunnel?.steps ?? []);
  const reorderItems: ReorderItem[] = stepsForReorder.map((step) => ({
    id: step.id,
    label: step.commonTitle,
  }));

  const draftTranslationKeyFormat =
    draft?.translationKeyFormat ??
    selectedFunnel?.translationKeyFormat ??
    "camelCase";
  const draftComponentTypes = draft?.componentTypes ??
    selectedFunnel?.componentTypes ?? [...DEFAULT_COMPONENT_TYPES];

  // --- Handlers ---
  const onStartEdit = () => {
    if (!selectedFunnel || isFunnelEditDisabled) return;
    setDraft({
      name: selectedFunnel.name,
      translationKeyFormat: selectedFunnel.translationKeyFormat ?? "camelCase",
      componentTypes: selectedFunnel.componentTypes ?? [
        ...DEFAULT_COMPONENT_TYPES,
      ],
      steps: [...selectedFunnel.steps],
    });
  };

  const onSave = () => {
    if (!selectedFunnel || !draft) return;
    const updated: Funnel = {
      ...selectedFunnel,
      name: draft.name,
      translationKeyFormat: draft.translationKeyFormat,
      componentTypes: draft.componentTypes,
      steps: draft.steps,
    };
    updateFunnel(updated);
    setDraft(null);
  };

  const onCancel = () => {
    setDraft(null);
  };

  const onNameChange = (name: string) => {
    setDraft((prev) => (prev ? { ...prev, name } : null));
  };

  const onTranslationKeyFormatChange = (format: TranslationKeyFormat) => {
    setDraft((prev) =>
      prev ? { ...prev, translationKeyFormat: format } : null
    );
  };

  const onComponentTypesChange = (types: string[]) => {
    setDraft((prev) => (prev ? { ...prev, componentTypes: types } : null));
  };

  const onDraftReorder = (reorderedItems: ReorderItem[]) => {
    setDraft((prev) =>
      prev ? { ...prev, steps: reorderSteps(prev.steps, reorderedItems) } : null
    );
  };

  return {
    state: {
      selectedFunnel,
      isEditMode,
      editingStepId,
      displayName,
      reorderItems,
      isFunnelEditDisabled,
      draftTranslationKeyFormat,
      draftComponentTypes,
    },
    actions: {
      setEditingStepId,
      onStartEdit,
      onSave,
      onCancel,
      onNameChange,
      onTranslationKeyFormatChange,
      onComponentTypesChange,
      onDraftReorder,
    },
  };
}
