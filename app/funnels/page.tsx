"use client";

import { useState } from "react";
import SidebarFunnels from "../../components/sidebarFunnels/SidebarFunnels";
import FunnelContent from "../../components/funnelContent/FunnelContent";
import CreateFunnelForm from "../../components/createFunnelForm/CreateFunnelForm";
import styles from "./page.module.css";

type Funnel = {
  id: string;
  name: string;
  questions: string[];
};

const mockFunnel: Funnel = {
  id: "test-funnel",
  name: "Test Funnel",
  questions: [
    "What is your goal?",
    "How experienced are you?",
    "What is your budget?",
  ],
};

export default function FunnelsPage() {
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(
    mockFunnel
  );
  const [isCreatingFunnel, setIsCreatingFunnel] = useState(false);

  const handleSelectFunnel = (funnel: Funnel) => {
    setSelectedFunnel(funnel);
    setIsCreatingFunnel(false);
  };

  const handleStartCreateFunnel = () => {
    setIsCreatingFunnel(true);
  };

  return (
    <main className={styles.container}>
      <aside className={styles.sidebar}>
        <SidebarFunnels
          funnels={[mockFunnel]}
          selectedFunnelId={selectedFunnel?.id ?? null}
          onSelectFunnel={handleSelectFunnel}
          onCreateFunnel={handleStartCreateFunnel}
        />
      </aside>
      <section className={styles.content}>
        {isCreatingFunnel ? (
          <CreateFunnelForm />
        ) : (
          <FunnelContent funnel={selectedFunnel} />
        )}
      </section>
    </main>
  );
}

