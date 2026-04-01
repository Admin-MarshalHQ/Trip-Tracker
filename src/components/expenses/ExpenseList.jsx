import { EXPENSE_CATEGORIES, CATEGORY_COLORS } from "../../constants/categories";
import { fmt } from "../../utils/financial";
import styles from "./ExpenseList.module.css";

export default function ExpenseList({ expenses, setExpenses }) {
  return (
    <div>
      <div className={styles.heading}>All expenses</div>
      <div className={styles.list}>
        {expenses.map((e) => {
          const c = CATEGORY_COLORS[e.category] || "#888780";
          return (
            <div key={e.id} className={styles.item} style={{ opacity: e.paid ? 0.55 : 1 }}>
              <input
                type="checkbox"
                checked={e.paid}
                onChange={() => setExpenses(p => p.map(x => x.id === e.id ? { ...x, paid: !x.paid } : x))}
                className={styles.checkbox}
                aria-label={`Mark ${e.item} as ${e.paid ? "unpaid" : "paid"}`}
              />
              <div className={styles.indicator} style={{ background: c }}/>
              <div className={styles.content}>
                <div className={styles.itemName} style={{ textDecoration: e.paid ? "line-through" : "none" }}>{e.item}</div>
                <select
                  value={e.category}
                  onChange={(ev) => setExpenses(p => p.map(x => x.id === e.id ? { ...x, category: ev.target.value } : x))}
                  className={styles.categorySelect}
                  aria-label={`Category for ${e.item}`}
                >
                  {EXPENSE_CATEGORIES.map(cat =>
                    <option key={cat} value={cat}>{cat}</option>
                  )}
                </select>
              </div>
              <div className={styles.amount}>{fmt(e.amount)}</div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Remove "${e.item}"?`)) {
                    setExpenses(p => p.filter(x => x.id !== e.id));
                  }
                }}
                className={styles.deleteBtn}
                aria-label={`Delete ${e.item}`}
              >
                {"\u00D7"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
