import { useState, useMemo } from "react";
import { CATEGORY_COLORS } from "../../constants/categories";
import { fmt } from "../../utils/financial";
import styles from "./ImportExpenses.module.css";

const CATEGORY_MAP = {
  Gear: "Accessories",
  Tech: "Electronics",
  Clothing: "Clothing",
  Flights: null,
  Accommodation: null,
  Insurance: null,
  Vaccinations: null,
  Other: "Other",
};

export default function ImportExpenses({ expenses, packingItems, onImport }) {
  const [open, setOpen] = useState(false);

  const importable = useMemo(() => {
    const existingNames = new Set(packingItems.map(p => p.name.toLowerCase()));
    return expenses.filter(e => {
      const mappedCat = CATEGORY_MAP[e.category];
      if (!mappedCat) return false;
      return !existingNames.has(e.item.toLowerCase());
    });
  }, [expenses, packingItems]);

  if (importable.length === 0 && !open) return null;

  const handleImport = (expense) => {
    const category = CATEGORY_MAP[expense.category] || "Other";
    onImport({
      name: expense.item,
      category,
      bag: "unassigned",
      owned: expense.paid,
      size: "M",
    });
  };

  const handleImportAll = () => {
    for (const e of importable) {
      handleImport(e);
    }
    setOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={() => setOpen(!open)}
      >
        {open ? "Hide" : `Import from pre-trip (${importable.length})`}
      </button>

      {open && (
        <div className={styles.list}>
          {importable.length === 0 && (
            <div className={styles.empty}>All packable expenses already imported</div>
          )}
          {importable.length > 1 && (
            <button type="button" className={styles.importAllBtn} onClick={handleImportAll}>
              Import all ({importable.length})
            </button>
          )}
          {importable.map((e) => {
            const c = CATEGORY_COLORS[e.category] || "#888780";
            return (
              <div key={e.id} className={styles.item}>
                <div className={styles.indicator} style={{ background: c }} />
                <div className={styles.content}>
                  <div className={styles.name}>{e.item}</div>
                  <div className={styles.meta}>{e.category} &middot; {fmt(e.amount)}</div>
                </div>
                <button
                  type="button"
                  className={styles.importBtn}
                  onClick={() => handleImport(e)}
                >
                  +
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
