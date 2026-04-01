import ProgressRing from "./ProgressRing";
import { fmt } from "../utils/financial";
import { COLORS } from "../constants/theme";
import styles from "./HeroCard.module.css";

export default function HeroCard({ pctTarget, finalTotal, target, netNow, bonusSlider }) {
  const statusLabel = pctTarget >= 100 ? "On track" : pctTarget >= 70 ? "Close" : "Behind";

  return (
    <div className={styles.hero}>
      <div className={styles.ringWrapper}>
        <ProgressRing pct={pctTarget} size={110} stroke={8}/>
        <div className={styles.ringOverlay}>
          <div className={styles.pctValue}>{Math.round(pctTarget)}%</div>
          <div className={styles.pctLabel}>{statusLabel}</div>
        </div>
      </div>
      <div className={styles.statsGrid}>
        <div>
          <div className={styles.statLabel}>Projected total</div>
          <div className={styles.statValueLarge} style={{ color: COLORS.green }}>{fmt(Math.round(finalTotal))}</div>
        </div>
        <div>
          <div className={styles.statLabel}>
            {finalTotal >= target ? "Surplus" : "Shortfall"}
          </div>
          <div className={styles.statValueLarge} style={{ color: finalTotal >= target ? COLORS.green : COLORS.red }}>
            {finalTotal >= target ? "+" : ""}{fmt(Math.round(finalTotal - target))}
          </div>
        </div>
        <div>
          <div className={styles.statLabel}>Today</div>
          <div className={styles.statValueSmall}>{fmt(Math.round(netNow))}</div>
        </div>
        <div>
          <div className={styles.statLabel}>Bonus</div>
          <div className={styles.statValueSmall} style={{ opacity: bonusSlider > 0 ? 1 : 0.35 }}>
            {bonusSlider > 0 ? `${bonusSlider}%` : "None"}
          </div>
        </div>
      </div>
    </div>
  );
}
