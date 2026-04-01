import styles from "./SyncBadge.module.css";

export default function SyncBadge({ isSyncing }) {
  return (
    <div className={styles.badge}>
      <span
        className={styles.dot}
        style={{ background: isSyncing ? "#1D9E75" : "#888" }}
      />
      {isSyncing ? "Syncing across devices" : "Offline mode \u2014 data saved locally"}
    </div>
  );
}
