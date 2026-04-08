import { PACKING_CATEGORIES, BAGS } from "../../constants/packing";
import styles from "./PackingForm.module.css";

export default function PackingForm({ draft, setDraft, onAdd }) {
  return (
    <div className={styles.form}>
      <div className={styles.heading}>Add item</div>
      <div className={styles.topRow}>
        <div className={styles.field} style={{ flex: 2 }}>
          <label className={styles.label} htmlFor="pack-name">Item</label>
          <input
            id="pack-name"
            type="text"
            placeholder="e.g. Rain jacket, Charger, Passport"
            className={styles.input}
            value={draft.name}
            onChange={(e) => setDraft(p => ({ ...p, name: e.target.value }))}
          />
        </div>
        <div className={styles.field} style={{ flex: 1 }}>
          <label className={styles.label} htmlFor="pack-volume">Litres</label>
          <input
            id="pack-volume"
            type="number"
            min="0.5"
            step="0.5"
            className={styles.input}
            value={draft.volume}
            onChange={(e) => setDraft(p => ({ ...p, volume: e.target.value }))}
          />
        </div>
      </div>
      <div className={styles.middleRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pack-category">Category</label>
          <select
            id="pack-category"
            className={styles.select}
            value={draft.category}
            onChange={(e) => setDraft(p => ({ ...p, category: e.target.value }))}
          >
            {PACKING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pack-bag">Bag</label>
          <select
            id="pack-bag"
            className={styles.select}
            value={draft.bag}
            onChange={(e) => setDraft(p => ({ ...p, bag: e.target.value }))}
          >
            <option value="unassigned">Unassigned</option>
            {BAGS.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
          </select>
        </div>
        <div className={styles.ownedCheck}>
          <input
            type="checkbox"
            id="owned-check"
            checked={!draft.owned}
            onChange={(e) => setDraft(p => ({ ...p, owned: !e.target.checked }))}
            className={styles.checkbox}
          />
          <label htmlFor="owned-check" className={styles.ownedLabel}>Need to buy</label>
        </div>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className={styles.addBtn}
        disabled={!draft.name}
        style={{ opacity: draft.name ? 1 : 0.4 }}
      >
        Add
      </button>
    </div>
  );
}
