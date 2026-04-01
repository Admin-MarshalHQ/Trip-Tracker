import styles from "./TabSwitcher.module.css";

export default function TabSwitcher({ tab, setTab, expenseCount, tripSpendCount }) {
  const tabs = [
    { key: "savings", label: "Savings" },
    { key: "expenses", label: `Pre-trip${expenseCount > 0 ? ` (${expenseCount})` : ""}` },
    { key: "trip", label: `In-trip${tripSpendCount > 0 ? ` (${tripSpendCount})` : ""}` },
  ];

  return (
    <div className={styles.tabBar} role="tablist" aria-label="Dashboard sections">
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={tab === t.key}
          aria-controls={`panel-${t.key}`}
          onClick={() => setTab(t.key)}
          className={`${styles.tab} ${tab === t.key ? styles.tabActive : styles.tabInactive}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
