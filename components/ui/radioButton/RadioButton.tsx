import type { ChangeEvent, ReactNode } from "react";
import classNames from "classnames";
import styles from "./RadioButton.module.css";

type RadioButtonProps = {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: ReactNode;
  name: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function RadioButton({
  checked,
  onChange,
  label,
  name,
  className = "",
  style = {},
}: RadioButtonProps) {
  return (
    <label
      className={classNames(styles.root, className)}
      style={style}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className={styles.input}
        aria-checked={checked}
      />
      <span className={styles.dot} />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
