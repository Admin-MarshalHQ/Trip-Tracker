import { EXPENSE_CATEGORIES } from "../../constants/categories";
import styles from "./ExpenseForm.module.css";

export default function ExpenseForm({ draft, setDraft, onAdd }) {
  return (
    <div className={styles.form}>
      <div className={styles.heading}>Add expense</div>
      <div className={styles.inputGrid}>
        <div>
          <label className={styles.label} htmlFor="expense-item">Item</label>
          <input
            id="expense-item"
            type="text"
            placeholder="e.g. Osprey Farpoint 40L"
            className={styles.input}
            value={draft.item}
            onChange={(e) => setDraft(p => ({ ...p, item: e.target.value }))}
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="expense-amount">Amount</label>
          <input
            id="expense-amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            className={styles.input}
            value={draft.amount}
            onChange={(e) => setDraft(p => ({ ...p, amount: e.target.value }))}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div style={{ flex: 1 }}>
          <label className={styles.label} htmlFor="expense-category">Category</label>
          <select
            id="expense-category"
            className={styles.select}
            value={draft.category}
            onChange={(e) => setDraft(p => ({ ...p, category: e.target.value }))}
          >
            {EXPENSE_CATEGORIES.map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </select>
        </div>
        <div className={styles.paidCheck}>
          <input
            type="checkbox"
            id="paid-check"
            checked={draft.paid}
            onChange={(e) => setDraft(p => ({ ...p, paid: e.target.checked }))}
            className={styles.checkbox}
          />
          <label htmlFor="paid-check" className={styles.paidLabel}>Already paid</label>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className={styles.addBtn}
          style={{ opacity: draft.item && draft.amount ? 1 : 0.4 }}
          disabled={!draft.item || !draft.amount}
        >
          Add
        </button>
      </div>
    </div>
  );
}
