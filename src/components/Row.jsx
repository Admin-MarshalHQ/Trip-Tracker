import { fmt } from "../utils/financial";
import styles from "./Row.module.css";

export default function Row({ label, amount, color, note, conditional, checked, onToggle, negative }) {
  const dimmed = conditional && !checked;
  return (
    <div
      className={styles.row}
      style={{
        background: negative ? "rgba(226,75,74,0.03)" : dimmed ? "rgba(128,128,128,0.02)" : "rgba(128,128,128,0.04)",
        border: `0.5px solid ${negative ? "rgba(226,75,74,0.1)" : `rgba(128,128,128,${dimmed ? 0.06 : 0.1})`}`,
        opacity: dimmed ? 0.45 : 1,
      }}
    >
      {conditional && (
        <input type="checkbox" checked={checked} onChange={onToggle}
          className={styles.checkbox} style={{ accentColor: color }}
          aria-label={`Include ${label}`}/>
      )}
      <div className={styles.indicator} style={{ background: color }}/>
      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
        {note && <div className={styles.note}>{note}</div>}
      </div>
      <div className={styles.amount} style={{ color: dimmed ? "inherit" : color }}>
        {negative ? "\u2212" : "+"}{fmt(Math.round(Math.abs(amount)))}
      </div>
    </div>
  );
}
