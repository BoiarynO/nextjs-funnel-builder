"use client";

import { useState, useCallback } from "react";

import type { Funnel, Step } from "@/types/funnel";
import { useFunnelsStore } from "@/stores/funnelsStore";
import ButtonDownloadFunnelJson from "@/components/layout/funnelContent/funnelEditor/buttonDownloadFunnelJson/ButtonDownloadFunnelJson";
import type { ReorderItem } from "@/components/ui/reorderList/ReorderList";

import FunnelTitleRow from "./funnelTitleRow/FunnelTitleRow";
import StepsReorderSection from "./stepsReorderSection/StepsReorderSection";
import StepsContent from "./stepsContent/StepsContent";
import styles from "./FunnelEditor.module.css";

const FunnelEditor = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState<string>("");
  const [draftSteps, setDraftSteps] = useState<Step[]>([]);

  const funnels = useFunnelsStore((s) => s.funnels);
  const selectedFunnelId = useFunnelsStore((s) => s.selectedFunnelId);
  const updateFunnel = useFunnelsStore((s) => s.updateFunnel);

  const selectedFunnel =
    funnels.find((f: Funnel) => f.id === selectedFunnelId) ?? null;

  const isFunnelEditDisabled = editingStepId !== null;

  const handleStartEdit = useCallback(() => {
    if (!selectedFunnel || isFunnelEditDisabled) return;
    setDraftName(selectedFunnel.name);
    setDraftSteps([...selectedFunnel.steps]);
    setIsEditMode(true);
  }, [selectedFunnel, isFunnelEditDisabled]);

  const handleSave = useCallback(() => {
    if (!selectedFunnel) return;
    const updated: Funnel = {
      ...selectedFunnel,
      name: draftName,
      steps: draftSteps,
    };
    updateFunnel(updated);
    setIsEditMode(false);
  }, [selectedFunnel, draftName, draftSteps, updateFunnel]);

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleDraftReorder = (reorderedItems: ReorderItem[]) => {
    setDraftSteps((prev) => {
      const stepMap = new Map(prev.map((s) => [s.id, s]));
      return reorderedItems
        .map((item) => stepMap.get(item.id))
        .filter((s): s is Step => s != null);
    });
  };

  if (!selectedFunnel) {
    return null;
  }

  const displayName = isEditMode ? draftName : selectedFunnel.name;
  const reorderItems: ReorderItem[] = (
    isEditMode ? draftSteps : selectedFunnel.steps
  ).map((step) => ({
    id: step.id,
    label: step.commonTitle,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <FunnelTitleRow
            value={displayName}
            isEditMode={isEditMode}
            isEditDisabled={isFunnelEditDisabled}
            onStartEdit={handleStartEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onNameChange={setDraftName}
          />
        </div>
        <ButtonDownloadFunnelJson />
      </div>

      {isEditMode ? (
        <StepsReorderSection
          items={reorderItems}
          onReorder={handleDraftReorder}
        />
      ) : (
        <StepsContent
          editingStepId={editingStepId}
          onEditStep={setEditingStepId}
        />
      )}
    </div>
  );
};

export default FunnelEditor;
