"use client";

import type { Funnel } from "@/types/funnel";
import Button from "@/components/ui/button/Button";

import StepsForm from "../stepsComponents/stepsForm/StepsForm";

import styles from "./AddStepBlock.module.css";

type AddStepBlockProps = {
  funnel: Funnel;
  isFormOpen: boolean;
  limitReached: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onUpdateFunnel: (funnel: Funnel) => void;
};

const AddStepBlock = ({
  funnel,
  isFormOpen,
  limitReached,
  onOpenForm,
  onCloseForm,
  onUpdateFunnel,
}: AddStepBlockProps) => {
  if (isFormOpen) {
    return (
      <StepsForm
        funnel={funnel}
        onUpdateFunnel={onUpdateFunnel}
        onClose={onCloseForm}
      />
    );
  }

  return (
    <div className={styles.addRow}>
      <Button type="button" filled onClick={onOpenForm} disabled={limitReached}>
        Add Step
      </Button>
      {limitReached && (
        <p className={styles.helperText}>Maximum steps limit reached</p>
      )}
    </div>
  );
};

export default AddStepBlock;
