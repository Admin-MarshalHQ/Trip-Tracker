import { fmt } from "../utils/financial";
import styles from "./ActualsLog.module.css";

export default function ActualsLog({ actuals, setActuals, projected }) {
  return (
    <div className={styles.section}>
      <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "12px" }}>
        Log actual balances
      </div>
      <div className={styles.grid}>
        {["apr", "may", "jun"].map((m) => (
          <div key={m}>
            <label className={styles.label} htmlFor={`actual-${m}`}>End of {m}</label>
            <input
              id={`actual-${m}`}
              type="number"
              min="0"
              step="0.01"
              placeholder={fmt(Math.round(projected[m]))}
              className={styles.input}
              value={actuals[m] ?? ""}
              onChange={(e) => {
                const v = e.target.value === "" ? null : parseFloat(e.target.value);
                setActuals(p => ({ ...p, [m]: v }));
              }}
            />
          </div>
        ))}
      </div>
      <div className={styles.hint}>
        Enter your real total across all accounts at month end to track vs projection.
      </div>
    </div>
  );
}
