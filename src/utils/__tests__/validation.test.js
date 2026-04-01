import { describe, it, expect } from 'vitest';
import { clampPositive, clampPercent, parseFinancialInput, safeRate } from '../validation';

describe('clampPositive', () => {
  it('passes through positive values', () => {
    expect(clampPositive(100)).toBe(100);
  });

  it('clamps negative to zero', () => {
    expect(clampPositive(-50)).toBe(0);
  });

  it('handles NaN/undefined as zero', () => {
    expect(clampPositive(NaN)).toBe(0);
    expect(clampPositive(undefined)).toBe(0);
    expect(clampPositive(null)).toBe(0);
  });

  it('passes through zero', () => {
    expect(clampPositive(0)).toBe(0);
  });
});

describe('clampPercent', () => {
  it('passes through valid percentages', () => {
    expect(clampPercent(50)).toBe(50);
  });

  it('clamps above 100 to 100', () => {
    expect(clampPercent(150)).toBe(100);
  });

  it('clamps negative to zero', () => {
    expect(clampPercent(-10)).toBe(0);
  });

  it('handles boundary values', () => {
    expect(clampPercent(0)).toBe(0);
    expect(clampPercent(100)).toBe(100);
  });

  it('handles NaN as zero', () => {
    expect(clampPercent(NaN)).toBe(0);
  });
});

describe('parseFinancialInput', () => {
  it('parses valid number strings', () => {
    expect(parseFinancialInput('123.45')).toBe(123.45);
  });

  it('clamps negative values to zero', () => {
    expect(parseFinancialInput('-50')).toBe(0);
  });

  it('returns zero for non-numeric input', () => {
    expect(parseFinancialInput('abc')).toBe(0);
    expect(parseFinancialInput('')).toBe(0);
  });

  it('handles zero', () => {
    expect(parseFinancialInput('0')).toBe(0);
  });
});

describe('safeRate', () => {
  it('returns the rate when valid', () => {
    expect(safeRate({ MXN: 0.045 }, 'MXN')).toBe(0.045);
  });

  it('returns 1 when rate is zero', () => {
    expect(safeRate({ MXN: 0 }, 'MXN')).toBe(1);
  });

  it('returns 1 when currency is missing', () => {
    expect(safeRate({}, 'MXN')).toBe(1);
  });

  it('returns 1 when rate is negative', () => {
    expect(safeRate({ MXN: -0.5 }, 'MXN')).toBe(1);
  });
});
