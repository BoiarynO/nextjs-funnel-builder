import { forwardRef } from "react";
import type {
  ChangeEvent,
  CSSProperties,
  InputHTMLAttributes,
} from "react";
import classNames from "classnames";

import styles from "./Input.module.css";

type InputProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  style?: CSSProperties;
  basic?: boolean;
  fill?: boolean;
  outlined?: boolean;
  filled?: boolean;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type" | "className" | "style"
>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      onChange,
      placeholder,
      type = "text",
      className = "",
      style = {},
      basic,
      fill = false,
      outlined = false,
      filled = false,
      ...restProps
    },
    ref
  ) => {
    void basic;

    const variantClass = filled
      ? styles.filled
      : outlined
        ? styles.outlined
        : undefined;

    return (
      <input
        ref={ref}
        type={type}
        className={classNames(
          styles.root,
          variantClass,
          fill && styles.fill,
          className
        )}
        style={style}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...restProps}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
