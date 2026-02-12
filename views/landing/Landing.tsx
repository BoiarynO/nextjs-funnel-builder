import Heading from "@/components/ui/heading/Heading";
import LinkButton from "@/components/ui/linkButton/LinkButton";

import styles from "./Landing.module.css";

const Landing = () => {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <Heading as="h1" colored>
          Funnel Builder
        </Heading>
        <p className={styles.description}>
          Tool for creating funnels and exporting them as JSON.
        </p>
        <LinkButton filled href="/funnels">
          Go to My Funnels
        </LinkButton>
      </div>
    </main>
  );
};

export default Landing;
