import type { Funnel } from "@/types/funnel";
import { useFunnelsStore } from "@/stores/funnelsStore";

import FunnelEditor from "./FunnelEditor";
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
      <FunnelEditor />
    </div>
  );
};

export default FunnelContent;
