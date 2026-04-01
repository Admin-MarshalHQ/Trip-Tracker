import { useMemo, useState } from "react";
import { TRIP_CATEGORIES, TRIP_CATEGORY_COLORS } from "../../constants/trip";
import { fmt } from "../../utils/financial";
import { safeRate } from "../../utils/validation";
import { exportToCSV } from "../../utils/export";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import styles from "./SpendHistory.module.css";

export default function SpendHistory({ spends, setSpends, rates, onDelete }) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const items = filter === "all" ? spends : spends.filter(s => s.category === filter);
    return [...items].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  }, [spends, filter]);

  const categoryTotals = useMemo(() => {
    const totals = {};
    for (const s of spends) {
      const gbp = s.amount * safeRate(rates, s.currency);
      totals[s.category] = (totals[s.category] || 0) + gbp;
    }
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [spends, rates]);

  // Group filtered items by date
  const grouped = useMemo(() => {
    const groups = {};
    for (const s of filtered) {
      if (!groups[s.date]) groups[s.date] = [];
      groups[s.date].push(s);
    }
    return Object.entries(groups);
  }, [filtered]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  return (
    <div>
      {/* Category breakdown */}
      {categoryTotals.length > 0 && (
        <div className={styles.categories}>
          <div className={styles.heading}>By category</div>
          <div className={styles.pills}>
            <button
              className={`${styles.pill} ${filter === "all" ? styles.pillActive : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            {categoryTotals.map(([cat, total]) => {
              const c = TRIP_CATEGORY_COLORS[cat] || "#888780";
              return (
                <button
                  key={cat}
                  className={`${styles.pill} ${filter === cat ? styles.pillActive : ""}`}
                  style={{
                    background: filter === cat ? `${c}22` : `${c}11`,
                    border: `0.5px solid ${filter === cat ? `${c}66` : `${c}33`}`,
                  }}
                  onClick={() => setFilter(filter === cat ? "all" : cat)}
                >
                  <span className={styles.pillLabel}>{cat}</span>
                  <span className={styles.pillAmount}>{fmt(Math.round(total))}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Spend log grouped by date */}
      {grouped.length > 0 && (
        <div>
          <div className={styles.headingRow}>
            <div className={styles.heading}>
              Spend log {filter !== "all" && `\u2014 ${filter}`}
            </div>
            <button
              type="button"
              className={styles.exportBtn}
              onClick={() => exportToCSV(spends, ["description", "category", "amount", "currency", "date"], "trip-spending.csv")}
            >
              Export CSV
            </button>
          </div>
          {grouped.map(([date, items]) => {
            const dayTotal = items.reduce((sum, s) => sum + s.amount * safeRate(rates, s.currency), 0);
            return (
              <div key={date} className={styles.dateGroup}>
                <div className={styles.dateHeader}>
                  <span>{formatDate(date)}</span>
                  <span className={styles.dateTotal}>{fmt(Math.round(dayTotal))}</span>
                </div>
                {items.map((s) => {
                  const c = TRIP_CATEGORY_COLORS[s.category] || "#888780";
                  const gbp = s.amount * safeRate(rates, s.currency);
                  const currencyInfo = s.currency !== "GBP" ? `${s.currencySymbol || ""}${s.amount.toLocaleString()} ${s.currency}` : null;
                  return (
                    <div key={s.id} className={styles.item}>
                      <div className={styles.indicator} style={{ background: c }} />
                      <div className={styles.content}>
                        <div className={styles.itemName}>{s.description}</div>
                        <div className={styles.itemMeta}>
                          {s.category}
                          {currencyInfo && <span className={styles.currencyNote}> &middot; {currencyInfo}</span>}
                          {s.groupId && <span className={styles.splitNote}> &middot; {s.currencySymbol}{s.totalAmount.toLocaleString()} / {s.dayCount} nights</span>}
                        </div>
                      </div>
                      <div className={styles.amount}>{fmt(Math.round(gbp))}</div>
                      <ConfirmDeleteButton
                        onConfirm={() => onDelete(s)}
                        ariaLabel={`Delete ${s.description}`}
                        className={styles.deleteBtn}
                      >
                        {"\u00D7"}
                      </ConfirmDeleteButton>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {spends.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>No trip spending logged yet</div>
          <div className={styles.emptySubtitle}>Start logging purchases once your trip begins</div>
        </div>
      )}
    </div>
  );
}
