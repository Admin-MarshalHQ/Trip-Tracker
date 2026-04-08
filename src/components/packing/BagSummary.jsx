import { useMemo } from "react";
import { BAGS } from "../../constants/packing";
import styles from "./BagSummary.module.css";

export default function BagSummary({ items }) {
  const stats = useMemo(() => {
    const bagStats = {};
    for (const bag of BAGS) {
      bagStats[bag.key] = { count: 0, volume: 0, packed: 0 };
    }
    let unassigned = { count: 0, volume: 0 };

    for (const item of items) {
      const vol = parseFloat(item.volume) || 1;
      if (item.bag === "unassigned" || !bagStats[item.bag]) {
        unassigned.count++;
        unassigned.volume += vol;
      } else {
        bagStats[item.bag].count++;
        bagStats[item.bag].volume += vol;
        if (item.packed) bagStats[item.bag].packed++;
      }
    }

    return { bagStats, unassigned };
  }, [items]);

  const getBarColor = (pct) => {
    if (pct > 95) return "#D85A30";
    if (pct > 80) return "#EF9F27";
    return "#1D9E75";
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.bags}>
        {BAGS.map((bag) => {
          const s = stats.bagStats[bag.key];
          const pct = bag.capacity > 0 ? (s.volume / bag.capacity) * 100 : 0;
          return (
            <div key={bag.key} className={styles.card}>
              <div className={styles.bagName}>{bag.label}</div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${Math.min(100, pct)}%`,
                    background: getBarColor(pct),
                  }}
                />
              </div>
              <div className={styles.stats}>
                <span className={styles.volume}>
                  {Math.round(s.volume * 10) / 10} / {bag.capacity}L
                </span>
                <span className={styles.count}>
                  {s.count} item{s.count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {stats.unassigned.count > 0 && (
        <div className={styles.unassigned}>
          {stats.unassigned.count} unassigned item{stats.unassigned.count !== 1 ? "s" : ""} ({Math.round(stats.unassigned.volume * 10) / 10}L)
        </div>
      )}
    </div>
  );
}
