import { useEffect, useRef, useState } from "react";

import type { Funnel } from "@/types/funnel";
import { DEFAULT_COMPONENT_TYPES } from "@/types/funnel";
import { MAX_FUNNELS } from "@/config/limits";
import { useFunnelsStore } from "@/stores/funnelsStore";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";

import styles from "./CreateFunnelForm.module.css";

const CreateFunnelForm = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const funnels = useFunnelsStore((s) => s.funnels);
  const createFunnel = useFunnelsStore((s) => s.createFunnel);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const limitReached = funnels.length >= MAX_FUNNELS;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (limitReached) {
      return;
    }

    if (!name.trim()) {
      setError("Please enter a funnel name.");
      return;
    }

    const newFunnel: Funnel = {
      id: crypto.randomUUID(),
      name: name.trim(),
      translationKeyFormat: "camelCase",
      componentTypes: [...DEFAULT_COMPONENT_TYPES],
      steps: [],
    };

    createFunnel(newFunnel);
    setName("");
    setError(null);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Create funnel</h1>
      <div className={styles.field}>
        <label htmlFor="funnel-name" className={styles.label}>
          Funnel name
        </label>
        <Input
          ref={inputRef}
          id="funnel-name"
          placeholder="Enter funnel name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={limitReached}
        />
      </div>
      <div className={styles.actions}>
        <Button type="submit" disabled={limitReached}>
          Create
        </Button>
        {limitReached && (
          <p className={styles.helperText}>Maximum funnels limit reached</p>
        )}
        {error && !limitReached && <p className={styles.helperText}>{error}</p>}
      </div>
    </form>
  );
};

export default CreateFunnelForm;
