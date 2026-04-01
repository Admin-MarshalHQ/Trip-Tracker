import { MONTHS } from "../constants/defaults";
import { COLORS } from "../constants/theme";
import { fmt } from "../utils/financial";
import styles from "./ProjectedBalanceChart.module.css";

export default function ProjectedBalanceChart({ projected, actuals, target, getVal }) {
  return (
    <div className={styles.chart}>
      <div className={styles.heading} style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "12px" }}>
        Projected balance
      </div>
      <div className={styles.bars}>
        {MONTHS.map((m) => {
          const val = getVal(m.key);
          const maxVal = Math.max(...Object.values(projected), target) * 1.08;
          const h = Math.max(8, (val / maxVal) * 155);
          const isActual = actuals[m.key] !== null;
          return (
            <div key={m.key} className={styles.barColumn}>
              <div className={styles.barValue}>{fmt(Math.round(val))}</div>
              <div
                className={styles.bar}
                style={{
                  height: h,
                  background: isActual ? COLORS.green : m.key === "jun"
                    ? `linear-gradient(180deg, ${COLORS.blue}, ${COLORS.green})` : "rgba(55,138,221,0.65)",
                }}
              >
                {isActual && <div className={styles.actualDot}/>}
              </div>
              <div className={styles.barLabel}>
                {m.short}{isActual ? " (actual)" : ""}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.targetLine}>
        <span className={styles.targetText}>Target: {fmt(target)}</span>
      </div>
    </div>
  );
}
