"use client";

import { useState } from "react";
import Input from "@/components/ui/input/Input";
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

export default function UiInputTest() {
  const [value, setValue] = useState("");

  return (
    <section
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <Heading as="h2">Input</Heading>

      <div>
        <Label>Default</Label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type here..."
        />
      </div>

      <div>
        <Label>Fill width</Label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Full width"
          fill
        />
      </div>

      <div>
        <Label>Outlined</Label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Outlined"
          outlined
        />
      </div>

      <div>
        <Label>Filled</Label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Filled"
          filled
        />
      </div>

      <div>
        <Label>Disabled</Label>
        <Input value="Disabled" onChange={() => {}} disabled />
      </div>
    </section>
  );
}
