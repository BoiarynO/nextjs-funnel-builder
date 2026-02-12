import Image from "next/image";

import DeleteIcon from "@/assets/icons/delete.svg";
import { useFunnelsStore } from "@/stores/funnelsStore";
import { MAX_FUNNELS } from "@/config/limits";

import styles from "./SidebarFunnels.module.css";

const SidebarFunnels = () => {
  const funnels = useFunnelsStore((s) => s.funnels);
  const selectedFunnelId = useFunnelsStore((s) => s.selectedFunnelId);
  const selectFunnel = useFunnelsStore((s) => s.selectFunnel);
  const startCreateFunnel = useFunnelsStore((s) => s.startCreateFunnel);
  const deleteFunnel = useFunnelsStore((s) => s.deleteFunnel);

  const canCreateFunnel = funnels.length < MAX_FUNNELS;

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Funnels</h2>
      <div className={styles.list}>
        {funnels.length === 0 && (
          <p className={styles.emptyState}>List is empty</p>
        )}
        {funnels.map((funnel) => (
          <div key={funnel.id} className={styles.itemRow}>
            <button
              type="button"
              className={`${styles.itemButton} ${
                funnel.id === selectedFunnelId ? styles.itemButtonActive : ""
              }`}
              onClick={() => selectFunnel(funnel)}
            >
              {funnel.name}
            </button>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => deleteFunnel(funnel.id)}
              aria-label={`Delete funnel ${funnel.name}`}
            >
              <Image
                src={DeleteIcon}
                alt=""
                className={styles.deleteButtonIcon}
              />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className={styles.createButton}
        onClick={startCreateFunnel}
        disabled={!canCreateFunnel}
      >
        Create funnel
      </button>
    </div>
  );
};

export default SidebarFunnels;
