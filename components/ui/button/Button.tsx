import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "filled" | "outlined";
  color?: string;
  disabled?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "filled",
  color,
  disabled,
  className,
  ...restProps
}: ButtonProps) => {
  const variantClass = variant === "outlined" ? styles.outlined : styles.filled;
  const style = color
    ? {
        ...(variant === "filled"
          ? { backgroundColor: color, borderColor: color }
          : { borderColor: color }),
      }
    : undefined;

  return (
    <button
      type={type}
      className={`${styles.root} ${variantClass} ${className ?? ""}`.trim()}
      style={style}
      onClick={onClick}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;
