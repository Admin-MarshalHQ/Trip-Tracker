import { CURRENCIES, DEFAULT_RATES } from "../../constants/trip";
import { parseFinancialInput } from "../../utils/validation";
import styles from "./TripSettings.module.css";

export default function TripSettings({ tripConfig, setTripConfig, rates, setRates }) {
  return (
    <div className={styles.section}>
      <div className={styles.heading}>Trip budget settings</div>
      <div className={styles.grid}>
        <div>
          <label className={styles.label} htmlFor="daily-budget">Daily budget (&pound;)</label>
          <input
            id="daily-budget"
            type="number"
            min="0"
            step="1"
            className={styles.input}
            value={tripConfig.dailyBudget}
            onChange={(e) => setTripConfig(p => ({ ...p, dailyBudget: parseFinancialInput(e.target.value) }))}
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="total-budget">Total trip budget (&pound;)</label>
          <input
            id="total-budget"
            type="number"
            min="0"
            step="1"
            className={styles.input}
            value={tripConfig.totalBudget}
            placeholder="Uses savings if 0"
            onChange={(e) => setTripConfig(p => ({ ...p, totalBudget: parseFinancialInput(e.target.value) }))}
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="trip-start">Trip start date</label>
          <input
            id="trip-start"
            type="date"
            className={styles.input}
            value={tripConfig.startDate}
            onChange={(e) => setTripConfig(p => ({ ...p, startDate: e.target.value }))}
          />
        </div>
      </div>

      <details className={styles.ratesDetails}>
        <summary className={styles.ratesSummary}>Exchange rates (to GBP)</summary>
        <div className={styles.ratesGrid}>
          {CURRENCIES.filter(c => c.code !== "GBP").map(c => (
            <div key={c.code} className={styles.rateRow}>
              <label className={styles.rateLabel} htmlFor={`rate-${c.code}`}>
                1 {c.code}
              </label>
              <input
                id={`rate-${c.code}`}
                type="number"
                min="0"
                step="0.0001"
                className={styles.rateInput}
                value={rates[c.code]}
                onChange={(e) => setRates(p => ({ ...p, [c.code]: parseFloat(e.target.value) || 0 }))}
              />
              <span className={styles.rateGBP}>&pound;</span>
            </div>
          ))}
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => {
              if (window.confirm("Reset exchange rates to defaults?")) {
                setRates(DEFAULT_RATES);
              }
            }}
          >
            Reset rates
          </button>
        </div>
      </details>
    </div>
  );
}
