"use client";

import type { ReorderItem } from "@/components/ui/reorderList/ReorderList";
import ReorderList from "@/components/ui/reorderList/ReorderList";
import Heading from "@/components/ui/heading/Heading";

import styles from "./StepsReorderSection.module.css";

type StepsReorderSectionProps = {
  items: ReorderItem[];
  onReorder: (reorderedItems: ReorderItem[]) => void;
};

const StepsReorderSection = ({
  items,
  onReorder,
}: StepsReorderSectionProps) => {
  const listContent = !items.length ? (
    <p className={styles.emptyText}>No steps yet.</p>
  ) : (
    <ReorderList items={items} onChangeOrder={onReorder} />
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
