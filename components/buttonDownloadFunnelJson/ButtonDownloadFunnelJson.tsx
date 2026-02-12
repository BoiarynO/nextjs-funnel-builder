import { useCallback } from "react";

import type { Funnel } from "@/types/funnel";
import { useFunnelsStore } from "@/stores/funnelsStore";

import styles from "./ButtonDownloadFunnelJson.module.css";

const getFileName = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `funnel-export-${y}-${m}-${d}.json`;
};

const ButtonDownloadFunnelJson = () => {
  const funnels = useFunnelsStore((s) => s.funnels);
  const selectedFunnelId = useFunnelsStore((s) => s.selectedFunnelId);

  const selectedFunnel =
    funnels.find((f: Funnel) => f.id === selectedFunnelId) ?? null;

  const disabled = !selectedFunnel;

  const handleClick = useCallback(() => {
    if (!selectedFunnel) return;

    const data: Funnel = {
      id: selectedFunnel.id,
      name: selectedFunnel.name,
      steps: [...selectedFunnel.steps],
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = getFileName();
    link.click();

    URL.revokeObjectURL(url);
  }, [selectedFunnel]);

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      disabled={disabled}
    >
      Download funnel JSON
    </button>
  );
};

export default ButtonDownloadFunnelJson;
