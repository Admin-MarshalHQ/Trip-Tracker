import { useState, useMemo, useCallback } from "react";
import { DEFAULT } from "./constants/defaults";
import { COLORS } from "./constants/theme";
import { TRIP_DEFAULTS, DEFAULT_RATES, CURRENCIES } from "./constants/trip";
import { estimateNetBonus, estimateOneWeekNet } from "./utils/financial";
import { usePersistedState } from "./hooks/usePersistedState";
import { useCloudSync } from "./hooks/useCloudSync";
import { useToast } from "./hooks/useToast";

import Header from "./components/Header";
import TabSwitcher from "./components/TabSwitcher";
import HeroCard from "./components/HeroCard";
import Toast from "./components/Toast";
import SyncBadge from "./components/SyncBadge";
import ProjectedBalanceChart from "./components/ProjectedBalanceChart";
import Row from "./components/Row";
import SpendingInput from "./components/SpendingInput";
import BonusSlider from "./components/BonusSlider";
import BackupFunds from "./components/BackupFunds";
import ActualsLog from "./components/ActualsLog";
import SettingsPanel from "./components/SettingsPanel";
import ExpenseForm from "./components/expenses/ExpenseForm";
import ExpenseSummary from "./components/expenses/ExpenseSummary";
import CategoryBreakdown from "./components/expenses/CategoryBreakdown";
import ExpenseList from "./components/expenses/ExpenseList";
import SpendLog from "./components/trip/SpendLog";
import BudgetTracker from "./components/trip/BudgetTracker";
import DailyTrendChart from "./components/trip/DailyTrendChart";
import SpendHistory from "./components/trip/SpendHistory";
import TripSettings from "./components/trip/TripSettings";

import styles from "./App.module.css";

export default function App() {
  const [s, setS] = usePersistedState("trip-tracker-settings", DEFAULT);
  const [showSettings, setShowSettings] = useState(false);
  const [actuals, setActuals] = usePersistedState("trip-tracker-actuals", { apr: null, may: null, jun: null });
  const [tab, setTab] = useState("savings");
  const [expenses, setExpenses] = usePersistedState("trip-tracker-expenses", []);
  const [draft, setDraft] = useState({ item: "", category: "Gear", amount: "", paid: false });

  // Trip spending state
  const [tripSpends, setTripSpends] = usePersistedState("trip-tracker-spends", []);
  const [tripConfig, setTripConfig] = usePersistedState("trip-tracker-trip-config", TRIP_DEFAULTS);
  const [rates, setRates] = usePersistedState("trip-tracker-rates", DEFAULT_RATES);
  const [tripCurrency, setTripCurrency] = usePersistedState("trip-tracker-currency", "MXN");
  const [tripDraft, setTripDraft] = useState({
    description: "",
    category: "Food & Drink",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    endDate: "",
  });

  // Cloud sync — auto-syncs all data to a single shared Firestore document
  const syncSetters = useMemo(() => ({
    setS, setActuals, setExpenses, setTripSpends, setTripConfig, setRates, setTripCurrency,
  }), [setS, setActuals, setExpenses, setTripSpends, setTripConfig, setRates, setTripCurrency]);

  const allSyncState = useMemo(() => ({
    settings: s, actuals, expenses, tripSpends, tripConfig, rates, tripCurrency,
  }), [s, actuals, expenses, tripSpends, tripConfig, rates, tripCurrency]);

  const { isSyncing } = useCloudSync(allSyncState, syncSetters);

  // Toast notifications
  const { toasts, addToast, removeToast } = useToast();

  const projections = useMemo(() => {
    const netNow = s.currentAcc + s.saver + s.edgeCredit - s.amexDebt;
    const esppTotal = s.esppAccum + s.esppMonthly * 1;
    const esppValue = esppTotal * (1 + s.esppDiscount / 100);
    const mayNet = s.monthlyNet + s.esppMonthly;
    const oneWeekNet = estimateOneWeekNet(s.annualBasic);
    const bonusNet = estimateNetBonus(s.annualBasic, s.bonusSlider);
    const totalSpend = s.spendApr + s.spendMay + s.spendJun;

    const projected = {
      mar: netNow,
      apr: netNow + s.monthlyNet - s.spendApr,
      may: netNow + s.monthlyNet + mayNet - s.spendApr - s.spendMay + esppValue,
      jun: netNow + s.monthlyNet + mayNet - totalSpend + esppValue + oneWeekNet + bonusNet,
    };

    const backupTotal = s.overdraftLimit + s.edgeLimit + s.amexLimit;

    return { netNow, esppTotal, esppValue, mayNet, oneWeekNet, bonusNet, projected, backupTotal };
  }, [s]);

  const { netNow, esppTotal, esppValue, mayNet, oneWeekNet, bonusNet, projected, backupTotal } = projections;

  const finalTotal = actuals.jun ?? projected.jun;
  const pctTarget = (finalTotal / s.target) * 100;
  const getVal = (key) => actuals[key] ?? projected[key];
  const totalAvailable = finalTotal + backupTotal;

  const handleAddExpense = () => {
    if (!draft.item || !draft.amount) return;
    const name = draft.item.trim();
    setExpenses(p => [...p, { ...draft, item: name, amount: parseFloat(draft.amount), id: Date.now() }]);
    setDraft({ item: "", category: draft.category, amount: "", paid: false });
    addToast(`Added "${name}"`);
  };

  const handleDeleteExpense = useCallback((expense) => {
    setExpenses(p => p.filter(x => x.id !== expense.id));
    addToast(`Removed "${expense.item}"`, {
      type: "info",
      undoAction: () => setExpenses(p => [...p, expense].sort((a, b) => a.id - b.id)),
    });
  }, [setExpenses, addToast]);

  const handleAddTripSpend = () => {
    if (!tripDraft.description || !tripDraft.amount) return;
    const currencyObj = CURRENCIES.find(c => c.code === tripCurrency);
    const desc = tripDraft.description.trim();
    const totalAmount = parseFloat(tripDraft.amount);
    const startDate = tripDraft.date;
    const endDate = tripDraft.endDate;

    if (endDate && endDate > startDate) {
      const start = new Date(startDate + "T00:00:00");
      const end = new Date(endDate + "T00:00:00");
      const dayCount = Math.round((end - start) / (1000 * 60 * 60 * 24));
      const dailyAmount = Math.round((totalAmount / dayCount) * 100) / 100;
      const groupId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const newSpends = [];
      for (let i = 0; i < dayCount; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        newSpends.push({
          description: desc,
          category: tripDraft.category,
          amount: dailyAmount,
          currency: tripCurrency,
          currencySymbol: currencyObj?.symbol || "",
          date: dateStr,
          id: Date.now() + i,
          groupId,
          totalAmount,
          dayCount,
        });
      }
      setTripSpends(p => [...p, ...newSpends]);
      addToast(`Logged ${currencyObj?.symbol || ""}${totalAmount} across ${dayCount} nights`);
    } else {
      setTripSpends(p => [...p, {
        description: desc,
        category: tripDraft.category,
        amount: totalAmount,
        currency: tripCurrency,
        currencySymbol: currencyObj?.symbol || "",
        date: startDate,
        id: Date.now(),
      }]);
      addToast(`Logged ${currencyObj?.symbol || ""}${tripDraft.amount}`);
    }

    setTripDraft({
      description: "",
      category: tripDraft.category,
      amount: "",
      date: tripDraft.date,
      endDate: "",
    });
  };

  const handleDeleteTripSpend = useCallback((spend) => {
    if (spend.groupId) {
      setTripSpends(p => {
        const removed = p.filter(x => x.groupId === spend.groupId);
        const remaining = p.filter(x => x.groupId !== spend.groupId);
        addToast(`Removed "${spend.description}" (${removed.length} nights)`, {
          type: "info",
          undoAction: () => setTripSpends(prev => [...prev, ...removed].sort((a, b) => a.id - b.id)),
        });
        return remaining;
      });
    } else {
      setTripSpends(p => p.filter(x => x.id !== spend.id));
      addToast(`Removed "${spend.description}"`, {
        type: "info",
        undoAction: () => setTripSpends(p => [...p, spend].sort((a, b) => a.id - b.id)),
      });
    }
  }, [setTripSpends, addToast]);

  return (
    <div className={styles.container}>
      <Header target={s.target} routeName={tripConfig.routeName} startDate={tripConfig.startDate} />
      <TabSwitcher tab={tab} setTab={setTab} expenseCount={expenses.length} tripSpendCount={tripSpends.length} />

      {tab === "savings" && (
        <div role="tabpanel" id="panel-savings" aria-label="Savings tracker">
          <HeroCard
            pctTarget={pctTarget}
            finalTotal={finalTotal}
            target={s.target}
            netNow={netNow}
            bonusSlider={s.bonusSlider}
          />

          <ProjectedBalanceChart
            projected={projected}
            actuals={actuals}
            target={s.target}
            getVal={getVal}
          />

          {/* April */}
          <div className={styles.monthSection}>
            <div className={styles.sectionHeading}>April</div>
            <div className={styles.monthGrid}>
              <Row label="Net pay" amount={s.monthlyNet} color={COLORS.blue}/>
              <SpendingInput value={s.spendApr} onChange={(v) => setS(p => ({ ...p, spendApr: v }))} />
            </div>
          </div>

          {/* May */}
          <div className={styles.monthSection}>
            <div className={styles.sectionHeading}>May</div>
            <div className={styles.monthGrid}>
              <Row label="Net pay" amount={mayNet} color={COLORS.blue}
                note="No ESPP deduction from May onwards"/>
              <Row label="ESPP cashout" amount={esppValue} color={COLORS.purple}
                note={`\u00A3${Math.round(esppTotal)} contributions + ${s.esppDiscount}% discount`}/>
              <SpendingInput value={s.spendMay} onChange={(v) => setS(p => ({ ...p, spendMay: v }))} />
            </div>
          </div>

          {/* June */}
          <div className={styles.monthSectionLast}>
            <div className={styles.sectionHeading}>June</div>
            <div className={styles.monthGrid}>
              <Row label="1 week's pay" amount={Math.round(oneWeekNet)} color={COLORS.green}
                note="Final week, paid end of June"/>
              <BonusSlider
                bonusSlider={s.bonusSlider}
                bonusPct={s.bonusPct}
                bonusNet={bonusNet}
                onChange={(v) => setS(p => ({ ...p, bonusSlider: v }))}
              />
              <SpendingInput
                value={s.spendJun}
                onChange={(v) => setS(p => ({ ...p, spendJun: v }))}
                label="Spending (1 week)"
                note="June 1–8 before departure"
              />
            </div>
          </div>

          <BackupFunds
            overdraftLimit={s.overdraftLimit}
            edgeLimit={s.edgeLimit}
            amexLimit={s.amexLimit}
            totalAvailable={totalAvailable}
          />

          <ActualsLog actuals={actuals} setActuals={setActuals} projected={projected} />

          <SettingsPanel
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            s={s}
            setS={setS}
            setActuals={setActuals}
          />

          <div className={styles.footnote}>
            Tax estimates use 20% income tax, 8% NIC, 9% Plan 2 student loan, 2% pension salary sacrifice.
            ESPP value assumes {s.esppDiscount}% discount on contributions. Bonus is conditional &mdash; use the slider to estimate.
          </div>
        </div>
      )}

      {tab === "expenses" && (
        <div role="tabpanel" id="panel-expenses" aria-label="Expense tracker">
          <ExpenseForm draft={draft} setDraft={setDraft} onAdd={handleAddExpense} />

          {expenses.length > 0 && (<>
            <ExpenseSummary expenses={expenses} />
            <CategoryBreakdown expenses={expenses} />
            <ExpenseList expenses={expenses} setExpenses={setExpenses} onDelete={handleDeleteExpense} />
          </>)}

          {expenses.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyTitle}>No expenses logged yet</div>
              <div className={styles.emptySubtitle}>Add your flights, gear, bookings and other pre-trip costs above</div>
            </div>
          )}
        </div>
      )}

      {tab === "trip" && (
        <div role="tabpanel" id="panel-trip" aria-label="Trip spending tracker">
          <SpendLog
            draft={tripDraft}
            setDraft={setTripDraft}
            onAdd={handleAddTripSpend}
            currency={tripCurrency}
            setCurrency={setTripCurrency}
          />

          {tripSpends.length > 0 && (<>
            <BudgetTracker
              spends={tripSpends}
              tripConfig={tripConfig}
              totalSavings={finalTotal}
              rates={rates}
            />
            <DailyTrendChart
              spends={tripSpends}
              rates={rates}
              dailyBudget={tripConfig.dailyBudget}
            />
          </>)}

          <SpendHistory
            spends={tripSpends}
            setSpends={setTripSpends}
            rates={rates}
            onDelete={handleDeleteTripSpend}
          />

          <TripSettings
            tripConfig={tripConfig}
            setTripConfig={setTripConfig}
            rates={rates}
            setRates={setRates}
          />
        </div>
      )}

      <SyncBadge isSyncing={isSyncing} />

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
