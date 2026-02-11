import { useState } from "react";

import type { Funnel } from "@/types/funnel";
import { useFunnelsStore } from "@/stores/funnelsStore";
import { MAX_QUESTIONS_PER_FUNNEL } from "@/config/limits";
import Button from "@/components/ui/button/Button";
import StepsForm from "@/components/funnelContent/stepsContent/stepsComponents/stepsForm/StepsForm";
import StepItem from "@/components/funnelContent/stepsContent/stepsComponents/stepItem/StepItem";

import styles from "./StepsContent.module.css";

const StepsContent = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const funnels = useFunnelsStore((s) => s.funnels);
  const selectedFunnelId = useFunnelsStore((s) => s.selectedFunnelId);
  const updateFunnel = useFunnelsStore((s) => s.updateFunnel);

  const funnel =
    funnels.find((f: Funnel) => f.id === selectedFunnelId) ?? null;

  if (!funnel) {
    return null;
  }

  const limitReached = funnel.steps.length >= MAX_QUESTIONS_PER_FUNNEL;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Steps</h2>

      <div className={styles.list}>
        {funnel.steps.map((step) => (
          <StepItem key={step.id} step={step} />
        ))}
        {funnel.steps.length === 0 && (
          <p className={styles.emptyText}>No steps yet.</p>
        )}
      </div>

      {!isFormOpen ? (
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
      ) : (
        <StepsForm
          funnel={funnel}
          onUpdateFunnel={updateFunnel}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default StepsContent;
