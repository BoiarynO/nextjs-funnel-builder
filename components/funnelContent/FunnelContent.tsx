import type { Funnel } from "@/types/funnel";
import { useFunnelsStore } from "@/stores/funnelsStore";

import StepsContent from "./stepsContent/StepsContent";
import styles from "./FunnelContent.module.css";

const FunnelContent = () => {
  const funnels = useFunnelsStore((s) => s.funnels);
  const selectedFunnelId = useFunnelsStore((s) => s.selectedFunnelId);

  const selectedFunnel =
    funnels.find((f: Funnel) => f.id === selectedFunnelId) ?? null;

  if (!selectedFunnel) {
    return (
      <div className={styles.container}>
        <p>No funnel selected.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{selectedFunnel.name}</h1>
      <StepsContent />
    </div>
  );
};

export default FunnelContent;
