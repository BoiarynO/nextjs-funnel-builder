import { useState } from "react";

import type { Funnel } from "@/types/funnel";
import { useFunnelsStore } from "@/stores/funnelsStore";
import { MAX_QUESTIONS_PER_FUNNEL } from "@/config/limits";
import Button from "@/components/ui/button/Button";
import StepsForm from "@/components/layout/funnelContent/stepsContent/stepsComponents/stepsForm/StepsForm";
import StepItem from "@/components/layout/funnelContent/stepsContent/stepsComponents/stepItem/StepItem";

import styles from "./StepsContent.module.css";

type StepsContentProps = {
  isEditMode?: boolean;
  isFunnelEditMode?: boolean;
  editingStepId?: string | null;
  onEditStep?: (stepId: string | null) => void;
};

const StepsContent = ({
  isEditMode = false,
  isFunnelEditMode = false,
  editingStepId = null,
  onEditStep,
}: StepsContentProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const funnels = useFunnelsStore((s) => s.funnels);
  const selectedFunnelId = useFunnelsStore((s) => s.selectedFunnelId);
  const updateFunnel = useFunnelsStore((s) => s.updateFunnel);

  const funnel = funnels.find((f: Funnel) => f.id === selectedFunnelId) ?? null;

  if (!funnel) {
    return null;
  }

  const limitReached = funnel.steps.length >= MAX_QUESTIONS_PER_FUNNEL;
  const editingStep = editingStepId
    ? (funnel.steps.find((s) => s.id === editingStepId) ?? null)
    : null;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Steps</h2>

      <div className={styles.list}>
        {funnel.steps.map((step) =>
          editingStepId === step.id && editingStep ? (
            <div key={step.id} className={styles.editFormWrap}>
              <StepsForm
                funnel={funnel}
                onUpdateFunnel={updateFunnel}
                onClose={() => onEditStep?.(null)}
                initialStep={editingStep}
              />
            </div>
          ) : (
            <StepItem
              key={step.id}
              step={step}
              isEditMode={isEditMode}
              isEditDisabled={isFunnelEditMode}
              onEditClick={onEditStep ? () => onEditStep(step.id) : undefined}
            />
          )
        )}
        {funnel.steps.length === 0 && (
          <p className={styles.emptyText}>No steps yet.</p>
        )}
      </div>

      {!isFormOpen && !editingStepId ? (
        <div className={styles.addRow}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => setIsFormOpen(true)}
            disabled={limitReached}
          >
            Add Step
          </Button>
          {limitReached && (
            <p className={styles.helperText}>Maximum steps limit reached</p>
          )}
        </div>
      ) : isFormOpen ? (
        <StepsForm
          funnel={funnel}
          onUpdateFunnel={updateFunnel}
          onClose={() => setIsFormOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default StepsContent;
