import { useState } from "react";

const MONTHS = [
  { key: "mar", short: "Now" },
  { key: "apr", short: "Apr" },
  { key: "may", short: "May" },
  { key: "jun", short: "Jun" },
];

const DEFAULT = {
  currentAcc: 160.68,
  saver: 3136.11,
  edgeCredit: 11.11,
  amexDebt: 96.0,
  monthlyNet: 2131.06,
  spendApr: 400,
  spendMay: 400,
  spendJun: 92,
  esppAccum: 1777.91,
  esppMonthly: 313.85,
  esppDiscount: 15,
  bonusPct: 15,
  annualBasic: 37662,
  bonusSlider: 0,
  target: 12000,
  overdraftLimit: 2000,
  edgeLimit: 2911,
  amexLimit: 2906,
};

function estimateNetBonus(annualBasic, bonusPct) {
  const gross = annualBasic * (bonusPct / 100);
  const p = gross * 0.02;
  const t = (gross - p) * 0.2;
  const n = (gross - p) * 0.08;
  const sl = gross * 0.09;
  return gross - p - t - n - sl;
}

function estimateOneWeekNet(annualBasic) {
  const gross = annualBasic / 12 / 4.33;
  const p = gross * 0.02;
  const t = (gross - p) * 0.2;
  const n = (gross - p) * 0.08;
  const slThresh = 27295 / 12;
  const sl = Math.max(0, (gross - slThresh) * 0.09);
  return gross - p - t - n - sl;
}

function fmt(n) {
  const abs = Math.abs(Math.round(n));
  return (n < 0 ? "\u2212" : "") + "\u00A3" + abs.toLocaleString("en-GB");
}

function ProgressRing({ pct, size = 110, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  const color = pct >= 100 ? "#1D9E75" : pct >= 70 ? "#EF9F27" : "#E24B4A";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} opacity={0.08}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}/>
    </svg>
  );
}

function Row({ label, amount, color, note, conditional, checked, onToggle, negative }) {
  const dimmed = conditional && !checked;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "10px 14px", borderRadius: "10px",
      background: negative ? "rgba(226,75,74,0.03)" : dimmed ? "rgba(128,128,128,0.02)" : "rgba(128,128,128,0.04)",
      border: `0.5px solid ${negative ? "rgba(226,75,74,0.1)" : `rgba(128,128,128,${dimmed ? 0.06 : 0.1})`}`,
      opacity: dimmed ? 0.45 : 1, transition: "opacity 0.3s ease",
    }}>
      {conditional && (
        <input type="checkbox" checked={checked} onChange={onToggle}
          style={{ width: 16, height: 16, accentColor: color, cursor: "pointer", flexShrink: 0 }}/>
      )}
      <div style={{ width: 4, height: 32, borderRadius: 2, background: color, flexShrink: 0 }}/>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "14px", fontWeight: 500 }}>{label}</div>
        {note && <div style={{ fontSize: "11px", opacity: 0.45, marginTop: 1 }}>{note}</div>}
      </div>
      <div style={{
        fontSize: "16px", fontWeight: 600, fontFamily: "'DM Mono', monospace",
        color: dimmed ? "inherit" : color,
      }}>
        {negative ? "\u2212" : "+"}{fmt(Math.round(Math.abs(amount)))}
      </div>
    </div>
  );
}

export default function App() {
  const [s, setS] = useState(DEFAULT);
  const [showSettings, setShowSettings] = useState(false);
  const [actuals, setActuals] = useState({ apr: null, may: null, jun: null });
  const [tab, setTab] = useState("savings");
  const [expenses, setExpenses] = useState([]);
  const [draft, setDraft] = useState({ item: "", category: "Gear", amount: "", paid: false });

  const netNow = s.currentAcc + s.saver + s.edgeCredit - s.amexDebt;
  const esppTotal = s.esppAccum + s.esppMonthly * 1; // Only April deduction before May 1 cashout
  const esppValue = esppTotal * (1 + s.esppDiscount / 100);
  const mayNet = s.monthlyNet + s.esppMonthly; // No ESPP deduction from May onwards
  const oneWeekNet = estimateOneWeekNet(s.annualBasic);
  const bonusNetMax = estimateNetBonus(s.annualBasic, s.bonusPct);
  const bonusNet = estimateNetBonus(s.annualBasic, s.bonusSlider);

  const totalSpend = s.spendApr + s.spendMay + s.spendJun;

  const projected = {
    mar: netNow,
    apr: netNow + s.monthlyNet - s.spendApr,
    may: netNow + s.monthlyNet + mayNet - s.spendApr - s.spendMay + esppValue,
    jun: netNow + s.monthlyNet + mayNet - totalSpend + esppValue + oneWeekNet + bonusNet,
  };

  const finalTotal = actuals.jun ?? projected.jun;
  const pctTarget = (finalTotal / s.target) * 100;
  const getVal = (key) => actuals[key] ?? projected[key];

  const backupTotal = s.overdraftLimit + s.edgeLimit + s.amexLimit;
  const totalAvailable = finalTotal + backupTotal;

  const inputStyle = {
    width: "100%", padding: "8px 10px",
    border: "1px solid rgba(128,128,128,0.2)", borderRadius: "6px",
    fontSize: "14px", background: "transparent", color: "inherit",
  };
  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 500,
    letterSpacing: "0.04em", textTransform: "uppercase", opacity: 0.5, marginBottom: "4px",
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", maxWidth: 680, margin: "0 auto", padding: "2rem 0" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, marginBottom: "4px" }}>
          Mexico → Patagonia
        </div>
        <div style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          Trip savings tracker
        </div>
        <div style={{ fontSize: "14px", opacity: 0.5, marginTop: "4px" }}>
          Departure: June 8, 2026 · Target: {fmt(s.target)}
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem", padding: "3px", borderRadius: "10px", background: "rgba(128,128,128,0.06)" }}>
        {[
          { key: "savings", label: "Savings" },
          { key: "expenses", label: `Pre-trip expenses${expenses.length > 0 ? ` (${expenses.length})` : ""}` },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "8px 12px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 600,
            cursor: "pointer", transition: "all 0.2s ease", fontFamily: "inherit",
            background: tab === t.key ? "var(--color-background-primary, white)" : "transparent",
            color: tab === t.key ? "inherit" : "inherit",
            opacity: tab === t.key ? 1 : 0.5,
            boxShadow: tab === t.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "savings" && (<>

      {/* Hero */}
      <div style={{
        display: "flex", alignItems: "center", gap: "2rem",
        padding: "1.5rem", borderRadius: "16px",
        background: "linear-gradient(135deg, rgba(29,158,117,0.06), rgba(55,138,221,0.06))",
        border: "1px solid rgba(29,158,117,0.12)", marginBottom: "1.5rem",
      }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <ProgressRing pct={pctTarget} size={110} stroke={8}/>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{Math.round(pctTarget)}%</div>
            <div style={{ fontSize: "10px", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>of target</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "2px" }}>Projected total</div>
              <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#1D9E75" }}>{fmt(Math.round(finalTotal))}</div>
            </div>
            <div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "2px" }}>
                {finalTotal >= s.target ? "Surplus" : "Shortfall"}
              </div>
              <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "'DM Mono', monospace", color: finalTotal >= s.target ? "#1D9E75" : "#E24B4A" }}>
                {finalTotal >= s.target ? "+" : ""}{fmt(Math.round(finalTotal - s.target))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "2px" }}>Today</div>
              <div style={{ fontSize: "16px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{fmt(Math.round(netNow))}</div>
            </div>
            <div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "2px" }}>Bonus</div>
              <div style={{ fontSize: "16px", fontWeight: 600, fontFamily: "'DM Mono', monospace", opacity: s.bonusSlider > 0 ? 1 : 0.35 }}>
                {s.bonusSlider > 0 ? `${s.bonusSlider}%` : "None"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "12px" }}>
          Projected balance
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: 180, padding: "0 4px" }}>
          {MONTHS.map((m) => {
            const val = getVal(m.key);
            const maxVal = Math.max(...Object.values(projected), s.target) * 1.08;
            const h = Math.max(8, (val / maxVal) * 155);
            const isActual = actuals[m.key] !== null;
            return (
              <div key={m.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{fmt(Math.round(val))}</div>
                <div style={{
                  width: "100%", height: h, borderRadius: "6px 6px 2px 2px",
                  background: isActual ? "#1D9E75" : m.key === "jun"
                    ? "linear-gradient(180deg, #378ADD, #1D9E75)" : "rgba(55,138,221,0.65)",
                  transition: "height 0.4s ease", position: "relative",
                }}>
                  {isActual && <div style={{ position: "absolute", top: -6, right: -4, width: 10, height: 10, borderRadius: "50%", background: "#1D9E75", border: "2px solid white" }}/>}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.5 }}>{m.short}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "8px", padding: "6px 0", borderTop: "1.5px dashed #E24B4A", display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: "11px", color: "#E24B4A", fontWeight: 500 }}>Target: {fmt(s.target)}</span>
        </div>
      </div>

      {/* April */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "12px" }}>
          April
        </div>
        <div style={{ display: "grid", gap: "8px" }}>
          <Row label="Net pay" amount={s.monthlyNet} color="#378ADD"/>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 14px", borderRadius: "10px",
            background: "rgba(226,75,74,0.03)", border: "0.5px solid rgba(226,75,74,0.1)",
          }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: "#E24B4A", flexShrink: 0 }}/>
            <div style={{ flex: 1, fontSize: "14px", fontWeight: 500 }}>Spending</div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "14px", color: "#E24B4A" }}>{"\u2212\u00A3"}</span>
              <input type="number" value={s.spendApr} onChange={(e) => setS(p => ({ ...p, spendApr: parseFloat(e.target.value) || 0 }))}
                style={{ width: "70px", padding: "4px 6px", border: "1px solid rgba(226,75,74,0.2)", borderRadius: "5px",
                  fontSize: "15px", fontWeight: 600, fontFamily: "'DM Mono', monospace", color: "#E24B4A",
                  background: "transparent", textAlign: "right" }}/>
            </div>
          </div>
        </div>
      </div>

      {/* May */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "12px" }}>
          May
        </div>
        <div style={{ display: "grid", gap: "8px" }}>
          <Row label="Net pay" amount={mayNet} color="#378ADD"
            note="No ESPP deduction from May onwards"/>
          <Row label="ESPP cashout" amount={esppValue} color="#7F77DD"
            note={`\u00A3${Math.round(esppTotal)} contributions + ${s.esppDiscount}% discount`}/>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 14px", borderRadius: "10px",
            background: "rgba(226,75,74,0.03)", border: "0.5px solid rgba(226,75,74,0.1)",
          }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: "#E24B4A", flexShrink: 0 }}/>
            <div style={{ flex: 1, fontSize: "14px", fontWeight: 500 }}>Spending</div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "14px", color: "#E24B4A" }}>{"\u2212\u00A3"}</span>
              <input type="number" value={s.spendMay} onChange={(e) => setS(p => ({ ...p, spendMay: parseFloat(e.target.value) || 0 }))}
                style={{ width: "70px", padding: "4px 6px", border: "1px solid rgba(226,75,74,0.2)", borderRadius: "5px",
                  fontSize: "15px", fontWeight: 600, fontFamily: "'DM Mono', monospace", color: "#E24B4A",
                  background: "transparent", textAlign: "right" }}/>
            </div>
          </div>
        </div>
      </div>

      {/* June - broken out */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "12px" }}>
          June
        </div>
        <div style={{ display: "grid", gap: "8px" }}>
          <Row label="1 week's pay" amount={Math.round(oneWeekNet)} color="#1D9E75"
            note="Final week, paid end of June"/>
          <div style={{
            padding: "10px 14px", borderRadius: "10px",
            background: s.bonusSlider > 0 ? "rgba(239,159,39,0.04)" : "rgba(128,128,128,0.02)",
            border: `0.5px solid ${s.bonusSlider > 0 ? "rgba(239,159,39,0.15)" : "rgba(128,128,128,0.06)"}`,
            transition: "all 0.3s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div style={{ width: 4, height: 32, borderRadius: 2, background: "#EF9F27", flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>Bonus</div>
                <div style={{ fontSize: "11px", opacity: 0.45, marginTop: 1 }}>Conditional — slide to estimate</div>
              </div>
              <div style={{ fontSize: "16px", fontWeight: 600, fontFamily: "'DM Mono', monospace", color: s.bonusSlider > 0 ? "#EF9F27" : "inherit", opacity: s.bonusSlider > 0 ? 1 : 0.35 }}>
                {s.bonusSlider > 0 ? `+${fmt(Math.round(bonusNet))}` : fmt(0)}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 4px" }}>
              <span style={{ fontSize: "12px", opacity: 0.4, minWidth: "20px" }}>0%</span>
              <input type="range" min="0" max={s.bonusPct} step="1" value={s.bonusSlider}
                onChange={(e) => setS(p => ({ ...p, bonusSlider: parseFloat(e.target.value) }))}
                style={{ flex: 1, accentColor: "#EF9F27" }}/>
              <span style={{ fontSize: "12px", opacity: 0.4, minWidth: "28px", textAlign: "right" }}>{s.bonusPct}%</span>
            </div>
            <div style={{ textAlign: "center", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace", marginTop: "4px", color: s.bonusSlider > 0 ? "#EF9F27" : "inherit", opacity: s.bonusSlider > 0 ? 1 : 0.4 }}>
              {s.bonusSlider}%
            </div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 14px", borderRadius: "10px",
            background: "rgba(226,75,74,0.03)", border: "0.5px solid rgba(226,75,74,0.1)",
          }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: "#E24B4A", flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 500 }}>Spending (1 week)</div>
              <div style={{ fontSize: "11px", opacity: 0.45, marginTop: 1 }}>June 1–8 before departure</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "14px", color: "#E24B4A" }}>{"\u2212\u00A3"}</span>
              <input type="number" value={s.spendJun} onChange={(e) => setS(p => ({ ...p, spendJun: parseFloat(e.target.value) || 0 }))}
                style={{ width: "70px", padding: "4px 6px", border: "1px solid rgba(226,75,74,0.2)", borderRadius: "5px",
                  fontSize: "15px", fontWeight: 600, fontFamily: "'DM Mono', monospace", color: "#E24B4A",
                  background: "transparent", textAlign: "right" }}/>
            </div>
          </div>
        </div>
      </div>

      {/* Backup funds */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "12px" }}>
          Backup funds (emergency credit)
        </div>
        <div style={{
          padding: "1rem 1.25rem", borderRadius: "12px",
          border: "0.5px solid rgba(128,128,128,0.12)",
          background: "rgba(128,128,128,0.02)",
        }}>
          {[
            { label: "Santander overdraft", amount: s.overdraftLimit },
            { label: "Edge credit card", amount: s.edgeLimit },
            { label: "American Express", amount: s.amexLimit },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 0",
              borderBottom: i < 2 ? "0.5px solid rgba(128,128,128,0.1)" : "none",
              fontSize: "14px",
            }}>
              <span style={{ opacity: 0.6 }}>{item.label}</span>
              <span style={{ fontWeight: 500, fontFamily: "'DM Mono', monospace" }}>{fmt(item.amount)}</span>
            </div>
          ))}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0 4px", marginTop: "4px",
            borderTop: "1.5px solid rgba(128,128,128,0.15)",
            fontSize: "14px", fontWeight: 600,
          }}>
            <span>Total backup available</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "16px" }}>{fmt(backupTotal)}</span>
          </div>
        </div>
        <div style={{
          marginTop: "12px", padding: "12px 16px", borderRadius: "10px",
          background: "linear-gradient(135deg, rgba(55,138,221,0.06), rgba(127,119,221,0.06))",
          border: "1px solid rgba(55,138,221,0.1)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "2px" }}>
              Total firepower (savings + backup)
            </div>
            <div style={{ fontSize: "11px", opacity: 0.4 }}>Projected savings + all available credit</div>
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#378ADD" }}>
            {fmt(Math.round(totalAvailable))}
          </div>
        </div>
      </div>

      {/* Log actuals */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "12px" }}>
          Log actual balances
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {["apr", "may", "jun"].map((m) => (
            <div key={m}>
              <label style={labelStyle}>End of {m}</label>
              <input type="number" placeholder={fmt(Math.round(projected[m]))} style={inputStyle}
                value={actuals[m] ?? ""}
                onChange={(e) => {
                  const v = e.target.value === "" ? null : parseFloat(e.target.value);
                  setActuals(p => ({ ...p, [m]: v }));
                }}/>
            </div>
          ))}
        </div>
        <div style={{ fontSize: "11px", opacity: 0.35, marginTop: "6px" }}>
          Enter your real total across all accounts at month end to track vs projection.
        </div>
      </div>

      {/* Settings */}
      <div>
        <button onClick={() => setShowSettings(!showSettings)} style={{
          background: "none", border: "0.5px solid rgba(128,128,128,0.2)",
          borderRadius: "8px", padding: "8px 16px", fontSize: "13px",
          cursor: "pointer", color: "inherit", opacity: 0.6,
        }}>
          {showSettings ? "Hide" : "Adjust"} assumptions ▾
        </button>
        {showSettings && (
          <div style={{
            marginTop: "12px", padding: "16px", borderRadius: "12px",
            border: "0.5px solid rgba(128,128,128,0.15)",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px",
          }}>
            {[
              { key: "monthlyNet", label: "Monthly net pay (\u00A3)" },
              { key: "bonusPct", label: "Max bonus (%)" },
              { key: "esppDiscount", label: "ESPP discount (%)" },
              { key: "target", label: "Savings target (\u00A3)" },
              { key: "esppAccum", label: "ESPP accumulated (\u00A3)" },
              { key: "overdraftLimit", label: "Overdraft limit (\u00A3)" },
              { key: "edgeLimit", label: "Edge CC limit (\u00A3)" },
              { key: "amexLimit", label: "Amex limit (\u00A3)" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input type="number" style={inputStyle} value={s[key]}
                  onChange={(e) => setS(p => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))}/>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "2rem", fontSize: "11px", opacity: 0.3, lineHeight: 1.5 }}>
        Tax estimates use 20% income tax, 8% NIC, 9% Plan 2 student loan, 2% pension salary sacrifice.
        ESPP value assumes {s.esppDiscount}% discount on contributions. Bonus is conditional — use the slider to estimate.
      </div>
      </>)}

      {tab === "expenses" && (
      <div>
        {/* Add expense form */}
        <div style={{
          padding: "1rem 1.25rem", borderRadius: "12px",
          border: "0.5px solid rgba(128,128,128,0.12)",
          marginBottom: "1.5rem",
        }}>
          <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "12px" }}>
            Add expense
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={labelStyle}>Item</label>
              <input type="text" placeholder="e.g. Osprey Farpoint 40L" style={inputStyle}
                value={draft.item} onChange={(e) => setDraft(p => ({ ...p, item: e.target.value }))}/>
            </div>
            <div>
              <label style={labelStyle}>Amount</label>
              <input type="number" placeholder="0" style={inputStyle}
                value={draft.amount} onChange={(e) => setDraft(p => ({ ...p, amount: e.target.value }))}/>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Category</label>
              <select style={{ ...inputStyle, cursor: "pointer" }}
                value={draft.category} onChange={(e) => setDraft(p => ({ ...p, category: e.target.value }))}>
                {["Gear", "Flights", "Accommodation", "Insurance", "Vaccinations", "Tech", "Clothing", "Other"].map(c =>
                  <option key={c} value={c}>{c}</option>
                )}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingBottom: "2px" }}>
              <input type="checkbox" id="paid-check" checked={draft.paid}
                onChange={(e) => setDraft(p => ({ ...p, paid: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: "#1D9E75", cursor: "pointer" }}/>
              <label htmlFor="paid-check" style={{ fontSize: "13px", cursor: "pointer" }}>Already paid</label>
            </div>
            <button onClick={() => {
              if (!draft.item || !draft.amount) return;
              setExpenses(p => [...p, { ...draft, amount: parseFloat(draft.amount), id: Date.now() }]);
              setDraft({ item: "", category: draft.category, amount: "", paid: false });
            }} style={{
              padding: "8px 20px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", background: "#1D9E75", color: "white", fontFamily: "inherit",
              opacity: draft.item && draft.amount ? 1 : 0.4,
            }}>Add</button>
          </div>
        </div>

        {/* Summary cards */}
        {expenses.length > 0 && (<>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "1.5rem" }}>
            <div style={{ background: "rgba(128,128,128,0.04)", borderRadius: "8px", padding: "1rem" }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "2px" }}>Total cost</div>
              <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
                {fmt(expenses.reduce((a, e) => a + e.amount, 0))}
              </div>
            </div>
            <div style={{ background: "rgba(29,158,117,0.04)", borderRadius: "8px", padding: "1rem" }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "2px" }}>Paid</div>
              <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#1D9E75" }}>
                {fmt(expenses.filter(e => e.paid).reduce((a, e) => a + e.amount, 0))}
              </div>
            </div>
            <div style={{ background: "rgba(226,75,74,0.04)", borderRadius: "8px", padding: "1rem" }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "2px" }}>Still to pay</div>
              <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#E24B4A" }}>
                {fmt(expenses.filter(e => !e.paid).reduce((a, e) => a + e.amount, 0))}
              </div>
            </div>
          </div>

          {/* By category */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "12px" }}>
              By category
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {Object.entries(expenses.reduce((acc, e) => {
                acc[e.category] = (acc[e.category] || 0) + e.amount;
                return acc;
              }, {})).sort((a, b) => b[1] - a[1]).map(([cat, total]) => {
                const colors = { Gear: "#378ADD", Flights: "#7F77DD", Accommodation: "#1D9E75", Insurance: "#D85A30", Vaccinations: "#D4537E", Tech: "#534AB7", Clothing: "#EF9F27", Other: "#888780" };
                const c = colors[cat] || "#888780";
                return (
                  <div key={cat} style={{
                    padding: "6px 12px", borderRadius: "8px",
                    background: `${c}11`, border: `0.5px solid ${c}33`,
                    fontSize: "13px",
                  }}>
                    <span style={{ opacity: 0.6 }}>{cat}</span>
                    <span style={{ fontWeight: 600, fontFamily: "'DM Mono', monospace", marginLeft: "8px" }}>{fmt(total)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expense list */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: "12px" }}>
              All expenses
            </div>
            <div style={{ display: "grid", gap: "6px" }}>
              {expenses.map((e) => {
                const colors = { Gear: "#378ADD", Flights: "#7F77DD", Accommodation: "#1D9E75", Insurance: "#D85A30", Vaccinations: "#D4537E", Tech: "#534AB7", Clothing: "#EF9F27", Other: "#888780" };
                const c = colors[e.category] || "#888780";
                return (
                  <div key={e.id} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 14px", borderRadius: "10px",
                    background: "rgba(128,128,128,0.03)",
                    border: "0.5px solid rgba(128,128,128,0.08)",
                    opacity: e.paid ? 0.55 : 1,
                  }}>
                    <input type="checkbox" checked={e.paid}
                      onChange={() => setExpenses(p => p.map(x => x.id === e.id ? { ...x, paid: !x.paid } : x))}
                      style={{ width: 16, height: 16, accentColor: "#1D9E75", cursor: "pointer", flexShrink: 0 }}/>
                    <div style={{ width: 4, height: 28, borderRadius: 2, background: c, flexShrink: 0 }}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 500, textDecoration: e.paid ? "line-through" : "none" }}>{e.item}</div>
                      <select value={e.category}
                        onChange={(ev) => setExpenses(p => p.map(x => x.id === e.id ? { ...x, category: ev.target.value } : x))}
                        style={{ fontSize: "11px", opacity: 0.55, background: "none", border: "none", padding: 0, cursor: "pointer", color: "inherit", fontFamily: "inherit" }}>
                        {["Gear", "Flights", "Accommodation", "Insurance", "Vaccinations", "Tech", "Clothing", "Other"].map(cat =>
                          <option key={cat} value={cat}>{cat}</option>
                        )}
                      </select>
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>
                      {fmt(e.amount)}
                    </div>
                    <button onClick={() => setExpenses(p => p.filter(x => x.id !== e.id))} style={{
                      background: "none", border: "none", cursor: "pointer", fontSize: "16px",
                      opacity: 0.25, padding: "4px", lineHeight: 1, color: "inherit",
                    }}>{"\u00D7"}</button>
                  </div>
                );
              })}
            </div>
          </div>
        </>)}

        {expenses.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem", opacity: 0.3 }}>
            <div style={{ fontSize: "16px", fontWeight: 500, marginBottom: "4px" }}>No expenses logged yet</div>
            <div style={{ fontSize: "13px" }}>Add your flights, gear, bookings and other pre-trip costs above</div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
