import { EXPENSE_CATEGORIES, CATEGORY_COLORS } from "../../constants/categories";
import { fmt } from "../../utils/financial";
import { exportToCSV } from "../../utils/export";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import styles from "./ExpenseList.module.css";

export default function ExpenseList({ expenses, setExpenses, onDelete }) {
  return (
    <div>
      <div className={styles.headingRow}>
        <div className={styles.heading}>All expenses</div>
        <button
          type="button"
          className={styles.exportBtn}
          onClick={() => exportToCSV(expenses, ["item", "category", "amount", "paid"], "trip-expenses.csv")}
        >
          Export CSV
        </button>
      </div>
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
              <ConfirmDeleteButton
                onConfirm={() => onDelete(e)}
                ariaLabel={`Delete ${e.item}`}
                className={styles.deleteBtn}
              >
                {"\u00D7"}
              </ConfirmDeleteButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
