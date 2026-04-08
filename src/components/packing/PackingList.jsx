import { useMemo } from "react";
import { PACKING_CATEGORIES, PACKING_CATEGORY_COLORS, BAGS, SIZES } from "../../constants/packing";
import { exportToCSV } from "../../utils/export";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import styles from "./PackingList.module.css";

export default function PackingList({ items, setItems, onDelete }) {
  const packedCount = useMemo(() => items.filter(i => i.packed).length, [items]);
  const toBuyCount = useMemo(() => items.filter(i => !i.owned).length, [items]);

  const sorted = useMemo(() =>
    [...items].sort((a, b) => {
      if (a.packed !== b.packed) return a.packed ? 1 : -1;
      return b.id - a.id;
    }),
  [items]);

  return (
    <div>
      <div className={styles.headingRow}>
        <div className={styles.heading}>
          {packedCount} of {items.length} packed
          {toBuyCount > 0 && <span className={styles.toBuy}> &middot; {toBuyCount} to buy</span>}
        </div>
        <button
          type="button"
          className={styles.exportBtn}
          onClick={() => exportToCSV(items, ["name", "category", "bag", "packed", "owned", "volume"], "packing-list.csv")}
        >
          Export CSV
        </button>
      </div>
      <div className={styles.list}>
        {sorted.map((item) => {
          const c = PACKING_CATEGORY_COLORS[item.category] || "#888780";
          return (
            <div key={item.id} className={styles.item} style={{ opacity: item.packed ? 0.5 : 1 }}>
              <input
                type="checkbox"
                checked={item.packed}
                onChange={() => setItems(p => p.map(x => x.id === item.id ? { ...x, packed: !x.packed } : x))}
                className={styles.checkbox}
                aria-label={`Mark ${item.name} as ${item.packed ? "unpacked" : "packed"}`}
              />
              <div className={styles.indicator} style={{ background: c }} />
              <div className={styles.content}>
                <div className={styles.itemName} style={{ textDecoration: item.packed ? "line-through" : "none" }}>
                  {item.name}
                  {!item.owned && <span className={styles.buyPill}>Buy</span>}
                </div>
                <div className={styles.itemMeta}>
                  <select
                    value={item.category}
                    onChange={(e) => setItems(p => p.map(x => x.id === item.id ? { ...x, category: e.target.value } : x))}
                    className={styles.metaSelect}
                    aria-label={`Category for ${item.name}`}
                  >
                    {PACKING_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <span className={styles.dot}>&middot;</span>
                  <select
                    value={item.bag}
                    onChange={(e) => setItems(p => p.map(x => x.id === item.id ? { ...x, bag: e.target.value } : x))}
                    className={styles.metaSelect}
                    aria-label={`Bag for ${item.name}`}
                  >
                    <option value="unassigned">Unassigned</option>
                    {BAGS.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
                  </select>
                  <span className={styles.dot}>&middot;</span>
                  <select
                    value={item.size || "M"}
                    onChange={(e) => {
                      const vol = SIZES.find(s => s.key === e.target.value)?.volume || 1.5;
                      setItems(p => p.map(x => x.id === item.id ? { ...x, size: e.target.value, volume: vol } : x));
                    }}
                    className={styles.metaSelect}
                    aria-label={`Size for ${item.name}`}
                  >
                    {SIZES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <ConfirmDeleteButton
                onConfirm={() => onDelete(item)}
                ariaLabel={`Delete ${item.name}`}
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
