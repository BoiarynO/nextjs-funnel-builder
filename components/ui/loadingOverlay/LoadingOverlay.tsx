import type { ReactNode } from "react";
import classNames from "classnames";

import styles from "./LoadingOverlay.module.css";

type LoadingOverlayProps = {
  loading: boolean;
  children: ReactNode;
  className?: string;
  /** Stretch to parent width (block layout) instead of shrinking to children. */
  fullWidth?: boolean;
};

export default function LoadingOverlay({
  loading,
  children,
  className,
  fullWidth = false,
}: LoadingOverlayProps) {
  return (
    <div
      className={classNames(
        styles.root,
        fullWidth && styles.fullWidth,
        className
      )}
      aria-busy={loading || undefined}
    >
      {children}
      {loading ? (
        <div className={styles.overlay} aria-live="polite">
          Loading
        </div>
      ) : null}
    </div>
  );
}
