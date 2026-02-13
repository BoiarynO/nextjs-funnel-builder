"use client";

import SidebarFunnels from "@/components/layout/sidebarFunnels/SidebarFunnels";
import FunnelContent from "@/components/layout/funnelContent/FunnelContent";
import CreateFunnelForm from "@/components/layout/createFunnelForm/CreateFunnelForm";
import { useFunnelsStore } from "@/stores/funnelsStore";

import styles from "./Funnels.module.css";
import FunnelsDataLayer from "./dataLayer/FunnelsDataLayer";

export default function Funnels() {
  const isCreatingFunnel = useFunnelsStore((s) => s.isCreatingFunnel);

  return (
    <>
      <FunnelsDataLayer />
      <main className={styles.container}>
        <aside className={styles.sidebar}>
          <SidebarFunnels />
        </aside>
        <section className={styles.content}>
          {isCreatingFunnel ? <CreateFunnelForm /> : <FunnelContent />}
        </section>
      </main>
    </>
  );
}
