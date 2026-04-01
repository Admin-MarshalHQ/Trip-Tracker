import { fmt } from "../utils/financial";
import styles from "./BackupFunds.module.css";

export default function BackupFunds({ overdraftLimit, edgeLimit, amexLimit, totalAvailable }) {
  const items = [
    { label: "Santander overdraft", amount: overdraftLimit },
    { label: "Edge credit card", amount: edgeLimit },
    { label: "American Express", amount: amexLimit },
  ];
  const backupTotal = overdraftLimit + edgeLimit + amexLimit;

  return (
    <div className={styles.section}>
      <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "12px" }}>
        Backup funds (emergency credit)
      </div>
      <div className={styles.card}>
        {items.map((item, i) => (
          <div key={i} className={`${styles.item} ${i < 2 ? styles.itemBorder : ""}`}>
            <span className={styles.itemLabel}>{item.label}</span>
            <span className={styles.itemAmount}>{fmt(item.amount)}</span>
          </div>
        ))}
        <div className={styles.totalRow}>
          <span>Total backup available</span>
          <span className={styles.totalAmount}>{fmt(backupTotal)}</span>
        </div>
      </div>
      <div className={styles.firepower}>
        <div>
          <div className={styles.firepowerLabel}>Total firepower (savings + backup)</div>
          <div className={styles.firepowerSublabel}>Projected savings + all available credit</div>
        </div>
        <div className={styles.firepowerAmount}>{fmt(Math.round(totalAvailable))}</div>
      </div>
    </div>
  );
}
