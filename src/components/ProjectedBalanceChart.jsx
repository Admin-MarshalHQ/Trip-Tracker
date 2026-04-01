import { MONTHS } from "../constants/defaults";
import { COLORS } from "../constants/theme";
import { fmt } from "../utils/financial";
import styles from "./ProjectedBalanceChart.module.css";

export default function ProjectedBalanceChart({ projected, actuals, target, getVal }) {
  const maxVal = Math.max(...Object.values(projected), target) * 1.08;
  const BAR_AREA = 155;
  // Position target line relative to bar area height
  const targetPx = maxVal > 0 ? (target / maxVal) * BAR_AREA : 0;

  return (
    <div className={styles.chart}>
      <div className={styles.heading} style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "12px" }}>
        Projected balance
      </div>
      <div className={styles.barsWrapper}>
        <div className={styles.bars}>
          {MONTHS.map((m) => {
            const val = getVal(m.key);
            const h = Math.max(8, (val / maxVal) * BAR_AREA);
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
        <div className={styles.targetLine} style={{ bottom: `${targetPx + 24}px` }}>
          <span className={styles.targetText}>Target: {fmt(target)}</span>
        </div>
      </div>
    </div>
  );
}
