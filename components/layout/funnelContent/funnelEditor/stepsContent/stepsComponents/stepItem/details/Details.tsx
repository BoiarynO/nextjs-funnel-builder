import React from "react";

import type { Step, TranslationKeyFormat } from "@/types/funnel";
import { formatTranslationKey } from "@/utils/formatTranslationKey";

import styles from "./Details.module.css";

const Details = ({ step }: { step: Step }) => {
  const format = (step.translationKeyFormat ??
    "camelCase") as TranslationKeyFormat;
  const titleFormattedKey = formatTranslationKey(step.commonTitle, format);
  const subtitleFormattedKey = formatTranslationKey(
    step.commonSubtitle,
    format
  );

  return (
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
  );
};

export default Details;
