"use client";

import { useState } from "react";

import Button from "@/components/ui/button/Button";
import { MAX_QUESTIONS_PER_FUNNEL } from "@/utils/config/limits";
import { selectSelectedFunnel, useFunnelsStore } from "@/stores/funnelsStore";

import StepsForm from "../stepsComponents/stepsForm/StepsForm";

import styles from "./AddStepBlock.module.css";

const AddStepBlock = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const funnel = useFunnelsStore(selectSelectedFunnel);
  const updateFunnel = useFunnelsStore((s) => s.updateFunnel);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  if (!funnel) return null;

  const limitReached = funnel?.steps?.length >= MAX_QUESTIONS_PER_FUNNEL;

  if (isFormOpen) {
    return (
      <StepsForm
        funnel={funnel}
        onUpdateFunnel={updateFunnel}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className={styles.addRow}>
      <Button
        type="button"
        filled
        onClick={handleOpenForm}
        disabled={limitReached}
      >
        Add Step
      </Button>
      {limitReached && (
        <p className={styles.helperText}>Maximum steps limit reached</p>
      )}
    </div>
  );
};

export default AddStepBlock;
