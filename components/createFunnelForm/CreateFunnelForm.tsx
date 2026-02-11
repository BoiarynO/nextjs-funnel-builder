import styles from "./CreateFunnelForm.module.css";

const CreateFunnelForm = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create funnel</h1>
      <div className={styles.field}>
        <label htmlFor="funnel-name" className={styles.label}>
          Funnel name
        </label>
        <input
          id="funnel-name"
          type="text"
          className={styles.input}
          placeholder="Enter funnel name"
          disabled
        />
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.button} disabled>
          Add step
        </button>
        <p className={styles.helperText}>Form coming soon</p>
      </div>
    </div>
  );
};

export default CreateFunnelForm;

