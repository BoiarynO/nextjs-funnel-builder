import { useFunnelsStore } from "@/stores/funnelsStore";

import styles from "./FunnelsList.module.css";
import FunnelsListItem from "./funnelsListItem/FunnelsListItem";

const FunnelsList = () => {
  const funnels = useFunnelsStore((s) => s.funnels);
  const selectedFunnelId = useFunnelsStore((s) => s.selectedFunnelId);
  const selectFunnel = useFunnelsStore((s) => s.selectFunnel);
  const deleteFunnel = useFunnelsStore((s) => s.deleteFunnel);

  const funnelItems = funnels.map((funnel) => (
    <FunnelsListItem
      key={funnel.id}
      funnel={funnel}
      isActive={selectedFunnelId === funnel.id}
      selectFunnel={selectFunnel}
      deleteFunnel={deleteFunnel}
    />
  ));

  const emptyState = !funnels.length && (
    <p className={styles.emptyState}>Funnels list is empty</p>
  );

  return (
    <div className={styles.list}>
      {emptyState}
      {funnelItems}
    </div>
  );
};

export default FunnelsList;
