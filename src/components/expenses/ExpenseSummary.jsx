import { fmt } from "../../utils/financial";
import { COLORS } from "../../constants/theme";
import styles from "./ExpenseSummary.module.css";

export default function ExpenseSummary({ expenses }) {
  const total = expenses.reduce((a, e) => a + e.amount, 0);
  const paid = expenses.filter(e => e.paid).reduce((a, e) => a + e.amount, 0);
  const unpaid = expenses.filter(e => !e.paid).reduce((a, e) => a + e.amount, 0);

  return (
    <div className={styles.grid}>
      <div className={`${styles.card} ${styles.cardTotal}`}>
        <div className={styles.cardLabel}>Total cost</div>
        <div className={styles.cardValue}>{fmt(total)}</div>
      </div>
      <div className={`${styles.card} ${styles.cardPaid}`}>
        <div className={styles.cardLabel}>Paid</div>
        <div className={styles.cardValue} style={{ color: COLORS.green }}>{fmt(paid)}</div>
      </div>
      <div className={`${styles.card} ${styles.cardUnpaid}`}>
        <div className={styles.cardLabel}>Still to pay</div>
        <div className={styles.cardValue} style={{ color: COLORS.red }}>{fmt(unpaid)}</div>
      </div>
    </div>
  );
}
