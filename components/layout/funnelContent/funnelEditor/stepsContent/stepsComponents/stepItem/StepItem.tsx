"use client";

import { useState } from "react";
import classNames from "classnames";

import type { Step } from "@/types/funnel";
import EditIcon from "@/assets/icons/edit.svg";
import Button from "@/components/ui/button/Button";
import ArrowIcon from "@/assets/icons/arrow-down.svg";

import styles from "./StepItem.module.css";
import Details from "./details/Details";

type StepItemProps = {
  step: Step;
  isEditDisabled?: boolean;
  onEditClick?: () => void;
};

const StepItem = ({
  step,
  isEditDisabled = false,
  onEditClick,
}: StepItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditDisabled && onEditClick) onEditClick();
  };

  //  ------------------------------------------------------------
  //  Header content
  //  ------------------------------------------------------------

  const headerLeftContent = (
    <Button
      type="button"
      className={styles.header}
      fill
      onClick={handleToggle}
      aria-expanded={expanded}
    >
      <span>{step.commonTitle}</span>

      <ArrowIcon
        className={classNames(styles.arrow, expanded && styles.arrowExpanded)}
      />
    </Button>
  );

  const headerRightContent = !isEditDisabled && onEditClick && (
    <Button
      type="button"
      className={styles.editIconButton}
      onClick={handleEditClick}
      aria-label="Edit step"
    >
      <EditIcon aria-hidden fill="currentColor" />
    </Button>
  );

  //  ------------------------------------------------------------

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        {headerLeftContent}
        {headerRightContent}
      </div>

      {expanded && <Details step={step} />}
    </div>
  );
};

export default StepItem;
