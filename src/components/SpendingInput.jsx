import { parseFinancialInput } from "../utils/validation";
import styles from "./SpendingInput.module.css";

export default function SpendingInput({ value, onChange, label, note }) {
  return (
    <div className={styles.spending}>
      <div className={styles.indicator}/>
      <div className={styles.content}>
        <div className={styles.label}>{label || "Spending"}</div>
        {note && <div className={styles.note}>{note}</div>}
      </div>
      <div className={styles.inputWrapper}>
        <span className={styles.prefix}>{"\u2212\u00A3"}</span>
        <input
          type="number"
          min="0"
          step="1"
          value={value}
          onChange={(e) => onChange(parseFinancialInput(e.target.value))}
          className={styles.input}
          aria-label={`${label || "Spending"} amount in pounds`}
        />
      </div>
    </div>
  );
}
