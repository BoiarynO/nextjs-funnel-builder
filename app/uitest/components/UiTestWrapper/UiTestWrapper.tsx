import type { ReactNode } from "react";

type UiTestWrapperProps = {
  children: ReactNode;
};

export default function UiTestWrapper({ children }: UiTestWrapperProps) {
  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
        maxWidth: "48rem",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {children}
    </div>
  );
}
