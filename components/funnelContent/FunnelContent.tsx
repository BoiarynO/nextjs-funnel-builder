import styles from "./FunnelContent.module.css";

type FunnelContentProps = {
  funnel: {
    name: string;
    questions: string[];
  } | null;
};

const FunnelContent = ({ funnel }: FunnelContentProps) => {
  if (!funnel) {
    return (
      <div className={styles.container}>
        <p>No funnel selected.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{funnel.name}</h1>
      <div className={styles.questions}>
        {funnel.questions.map((question, index) => (
          <div key={index} className={styles.questionCard}>
            {question}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelContent;

