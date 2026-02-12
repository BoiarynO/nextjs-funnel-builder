"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import classNames from "classnames";

import styles from "./Dropdown.module.css";

type DropdownProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  basic?: boolean;
  fill?: boolean;
  outlined?: boolean;
  filled?: boolean;
};

const Dropdown = ({
  label,
  children,
  className = "",
  style = {},
  basic,
  fill = false,
  outlined = false,
  filled = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  void basic;

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const variantClass = filled
    ? styles.labelFilled
    : outlined
      ? styles.labelOutlined
      : undefined;

  return (
    <div
      className={classNames(
        styles.container,
        fill && styles.fill,
        className
      )}
      style={style}
      ref={containerRef}
    >
      <button
        type="button"
        className={classNames(styles.label, variantClass)}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {label}
      </button>
      {isOpen && <div className={styles.panel}>{children}</div>}
    </div>
  );
};

export default Dropdown;
