import { CATEGORY_COLORS } from "../../constants/categories";
import { fmt } from "../../utils/financial";
import styles from "./CategoryBreakdown.module.css";

export default function CategoryBreakdown({ expenses }) {
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <div className={styles.section}>
      <div className={styles.heading}>By category</div>
      <div className={styles.pills}>
        {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, total]) => {
          const c = CATEGORY_COLORS[cat] || "#888780";
          return (
            <div key={cat} className={styles.pill} style={{ background: `${c}11`, border: `0.5px solid ${c}33` }}>
              <span className={styles.pillLabel}>{cat}</span>
              <span className={styles.pillAmount}>{fmt(total)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
