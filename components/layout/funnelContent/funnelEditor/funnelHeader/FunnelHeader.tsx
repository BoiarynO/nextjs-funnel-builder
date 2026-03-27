"use client";

import { useFunnelsStore, selectIsEditMode } from "@/stores/funnelsStore";

import FunnelHeaderTitle from "./funnelHeaderTitle/FunnelHeaderTitle";
import FunnelHeaderSettings from "./funnelHeaderSettings/FunnelHeaderSettings";

const FunnelHeader = () => {
  const isEditMode = useFunnelsStore(selectIsEditMode);

  if (isEditMode) {
    return <FunnelHeaderSettings />;
  }

  return <FunnelHeaderTitle />;
};

export default FunnelHeader;
