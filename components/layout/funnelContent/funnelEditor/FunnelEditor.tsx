"use client";

// view documentation: docs/components/layout/funnelContent/funnelEditor/FunnelEditor.md
import {
  useFunnelsStore,
  selectSelectedFunnel,
  selectIsEditMode,
} from "@/stores/funnelsStore";

import ButtonDownloadFunnelJson from "./buttonDownloadFunnelJson/ButtonDownloadFunnelJson";
import FunnelHeader from "./funnelHeader/FunnelHeader";
import StepsReorderSection from "./stepsReorderSection/StepsReorderSection";
import StepsContent from "./stepsContent/StepsContent";
import styles from "./FunnelEditor.module.css";

const FunnelEditor = () => {
  const selectedFunnel = useFunnelsStore(selectSelectedFunnel);
  const isEditMode = useFunnelsStore(selectIsEditMode);

  if (!selectedFunnel) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FunnelHeader />
        <ButtonDownloadFunnelJson />
      </div>

      {isEditMode ? <StepsReorderSection /> : <StepsContent />}
    </div>
  );
};

export default FunnelEditor;
