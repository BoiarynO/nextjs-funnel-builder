"use client";

import { useState } from "react";

import type { Funnel } from "@/types/funnel";
import { useFunnelsStore } from "@/stores/funnelsStore";
import { MAX_QUESTIONS_PER_FUNNEL } from "@/config/limits";
import Heading from "@/components/ui/heading/Heading";

import StepsList from "./stepsList/StepsList";
import AddStepBlock from "./addStepBlock/AddStepBlock";
import styles from "./StepsContent.module.css";

type StepsContentProps = {
  editingStepId?: string | null;
  onEditStep?: (stepId: string | null) => void;
};

const StepsContent = ({
  editingStepId = null,
  onEditStep,
}: StepsContentProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const funnels = useFunnelsStore((s) => s.funnels);
  const selectedFunnelId = useFunnelsStore((s) => s.selectedFunnelId);
  const updateFunnel = useFunnelsStore((s) => s.updateFunnel);

  const funnel = funnels.find((f: Funnel) => f.id === selectedFunnelId) ?? null;
  const editingStep =
    funnel && editingStepId
      ? funnel.steps.find((s) => s.id === editingStepId) ?? null
      : null;

  if (!funnel) {
    return null;
  }

  const limitReached = funnel.steps.length >= MAX_QUESTIONS_PER_FUNNEL;
  const handleEditStep = onEditStep ?? (() => {});

  const showAddBlock = !editingStepId;

  return (
    <div className={styles.container}>
      <Heading as="h2" colored>
        Steps
      </Heading>

      <StepsList
        funnel={funnel}
        editingStepId={editingStepId ?? null}
        editingStep={editingStep}
        onEditStep={handleEditStep}
        onUpdateFunnel={updateFunnel}
      />

      {showAddBlock && (
        <AddStepBlock
          funnel={funnel}
          isFormOpen={isFormOpen}
          limitReached={limitReached}
          onOpenForm={() => setIsFormOpen(true)}
          onCloseForm={() => setIsFormOpen(false)}
          onUpdateFunnel={updateFunnel}
        />
      )}
    </div>
  );
};

export default StepsContent;
