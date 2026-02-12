import Link from "next/link";

import styles from "./Landing.module.css";

const Landing = () => {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Funnel Builder</h1>
        <p className={styles.description}>
          Tool for creating funnels and exporting them as JSON.
        </p>
        <Link href="/funnels" className={styles.button}>
          Go to My Funnels
        </Link>
      </div>
    </main>
  );
};

export default Landing;
