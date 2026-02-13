import { useFunnelsStore } from "@/stores/funnelsStore";

import FunnelEditor from "./funnelEditor/FunnelEditor";
import styles from "./FunnelContent.module.css";

const FunnelContent = () => {
  const selectedFunnel = useFunnelsStore((s) => {
    if (!s.selectedFunnelId) return null;
    return s.funnels.find((f) => f.id === s.selectedFunnelId) ?? null;
  });

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
