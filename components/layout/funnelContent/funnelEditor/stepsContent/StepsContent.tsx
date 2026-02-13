"use client";

import { useFunnelsStore } from "@/stores/funnelsStore";
import Heading from "@/components/ui/heading/Heading";

import StepsList from "./stepsList/StepsList";
import AddStepBlock from "./addStepBlock/AddStepBlock";
import styles from "./StepsContent.module.css";

const StepsContent = () => {
  const editingStepId = useFunnelsStore((s) => s.editingStepId);

  const showAddBlock = !editingStepId;

  return (
    <div className={styles.container}>
      <Heading as="h2" colored>
        Steps
      </Heading>

      <StepsList />

      {showAddBlock && <AddStepBlock />}
    </div>
  );
};

export default StepsContent;
