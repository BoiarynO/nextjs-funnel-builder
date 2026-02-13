"use client";

import { selectSelectedFunnel, useFunnelsStore } from "@/stores/funnelsStore";

import StepsForm from "../stepsComponents/stepsForm/StepsForm";
import StepItem from "../stepsComponents/stepItem/StepItem";

import styles from "./StepsList.module.css";

const StepsList = () => {
  const funnel = useFunnelsStore(selectSelectedFunnel);
  const editingStepId = useFunnelsStore((s) => s.editingStepId);
  const setEditingStepId = useFunnelsStore((s) => s.setEditingStepId);
  const updateFunnel = useFunnelsStore((s) => s.updateFunnel);

  const editingStep =
    funnel && editingStepId
      ? (funnel.steps.find((s) => s.id === editingStepId) ?? null)
      : null;

  if (!funnel) return null;

  if (funnel.steps.length === 0) {
    return (
      <div className={styles.list}>
        <p className={styles.emptyText}>No steps yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {funnel.steps.map((step) => {
        const isEditing = editingStepId === step.id && editingStep !== null;

        if (isEditing) {
          return (
            <div key={step.id} className={styles.editFormWrap}>
              <StepsForm
                key={editingStep.id}
                funnel={funnel}
                onUpdateFunnel={updateFunnel}
                onClose={() => setEditingStepId(null)}
                initialStep={editingStep}
              />
            </div>
          );
        }

        return (
          <StepItem
            key={step.id}
            step={step}
            onEditClick={() => setEditingStepId(step.id)}
          />
        );
      })}
    </div>
  );
};

export default StepsList;
