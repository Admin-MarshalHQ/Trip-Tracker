import { useMemo } from "react";
import { fmt } from "../../utils/financial";
import { safeRate } from "../../utils/validation";
import { COLORS } from "../../constants/theme";
import styles from "./DailyTrendChart.module.css";

export default function DailyTrendChart({ spends, rates, dailyBudget }) {
  const { days, maxVal } = useMemo(() => {
    const dailyMap = {};
    for (const s of spends) {
      const gbp = s.amount * safeRate(rates, s.currency);
      dailyMap[s.date] = (dailyMap[s.date] || 0) + gbp;
    }

    // Last 14 days with spending
    const sorted = Object.entries(dailyMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14);

    const max = Math.max(...sorted.map(([, v]) => v), dailyBudget) * 1.1;
    return {
      days: sorted.map(([date, total]) => ({
        date,
        total,
        label: new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      })),
      maxVal: max,
    };
  }, [spends, rates, dailyBudget]);

  if (days.length < 2) return null;

  // Budget line positioned in px relative to the 100px bar track
  const budgetPx = maxVal > 0 ? (dailyBudget / maxVal) * 100 : 0;

  return (
    <div className={styles.section}>
      <div className={styles.heading}>Daily spending</div>
      <div className={styles.chartWrapper}>
        <div className={styles.bars}>
          {days.map((d) => {
            const h = maxVal > 0 ? Math.max(4, (d.total / maxVal) * 100) : 4;
            const overBudget = d.total > dailyBudget;
            return (
              <div key={d.date} className={styles.barColumn}>
                <div className={styles.barValue}>{fmt(Math.round(d.total))}</div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${h}%`,
                      background: overBudget ? COLORS.red : COLORS.blue,
                    }}
                  />
                </div>
                <div className={styles.barLabel}>{d.label}</div>
              </div>
            );
          })}
          <div className={styles.budgetLine} style={{ bottom: `${budgetPx + 17}px` }}>
            <span className={styles.budgetLabel}>{fmt(dailyBudget)}/day</span>
          </div>
        </div>
      </div>
    </div>
  );
}
