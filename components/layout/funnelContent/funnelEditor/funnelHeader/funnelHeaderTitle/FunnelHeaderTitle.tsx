import Button from "@/components/ui/button/Button";
import Heading from "@/components/ui/heading/Heading";
import EditIcon from "@/assets/icons/edit.svg";

import styles from "./FunnelHeaderTitle.module.css";

type FunnelHeaderTitleProps = {
  value: string;
  isEditDisabled: boolean;
  onStartEdit: () => void;
};

const FunnelHeaderTitle = ({
  value,
  isEditDisabled,
  onStartEdit,
}: FunnelHeaderTitleProps) => {
  return (
    <div className={styles.row}>
      <Heading as="h3" colored>
        {value}
      </Heading>
      <Button
        type="button"
        onClick={onStartEdit}
        disabled={isEditDisabled}
        aria-label="Edit funnel"
      >
        <EditIcon
          width={24}
          height={24}
          aria-hidden
          style={{ fill: "currentColor" }}
        />
      </Button>
    </div>
  );
};

export default FunnelHeaderTitle;
