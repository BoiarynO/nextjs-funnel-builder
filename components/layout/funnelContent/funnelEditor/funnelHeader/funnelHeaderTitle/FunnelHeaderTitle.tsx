"use client";

import Button from "@/components/ui/button/Button";
import Heading from "@/components/ui/heading/Heading";
import EditIcon from "@/assets/icons/edit.svg";
import {
  useFunnelsStore,
  selectDisplayName,
  selectIsFunnelEditDisabled,
} from "@/stores/funnelsStore";

import styles from "./FunnelHeaderTitle.module.css";

const FunnelHeaderTitle = () => {
  const displayName = useFunnelsStore(selectDisplayName);
  const isEditDisabled = useFunnelsStore(selectIsFunnelEditDisabled);
  const onDraftStartEdit = useFunnelsStore((s) => s.onDraftStartEdit);

  return (
    <div className={styles.row}>
      <Heading as="h3" colored>
        {displayName}
      </Heading>
      <Button
        type="button"
        onClick={onDraftStartEdit}
        disabled={isEditDisabled}
        aria-label="Edit funnel"
      >
        <EditIcon
          width={24}
          height={24}
          aria-hidden
          style={{ fill: "currentColor" }}
        />
      </Button>
    </div>
  );
};

export default FunnelHeaderTitle;
