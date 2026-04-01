import {
  INCOME_TAX_RATE,
  NIC_RATE,
  STUDENT_LOAN_RATE,
  PENSION_SACRIFICE_RATE,
  STUDENT_LOAN_THRESHOLD_ANNUAL,
  WEEKS_PER_MONTH,
  MONTHS_PER_YEAR,
} from "../constants/financial";

export function estimateNetBonus(annualBasic, bonusPct) {
  const gross = annualBasic * (bonusPct / 100);
  const pension = gross * PENSION_SACRIFICE_RATE;
  const tax = (gross - pension) * INCOME_TAX_RATE;
  const nic = (gross - pension) * NIC_RATE;
  const studentLoan = gross * STUDENT_LOAN_RATE;
  return gross - pension - tax - nic - studentLoan;
}

export function estimateOneWeekNet(annualBasic) {
  const gross = annualBasic / MONTHS_PER_YEAR / WEEKS_PER_MONTH;
  const pension = gross * PENSION_SACRIFICE_RATE;
  const tax = (gross - pension) * INCOME_TAX_RATE;
  const nic = (gross - pension) * NIC_RATE;
  const slThresh = STUDENT_LOAN_THRESHOLD_ANNUAL / MONTHS_PER_YEAR;
  const studentLoan = Math.max(0, (gross - slThresh) * STUDENT_LOAN_RATE);
  return gross - pension - tax - nic - studentLoan;
}

export function fmt(n) {
  const abs = Math.abs(Math.round(n));
  return (n < 0 ? "\u2212" : "") + "\u00A3" + abs.toLocaleString("en-GB");
}
