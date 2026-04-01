import { DEFAULT } from "../constants/defaults";
import { parseFinancialInput, clampPercent } from "../utils/validation";
import ConfirmDeleteButton from "./ConfirmDeleteButton";
import styles from "./SettingsPanel.module.css";

const SETTINGS_FIELDS = [
  { key: "monthlyNet", label: "Monthly net pay (\u00A3)", isPercent: false },
  { key: "bonusPct", label: "Max bonus (%)", isPercent: true },
  { key: "esppDiscount", label: "ESPP discount (%)", isPercent: true },
  { key: "target", label: "Savings target (\u00A3)", isPercent: false },
  { key: "esppAccum", label: "ESPP accumulated (\u00A3)", isPercent: false },
  { key: "overdraftLimit", label: "Overdraft limit (\u00A3)", isPercent: false },
  { key: "edgeLimit", label: "Edge CC limit (\u00A3)", isPercent: false },
  { key: "amexLimit", label: "Amex limit (\u00A3)", isPercent: false },
];

export default function SettingsPanel({ showSettings, setShowSettings, s, setS, setActuals }) {
  return (
    <div>
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={styles.toggleBtn}
        aria-expanded={showSettings}
        aria-controls="settings-panel"
      >
        {showSettings ? "Hide" : "Adjust"} assumptions &#9662;
      </button>
      {showSettings && (
        <div id="settings-panel" className={styles.panel}>
          {SETTINGS_FIELDS.map(({ key, label, isPercent }) => (
            <div key={key}>
              <label className={styles.label} htmlFor={`setting-${key}`}>{label}</label>
              <input
                id={`setting-${key}`}
                type="number"
                min="0"
                max={isPercent ? 100 : undefined}
                step={isPercent ? 1 : 0.01}
                className={styles.input}
                value={s[key]}
                onChange={(e) => {
                  const val = isPercent
                    ? clampPercent(parseFloat(e.target.value))
                    : parseFinancialInput(e.target.value);
                  setS(p => ({ ...p, [key]: val }));
                }}
              />
            </div>
          ))}
          <div className={styles.resetRow}>
            <ConfirmDeleteButton
              onConfirm={() => {
                setS(DEFAULT);
                setActuals({ apr: null, may: null, jun: null });
              }}
              ariaLabel="Reset all financial assumptions to defaults"
              className={styles.resetBtn}
            >
              Reset to defaults
            </ConfirmDeleteButton>
          </div>
        </div>
      )}
    </div>
  );
}
