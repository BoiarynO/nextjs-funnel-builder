"use client";

import ReorderList from "@/components/ui/reorderList/ReorderList";
import Heading from "@/components/ui/heading/Heading";
import { useFunnelsStore, selectSelectedFunnel } from "@/stores/funnelsStore";

import styles from "./StepsReorderSection.module.css";

const StepsReorderSection = () => {
  const draft = useFunnelsStore((s) => s.draft);
  const selectedFunnel = useFunnelsStore(selectSelectedFunnel);
  const onDraftReorder = useFunnelsStore((s) => s.onDraftReorder);

  const steps = draft?.steps ?? selectedFunnel?.steps ?? [];
  const items = steps.map((step) => ({ id: step.id, label: step.commonTitle }));

  const listContent = !items.length ? (
    <p className={styles.emptyText}>No steps yet.</p>
  ) : (
    <ReorderList items={items} onChangeOrder={onDraftReorder} />
  );

  return (
    <div className={styles.section}>
      <Heading as="h3" colored>
        Steps (drag to reorder)
      </Heading>
      {listContent}
    </div>
  );
};

export default StepsReorderSection;
