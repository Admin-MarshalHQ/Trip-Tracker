import { COLORS } from "../constants/theme";
import { fmt } from "../utils/financial";
import styles from "./BonusSlider.module.css";

export default function BonusSlider({ bonusSlider, bonusPct, bonusNet, onChange }) {
  const active = bonusSlider > 0;
  return (
    <div className={`${styles.bonus} ${active ? styles.bonusActive : styles.bonusInactive}`}>
      <div className={styles.header}>
        <div className={styles.indicator}/>
        <div className={styles.content}>
          <div className={styles.label}>Bonus</div>
          <div className={styles.sublabel}>Conditional &mdash; slide to estimate</div>
        </div>
        <div className={styles.amount} style={{ color: active ? COLORS.orange : "inherit", opacity: active ? 1 : 0.35 }}>
          {active ? `+${fmt(Math.round(bonusNet))}` : fmt(0)}
        </div>
      </div>
      <div className={styles.sliderRow}>
        <span className={styles.sliderBound} style={{ minWidth: "20px" }}>0%</span>
        <input
          type="range"
          min="0"
          max={bonusPct}
          step="1"
          value={bonusSlider}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={styles.slider}
          aria-label="Bonus percentage"
        />
        <span className={styles.sliderBound} style={{ minWidth: "28px", textAlign: "right" }}>{bonusPct}%</span>
      </div>
      <div className={styles.sliderValue} style={{ color: active ? COLORS.orange : "inherit", opacity: active ? 1 : 0.4 }}>
        {bonusSlider}%
      </div>
    </div>
  );
}
