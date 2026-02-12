"use client";

import type { Funnel, Step } from "@/types/funnel";

import StepsForm from "../stepsComponents/stepsForm/StepsForm";
import StepItem from "../stepsComponents/stepItem/StepItem";

import styles from "./StepsList.module.css";

type StepsListProps = {
  funnel: Funnel;
  editingStepId: string | null;
  editingStep: Step | null;
  onEditStep: (stepId: string | null) => void;
  onUpdateFunnel: (funnel: Funnel) => void;
};

const StepsList = ({
  funnel,
  editingStepId,
  editingStep,
  onEditStep,
  onUpdateFunnel,
}: StepsListProps) => {
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
                funnel={funnel}
                onUpdateFunnel={onUpdateFunnel}
                onClose={() => onEditStep(null)}
                initialStep={editingStep}
              />
            </div>
          );
        }

        return (
          <StepItem
            key={step.id}
            step={step}
            onEditClick={() => onEditStep(step.id)}
          />
        );
      })}
    </div>
  );
};

export default StepsList;
