import { useFunnelsStore } from "@/stores/funnelsStore";
import { MAX_FUNNELS } from "@/config/limits";
import Heading from "@/components/ui/heading/Heading";
import Button from "@/components/ui/button/Button";

import styles from "./SidebarFunnels.module.css";
import FunnelsList from "./funnelsList/FunnelsList";

const SidebarFunnels = () => {
  const funnels = useFunnelsStore((s) => s.funnels);
  const startCreateFunnel = useFunnelsStore((s) => s.startCreateFunnel);

  const canCreateFunnel = funnels.length < MAX_FUNNELS;

  return (
    <div className={styles.container}>
      <Heading as="h2" colored>
        Funnels
      </Heading>

      <FunnelsList />

      <Button
        type="button"
        onClick={startCreateFunnel}
        disabled={!canCreateFunnel}
      >
        Create funnel
      </Button>
    </div>
  );
};

export default SidebarFunnels;
