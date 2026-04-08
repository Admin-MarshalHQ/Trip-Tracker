import { PACKING_CATEGORIES, BAGS, SIZES } from "../../constants/packing";
import styles from "./PackingForm.module.css";

export default function PackingForm({ draft, setDraft, onAdd }) {
  return (
    <div className={styles.form}>
      <div className={styles.heading}>Add item</div>
      <div className={styles.topRow}>
        <div className={styles.field}>
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
      <div className={styles.sizeRow}>
        <span className={styles.label}>Size</span>
        <div className={styles.sizePicker}>
          {SIZES.map(s => (
            <button
              key={s.key}
              type="button"
              className={`${styles.sizeBtn} ${draft.size === s.key ? styles.sizeBtnActive : ""}`}
              onClick={() => setDraft(p => ({ ...p, size: s.key }))}
              title={s.hint}
            >
              {s.label}
            </button>
          ))}
        </div>
        <span className={styles.sizeHint}>
          {SIZES.find(s => s.key === draft.size)?.hint}
        </span>
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
