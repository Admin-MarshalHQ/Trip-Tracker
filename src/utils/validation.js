export function clampPositive(value) {
  return Math.max(0, value || 0);
}

export function clampPercent(value) {
  return Math.min(100, Math.max(0, value || 0));
}

export function parseFinancialInput(raw) {
  const n = parseFloat(raw);
  return isNaN(n) ? 0 : Math.max(0, n);
}

export function safeRate(rates, currency) {
  const rate = rates[currency];
  return rate && rate > 0 ? rate : 1;
}
