import type { ReactNode } from "react";
import classNames from "classnames";

import styles from "./Heading.module.css";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5";

type HeadingProps = {
  children: ReactNode;
  as?: HeadingTag;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  colored?: boolean;
};

const tagToLevel: Record<HeadingTag, keyof typeof styles> = {
  h1: styles.h1,
  h2: styles.h2,
  h3: styles.h3,
  h4: styles.h4,
  h5: styles.h5,
};

export default function Heading({
  children,
  as = "h2",
  className = "",
  style = {},
  fill = false,
  colored = false,
}: HeadingProps) {
  const Tag = as;
  const levelClass = tagToLevel[as];
  const fillClass = fill && styles.fill;
  const coloredClass = colored && styles.colored;

  return (
    <Tag
      className={classNames(
        styles.root,
        levelClass,
        fillClass,
        coloredClass,
        className
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
