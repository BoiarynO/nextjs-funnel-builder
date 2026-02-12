"use client";

import { useState } from "react";
import ReorderList, { type ReorderItem } from "@/components/ui/reorderList/ReorderList";
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

const INITIAL_ITEMS: ReorderItem[] = [
  { id: "1", label: "First item" },
  { id: "2", label: "Second item" },
  { id: "3", label: "Third item" },
];

export default function UiReorderListTest() {
  const [items, setItems] = useState<ReorderItem[]>(INITIAL_ITEMS);

  return (
    <section
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <Heading as="h2">ReorderList</Heading>

      <div>
        <Label>Default (drag to reorder)</Label>
        <ReorderList items={items} onChangeOrder={setItems} />
      </div>

      <div>
        <Label>Fill width</Label>
        <ReorderList items={items} onChangeOrder={setItems} fill />
      </div>

      <div>
        <Label>Outlined</Label>
        <ReorderList items={items} onChangeOrder={setItems} outlined />
      </div>

      <div>
        <Label>Filled</Label>
        <ReorderList items={items} onChangeOrder={setItems} filled />
      </div>
    </section>
  );
}
