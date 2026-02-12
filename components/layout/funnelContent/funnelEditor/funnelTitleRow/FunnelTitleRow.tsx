"use client";

import Input from "@/components/ui/input/Input";
import Heading from "@/components/ui/heading/Heading";
import Button from "@/components/ui/button/Button";
import EditIcon from "@/assets/icons/edit.svg";

import styles from "./FunnelTitleRow.module.css";

type FunnelTitleRowProps = {
  value: string;
  isEditMode: boolean;
  isEditDisabled: boolean;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onNameChange: (name: string) => void;
};

const FunnelTitleRow = ({
  value,
  isEditMode,
  isEditDisabled,
  onStartEdit,
  onSave,
  onCancel,
  onNameChange,
}: FunnelTitleRowProps) => {
  if (isEditMode) {
    return (
      <div className={styles.row}>
        <Input
          value={value}
          onChange={(e) => onNameChange(e.target.value)}
          className={styles.titleInput}
        />
        <Button type="button" onClick={onSave}>
          Save
        </Button>
        <Button type="button" variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.row}>
      <Heading as="h3" colored>
        {value}
      </Heading>
      <Button
        type="button"
        onClick={onStartEdit}
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

export default FunnelTitleRow;
