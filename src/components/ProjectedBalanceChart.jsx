import { MONTHS } from "../constants/defaults";
import { fmt } from "../utils/financial";
import styles from "./ProjectedBalanceChart.module.css";

const BAR_COLORS = [
  "rgba(55, 138, 221, 0.5)",
  "rgba(55, 138, 221, 0.65)",
  "rgba(29, 158, 117, 0.6)",
  "linear-gradient(180deg, #378ADD, #1D9E75)",
];

export default function ProjectedBalanceChart({ projected, actuals, target, getVal }) {
  const maxVal = Math.max(...Object.values(projected)) * 1.1;

  return (
    <div className={styles.chart}>
      <div className={styles.heading}>Projected balance</div>
      <div className={styles.barsRow}>
        {MONTHS.map((m, i) => {
          const val = getVal(m.key);
          const h = maxVal > 0 ? Math.max(4, (val / maxVal) * 140) : 4;
          const isActual = actuals[m.key] !== null;
          const bg = isActual ? "#1D9E75" : BAR_COLORS[i] || BAR_COLORS[BAR_COLORS.length - 1];
          return (
            <div key={m.key} className={styles.barColumn}>
              <div className={styles.barTrack}>
                <div
                  className={styles.bar}
                  style={{ height: h, background: bg }}
                >
                  <div className={styles.barValue}>{fmt(Math.round(val))}</div>
                  {isActual && <div className={styles.actualDot} />}
                </div>
              </div>
              <div className={styles.barLabel}>
                {m.short}{isActual ? " (actual)" : ""}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.targetHint}>Target: {fmt(target)}</div>
    </div>
  );
}
