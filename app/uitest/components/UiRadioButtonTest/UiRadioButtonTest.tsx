"use client";

import { useState } from "react";
import RadioButton from "@/components/ui/radioButton/RadioButton";
import Heading from "@/components/ui/heading/Heading";

const OPTIONS = ["Option A", "Option B", "Option C"];

export default function UiRadioButtonTest() {
  const [selected, setSelected] = useState(OPTIONS[0]);

  return (
    <section
      style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
    >
      <Heading as="h2">RadioButton</Heading>
      {OPTIONS.map((option) => (
        <RadioButton
          key={option}
          name="uitest-radio"
          label={option}
          checked={selected === option}
          onChange={() => setSelected(option)}
        />
      ))}
    </section>
  );
}
