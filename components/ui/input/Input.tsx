import { forwardRef } from "react";
import type { InputHTMLAttributes, ChangeEvent } from "react";
import styles from "./Input.module.css";

type InputProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { value, onChange, placeholder, type = "text", className, ...restProps },
    ref
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`${styles.root} ${className ?? ""}`.trim()}
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
