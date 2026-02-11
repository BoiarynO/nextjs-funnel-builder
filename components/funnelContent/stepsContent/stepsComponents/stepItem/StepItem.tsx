"use client";

import { useState } from "react";
import type { Step, TranslationKeyFormat } from "@/types/funnel";
import { formatTranslationKey } from "@/utils/formatTranslationKey";
import styles from "./StepItem.module.css";

type StepItemProps = {
  step: Step;
};

const ArrowIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#5f6368"
    className={expanded ? styles.arrowExpanded : styles.arrow}
    aria-hidden
  >
    <path d="M480-360 280-560h400L480-360Z" />
  </svg>
);

const StepItem = ({ step }: StepItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const format = (step.translationKeyFormat ?? "camelCase") as TranslationKeyFormat;
  const titleFormattedKey = formatTranslationKey(step.commonTitle, format);
  const subtitleFormattedKey = formatTranslationKey(step.commonSubtitle, format);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.header}
        onClick={handleToggle}
        aria-expanded={expanded}
      >
        <span className={styles.title}>{step.commonTitle}</span>
        <ArrowIcon expanded={expanded} />
      </button>

      {expanded && (
        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Title:</span>
            <span>
              {step.commonTitle}({titleFormattedKey})
            </span>
          </div>
          {(step.commonSubtitle || subtitleFormattedKey) && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Subtitle:</span>
              <span>
                {step.commonSubtitle}({subtitleFormattedKey})
              </span>
            </div>
          )}
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Component type:</span>
            <span>{step.componentType}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Translation key format:</span>
            <span>{step.translationKeyFormat ?? "—"}</span>
          </div>
          {step.commonPoints.length > 0 && (
            <div className={styles.pointsSection}>
              <span className={styles.detailLabel}>Points:</span>
              <ul className={styles.pointsList}>
                {step.commonPoints.map((point, index) => (
                  <li key={index} className={styles.pointItem}>
                    <span>{point}</span>
                    {step.pointsTranslationKeys[index] && (
                      <span className={styles.pointKey}>
                        ({step.pointsTranslationKeys[index]})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepItem;
