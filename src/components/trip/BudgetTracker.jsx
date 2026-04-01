import { useMemo } from "react";
import { fmt } from "../../utils/financial";
import { safeRate } from "../../utils/validation";
import { COLORS } from "../../constants/theme";
import styles from "./BudgetTracker.module.css";

export default function BudgetTracker({ spends, tripConfig, totalSavings, rates }) {
  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const start = tripConfig.startDate;
    const daysSinceStart = Math.max(1, Math.ceil((new Date(today) - new Date(start)) / 86400000));

    let totalGBP = 0;
    let todayGBP = 0;
    const dailyMap = {};

    for (const s of spends) {
      const gbp = s.amount * safeRate(rates, s.currency);
      totalGBP += gbp;
      if (s.date === today) todayGBP += gbp;
      dailyMap[s.date] = (dailyMap[s.date] || 0) + gbp;
    }

    const daysWithSpend = Object.keys(dailyMap).length || 1;
    const avgDaily = totalGBP / daysWithSpend;
    const dailyBudget = tripConfig.dailyBudget;
    const totalBudget = tripConfig.totalBudget > 0 ? tripConfig.totalBudget : totalSavings;
    const remaining = totalBudget - totalGBP;
    const pctUsed = totalBudget > 0 ? (totalGBP / totalBudget) * 100 : 0;

    // Forecast
    const daysOfBudgetLeft = avgDaily > 0 ? Math.floor(remaining / avgDaily) : Infinity;
    const runOutDate = avgDaily > 0 && daysOfBudgetLeft < 9999
      ? new Date(Date.now() + daysOfBudgetLeft * 86400000).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      : null;

    // Velocity: compare last 7 days to overall
    const sortedDates = Object.keys(dailyMap).sort();
    const recentDates = sortedDates.slice(-7);
    const recentTotal = recentDates.reduce((sum, d) => sum + (dailyMap[d] || 0), 0);
    const recentAvg = recentDates.length > 0 ? recentTotal / recentDates.length : avgDaily;
    const velocityPct = avgDaily > 0 ? ((recentAvg - avgDaily) / avgDaily) * 100 : 0;

    return { totalGBP, todayGBP, avgDaily, dailyBudget, totalBudget, remaining, pctUsed, daysSinceStart, daysWithSpend, daysOfBudgetLeft, runOutDate, recentAvg, velocityPct };
  }, [spends, tripConfig, totalSavings, rates]);

  const budgetStatus = stats.avgDaily <= stats.dailyBudget ? "Under budget" : "Over budget";
  const budgetColor = stats.avgDaily <= stats.dailyBudget ? COLORS.green : COLORS.red;

  return (
    <div className={styles.section}>
      {/* Summary cards */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Spent today</div>
          <div className={styles.cardValue} style={{ color: COLORS.blue }}>
            {fmt(Math.round(stats.todayGBP))}
          </div>
          <div className={styles.cardHint}>Daily budget: {fmt(stats.dailyBudget)}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Total spent</div>
          <div className={styles.cardValue}>
            {fmt(Math.round(stats.totalGBP))}
          </div>
          <div className={styles.cardHint}>{stats.daysWithSpend} day{stats.daysWithSpend !== 1 ? "s" : ""} logged</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Remaining</div>
          <div className={styles.cardValue} style={{ color: stats.remaining >= 0 ? COLORS.green : COLORS.red }}>
            {fmt(Math.round(stats.remaining))}
          </div>
          <div className={styles.cardHint}>of {fmt(Math.round(stats.totalBudget))}</div>
        </div>
      </div>

      {/* Budget bar */}
      <div className={styles.barSection}>
        <div className={styles.barHeader}>
          <span className={styles.barLabel}>Budget used</span>
          <span className={styles.barPct} style={{ color: budgetColor }}>{Math.round(stats.pctUsed)}%</span>
        </div>
        <div className={styles.barTrack}>
          <div
            className={styles.barFill}
            style={{
              width: `${Math.min(stats.pctUsed, 100)}%`,
              background: stats.pctUsed > 90 ? COLORS.red : stats.pctUsed > 70 ? COLORS.orange : COLORS.green,
            }}
          />
        </div>
      </div>

      {/* Daily average */}
      <div className={styles.avgSection}>
        <div className={styles.avgRow}>
          <span>Daily average</span>
          <span className={styles.avgValue} style={{ color: budgetColor }}>
            {fmt(Math.round(stats.avgDaily))}/day
          </span>
        </div>
        <div className={styles.avgStatus} style={{ color: budgetColor }}>
          {budgetStatus} &mdash; {stats.avgDaily <= stats.dailyBudget
            ? `${fmt(Math.round(stats.dailyBudget - stats.avgDaily))} under daily target`
            : `${fmt(Math.round(stats.avgDaily - stats.dailyBudget))} over daily target`
          }
        </div>
        {stats.daysWithSpend >= 2 && (
          <div className={styles.velocity}>
            {stats.velocityPct > 15 ? "\u2191 Spending increasing" :
             stats.velocityPct < -15 ? "\u2193 Spending decreasing" :
             "\u2014 Steady pace"}
          </div>
        )}
      </div>

      {/* Forecast */}
      {stats.remaining > 0 && stats.avgDaily > 0 && (
        <div className={styles.forecastSection}>
          <div className={styles.forecastRow}>
            <span>At this pace, funds last</span>
            <span className={styles.forecastValue} style={{ color: stats.daysOfBudgetLeft > 30 ? COLORS.green : stats.daysOfBudgetLeft > 14 ? COLORS.orange : COLORS.red }}>
              {stats.daysOfBudgetLeft} more days
            </span>
          </div>
          {stats.runOutDate && (
            <div className={styles.forecastHint}>Until approximately {stats.runOutDate}</div>
          )}
        </div>
      )}
    </div>
  );
}
