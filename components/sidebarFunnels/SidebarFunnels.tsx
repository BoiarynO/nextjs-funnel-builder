import styles from "./SidebarFunnels.module.css";

type Funnel = {
  id: string;
  name: string;
};

type SidebarFunnelsProps = {
  funnels: Funnel[];
  selectedFunnelId: string | null;
  onSelectFunnel: (funnel: Funnel) => void;
  onCreateFunnel: () => void;
};

const SidebarFunnels = ({
  funnels,
  selectedFunnelId,
  onSelectFunnel,
  onCreateFunnel,
}: SidebarFunnelsProps) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Funnels</h2>
      <div className={styles.list}>
        {funnels.map((funnel) => (
          <button
            key={funnel.id}
            type="button"
            className={`${styles.itemButton} ${
              funnel.id === selectedFunnelId ? styles.itemButtonActive : ""
            }`}
            onClick={() => onSelectFunnel(funnel)}
          >
            {funnel.name}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={styles.createButton}
        onClick={onCreateFunnel}
      >
        Create funnel
      </button>
    </div>
  );
};

export default SidebarFunnels;

