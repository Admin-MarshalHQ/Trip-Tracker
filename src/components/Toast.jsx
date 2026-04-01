import styles from "./Toast.module.css";

export default function Toast({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type] || styles.info}`}>
          <span className={styles.message}>{t.message}</span>
          {t.undoAction && (
            <button
              type="button"
              className={styles.undoBtn}
              onClick={() => {
                t.undoAction();
                onDismiss(t.id);
              }}
            >
              Undo
            </button>
          )}
          <button
            type="button"
            className={styles.dismissBtn}
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss"
          >
            {"\u00D7"}
          </button>
        </div>
      ))}
    </div>
  );
}
