import { useEffect } from "react";

import { useFunnelsStore } from "@/stores/funnelsStore";

/* 
FunnelsDataLayer is used to load the funnels from the storage and select the first funnel as default
it is a data layer that runs when the funnels page mounts
*/
const FunnelsDataLayer = () => {
  useEffect(() => {
    useFunnelsStore.getState().initialize();
  }, []);

  return null;
};

export default FunnelsDataLayer;
