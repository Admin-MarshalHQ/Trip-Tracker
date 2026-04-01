import { MONTHS } from "../constants/defaults";
import { COLORS } from "../constants/theme";
import { fmt } from "../utils/financial";
import styles from "./ProjectedBalanceChart.module.css";

const TRACK_H = 140;
const LABEL_H = 20; // approximate height of barLabel below bars

export default function ProjectedBalanceChart({ projected, actuals, target, getVal }) {
  const maxVal = Math.max(...Object.values(projected), target) * 1.1;
  const targetBottom = maxVal > 0
    ? LABEL_H + (target / maxVal) * TRACK_H
    : LABEL_H;

  return (
    <div className={styles.chart}>
      <div className={styles.heading}>Projected balance</div>
      <div className={styles.barsRow}>
        {MONTHS.map((m) => {
          const val = getVal(m.key);
          const h = maxVal > 0 ? Math.max(4, (val / maxVal) * TRACK_H) : 4;
          const isActual = actuals[m.key] !== null;
          return (
            <div key={m.key} className={styles.barColumn}>
              <div className={styles.barValue}>{fmt(Math.round(val))}</div>
              <div className={styles.barTrack} style={{ height: TRACK_H }}>
                <div
                  className={styles.bar}
                  style={{
                    height: h,
                    background: isActual ? COLORS.green : m.key === "jun"
                      ? `linear-gradient(180deg, ${COLORS.blue}, ${COLORS.green})` : "rgba(55,138,221,0.65)",
                  }}
                >
                  {isActual && <div className={styles.actualDot} />}
                </div>
              </div>
              <div className={styles.barLabel}>
                {m.short}{isActual ? " (actual)" : ""}
              </div>
            </div>
          );
        })}
        <div className={styles.targetLine} style={{ bottom: targetBottom }}>
          <span className={styles.targetText}>Target: {fmt(target)}</span>
        </div>
      </div>
    </div>
  );
}
