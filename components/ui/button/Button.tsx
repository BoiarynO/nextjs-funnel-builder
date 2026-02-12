import type { ReactNode } from "react";
import classNames from "classnames";

import styles from "./Button.module.css";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: React.CSSProperties;
  basic?: boolean;
  fill?: boolean;
  outlined?: boolean;
  filled?: boolean;

  /** Коли true — кнопка візуально заповнена (filled), без потреби передавати filled окремо */
  active?: boolean;

  /** @deprecated Prefer outlined / filled booleans */
  variant?: "filled" | "outlined";
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  style = {},
  basic,
  fill = false,
  outlined: outlinedProp = false,
  filled: filledProp = false,
  variant,
  disabled = false,
  active = false,
}: ButtonProps) {
  void basic;

  const isOutlined = outlinedProp || variant === "outlined";
  const isFilled = filledProp || variant === "filled" || active;

  const variantKey =
    isOutlined && !isFilled ? "outlined" : isFilled ? "filled" : "default";

  return (
    <button
      type={type}
      className={classNames(
        styles.root,
        styles[variantKey],
        fill && styles.fill,
        className
      )}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
