"use client";

import Dropdown from "@/components/ui/dropdown/Dropdown";
import Heading from "@/components/ui/heading/Heading";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginBottom: "0.5rem",
        fontSize: "0.875rem",
        color: "var(--secondary-text-color)",
      }}
    >
      {children}
    </div>
  );
}

export default function UiDropdownTest() {
  return (
    <section
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <Heading as="h2">Dropdown</Heading>

      <div>
        <Label>Default</Label>
        <Dropdown label="Open menu">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <button type="button" style={{ padding: "0.5rem", textAlign: "left" }}>
              Item 1
            </button>
            <button type="button" style={{ padding: "0.5rem", textAlign: "left" }}>
              Item 2
            </button>
            <button type="button" style={{ padding: "0.5rem", textAlign: "left" }}>
              Item 3
            </button>
          </div>
        </Dropdown>
      </div>

      <div>
        <Label>Outlined</Label>
        <Dropdown label="Outlined menu" outlined>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <button type="button" style={{ padding: "0.5rem", textAlign: "left" }}>
              Option A
            </button>
            <button type="button" style={{ padding: "0.5rem", textAlign: "left" }}>
              Option B
            </button>
          </div>
        </Dropdown>
      </div>

      <div>
        <Label>Filled</Label>
        <Dropdown label="Filled menu" filled>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <button type="button" style={{ padding: "0.5rem", textAlign: "left" }}>
              Action 1
            </button>
            <button type="button" style={{ padding: "0.5rem", textAlign: "left" }}>
              Action 2
            </button>
          </div>
        </Dropdown>
      </div>
    </section>
  );
}
