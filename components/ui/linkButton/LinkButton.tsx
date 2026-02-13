import type { ReactNode } from "react";
import Link from "next/link";
import classNames from "classnames";

import buttonStyles from "./LinkButton.module.css";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  basic?: boolean;
  fill?: boolean;
  outlined?: boolean;
  filled?: boolean;
  active?: boolean;
};

export default function LinkButton({
  href,
  children,
  className = "",
  style = {},
  basic,
  fill = false,
  outlined: outlinedProp = false,
  filled: filledProp = false,
  active = false,
}: LinkButtonProps) {
  void basic;
  const isOutlined = outlinedProp;
  const isFilled = filledProp;
  const variantKey =
    isOutlined && !isFilled ? "outlined" : isFilled ? "filled" : "default";

  return (
    <Link
      href={href}
      className={classNames(
        buttonStyles.root,
        buttonStyles[variantKey],
        fill && buttonStyles.fill,
        active && buttonStyles.active,
        className
      )}
      style={style}
    >
      {children}
    </Link>
  );
}
