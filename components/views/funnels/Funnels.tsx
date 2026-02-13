"use client";

import { useEffect } from "react";

import SidebarFunnels from "@/components/layout/sidebarFunnels/SidebarFunnels";
import FunnelContent from "@/components/layout/funnelContent/FunnelContent";
import CreateFunnelForm from "@/components/layout/createFunnelForm/CreateFunnelForm";
import { useFunnelsStore } from "@/stores/funnelsStore";

import styles from "./Funnels.module.css";

export default function Funnels() {
  const isCreatingFunnel = useFunnelsStore((s) => s.isCreatingFunnel);

  useEffect(() => {
    useFunnelsStore.getState().initialize();
  }, []);

  return (
    <main className={styles.container}>
      <aside className={styles.sidebar}>
        <SidebarFunnels />
      </aside>
      <section className={styles.content}>
        {isCreatingFunnel ? <CreateFunnelForm /> : <FunnelContent />}
      </section>
    </main>
  );
}
