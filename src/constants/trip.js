export const TRIP_CATEGORIES = [
  "Accommodation",
  "Food & Drink",
  "Transport",
  "Activities",
  "Shopping",
  "Health",
  "Other",
];

export const TRIP_CATEGORY_COLORS = {
  "Accommodation": "#378ADD",
  "Food & Drink": "#1D9E75",
  "Transport": "#7F77DD",
  "Activities": "#EF9F27",
  "Shopping": "#D4537E",
  "Health": "#D85A30",
  "Other": "#888780",
};

export const CURRENCIES = [
  { code: "MXN", symbol: "MX$", name: "Mexican Peso" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GTQ", symbol: "Q", name: "Guatemalan Quetzal" },
  { code: "BZD", symbol: "BZ$", name: "Belize Dollar" },
  { code: "HNL", symbol: "L", name: "Honduran Lempira" },
  { code: "NIO", symbol: "C$", name: "Nicaraguan Córdoba" },
  { code: "CRC", symbol: "\u20A1", name: "Costa Rican Colón" },
  { code: "PAB", symbol: "B/.", name: "Panamanian Balboa" },
  { code: "COP", symbol: "COL$", name: "Colombian Peso" },
  { code: "PEN", symbol: "S/.", name: "Peruvian Sol" },
  { code: "BOB", symbol: "Bs.", name: "Bolivian Boliviano" },
  { code: "CLP", symbol: "CL$", name: "Chilean Peso" },
  { code: "ARS", symbol: "AR$", name: "Argentine Peso" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "GBP", symbol: "\u00A3", name: "British Pound" },
];

export const DEFAULT_RATES = {
  MXN: 0.042,
  USD: 0.79,
  GTQ: 0.10,
  BZD: 0.39,
  HNL: 0.031,
  NIO: 0.021,
  CRC: 0.0015,
  PAB: 0.79,
  COP: 0.00019,
  PEN: 0.21,
  BOB: 0.11,
  CLP: 0.00082,
  ARS: 0.00066,
  BRL: 0.14,
  GBP: 1,
};

export const TRIP_DEFAULTS = {
  dailyBudget: 50,
  totalBudget: 0,
  startDate: "2026-06-08",
  routeName: "Mexico \u2192 Patagonia",
};
