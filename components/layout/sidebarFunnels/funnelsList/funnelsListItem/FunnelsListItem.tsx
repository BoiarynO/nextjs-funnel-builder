import Button from "@/components/ui/button/Button";
import type { Funnel } from "@/types/funnel";
import DeleteIcon from "@/assets/icons/delete.svg";

import styles from "./FunnelsListItem.module.css";

type FunnelsListItemProps = {
  funnel: Funnel;
  isActive: boolean;
  selectFunnel: (funnel: Funnel) => void;
  deleteFunnel: (id: string) => void;
};

const FunnelsListItem = ({
  funnel,
  isActive,
  selectFunnel,
  deleteFunnel,
}: FunnelsListItemProps) => {
  const handleSelectFunnel = () => {
    selectFunnel(funnel);
  };

  const handleDeleteFunnel = () => {
    deleteFunnel(funnel.id);
  };

  return (
    <div className={styles.itemRow}>
      <Button
        type="button"
        className={styles.itemButton}
        outlined
        fill
        active={isActive}
        onClick={handleSelectFunnel}
      >
        {funnel.name}
      </Button>
      <Button
        type="button"
        outlined
        className={styles.deleteButton}
        onClick={handleDeleteFunnel}
        aria-label={`Delete funnel ${funnel.name}`}
      >
        <DeleteIcon className={styles.deleteButtonIcon} aria-hidden />
      </Button>
    </div>
  );
};

export default FunnelsListItem;
