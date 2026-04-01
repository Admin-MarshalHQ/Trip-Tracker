import { TRIP_CATEGORIES } from "../../constants/trip";
import { CURRENCIES } from "../../constants/trip";
import styles from "./SpendLog.module.css";

export default function SpendLog({ draft, setDraft, onAdd, currency, setCurrency }) {
  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  return (
    <div className={styles.form}>
      <div className={styles.heading}>Log a purchase</div>
      <div className={styles.topRow}>
        <div className={styles.field} style={{ flex: 2 }}>
          <label className={styles.label} htmlFor="trip-desc">What</label>
          <input
            id="trip-desc"
            type="text"
            placeholder="e.g. Hostel dorm, Tacos, Bus ticket"
            className={styles.input}
            value={draft.description}
            onChange={(e) => setDraft(p => ({ ...p, description: e.target.value }))}
          />
        </div>
        <div className={styles.field} style={{ flex: 1 }}>
          <label className={styles.label} htmlFor="trip-amount">Amount</label>
          <div className={styles.amountRow}>
            <span className={styles.currencySymbol}>{currencyObj.symbol}</span>
            <input
              id="trip-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              className={styles.amountInput}
              value={draft.amount}
              onChange={(e) => setDraft(p => ({ ...p, amount: e.target.value }))}
            />
          </div>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="trip-category">Category</label>
          <select
            id="trip-category"
            className={styles.select}
            value={draft.category}
            onChange={(e) => setDraft(p => ({ ...p, category: e.target.value }))}
          >
            {TRIP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="trip-currency">Currency</label>
          <select
            id="trip-currency"
            className={styles.select}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.dateRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="trip-date">Date</label>
          <input
            id="trip-date"
            type="date"
            className={styles.input}
            value={draft.date}
            onChange={(e) => setDraft(p => ({ ...p, date: e.target.value }))}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="trip-end-date">End date (splits cost)</label>
          <input
            id="trip-end-date"
            type="date"
            className={styles.input}
            value={draft.endDate}
            min={draft.date}
            onChange={(e) => setDraft(p => ({ ...p, endDate: e.target.value }))}
          />
        </div>
      </div>
      <div>
        <button
          type="button"
          onClick={onAdd}
          className={styles.addBtn}
          disabled={!draft.description || !draft.amount}
          style={{ opacity: draft.description && draft.amount ? 1 : 0.4 }}
        >
          Log
        </button>
      </div>
    </div>
  );
}
