"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

import type { Funnel, Step } from "@/types/funnel";
import { useFunnelsStore } from "@/stores/funnelsStore";
import ButtonDownloadFunnelJson from "@/components/ButtonDownloadFunnelJson";
import ReorderList, {
  type ReorderItem,
} from "@/components/ui/reorderList/ReorderList";
import Input from "@/components/ui/input/Input";
import EditIcon from "@/assets/icons/edit.svg";

import StepsContent from "./stepsContent/StepsContent";
import styles from "./FunnelEditor.module.css";

const FunnelEditor = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  const funnels = useFunnelsStore((s) => s.funnels);
  const selectedFunnelId = useFunnelsStore((s) => s.selectedFunnelId);
  const updateFunnel = useFunnelsStore((s) => s.updateFunnel);

  const isFunnelEditDisabled = editingStepId !== null;

  const selectedFunnel =
    funnels.find((f: Funnel) => f.id === selectedFunnelId) ?? null;

  const handleRename = useCallback(
    (newName: string) => {
      if (!selectedFunnel) return;
      const updated: Funnel = {
        ...selectedFunnel,
        name: newName,
      };
      updateFunnel(updated);
    },
    [selectedFunnel, updateFunnel]
  );

  const handleReorder = useCallback(
    (reorderedItems: ReorderItem[]) => {
      if (!selectedFunnel) return;
      const stepMap = new Map(selectedFunnel.steps.map((s) => [s.id, s]));
      const reorderedSteps: Step[] = reorderedItems
        .map((item) => stepMap.get(item.id))
        .filter((s): s is Step => s != null);
      const updated: Funnel = {
        ...selectedFunnel,
        steps: reorderedSteps,
      };
      updateFunnel(updated);
    },
    [selectedFunnel, updateFunnel]
  );

  if (!selectedFunnel) {
    return null;
  }

  const reorderItems: ReorderItem[] = selectedFunnel.steps.map((step) => ({
    id: step.id,
    label: step.commonTitle,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          {isEditMode ? (
            <Input
              value={selectedFunnel.name}
              onChange={(e) => handleRename(e.target.value)}
              className={styles.titleInput}
            />
          ) : (
            <h1 className={styles.title}>{selectedFunnel.name}</h1>
          )}
          <button
            type="button"
            className={styles.editButton}
            onClick={() => !isFunnelEditDisabled && setIsEditMode((prev) => !prev)}
            disabled={isFunnelEditDisabled}
            aria-label={isEditMode ? "Exit edit mode" : "Edit funnel"}
          >
            <Image src={EditIcon} alt="" width={24} height={24} />
          </button>
        </div>
        <ButtonDownloadFunnelJson />
      </div>

      {isEditMode ? (
        <div className={styles.reorderSection}>
          <h2 className={styles.reorderHeading}>Steps (drag to reorder)</h2>
          {reorderItems.length === 0 ? (
            <p className={styles.emptyText}>No steps yet.</p>
          ) : (
            <ReorderList items={reorderItems} onChangeOrder={handleReorder} />
          )}
        </div>
      ) : (
        <StepsContent
          isEditMode={false}
          isFunnelEditMode={isEditMode}
          editingStepId={editingStepId}
          onEditStep={setEditingStepId}
        />
      )}
    </div>
  );
};

export default FunnelEditor;
