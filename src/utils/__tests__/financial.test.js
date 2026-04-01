import { describe, it, expect } from 'vitest';
import { estimateNetBonus, estimateOneWeekNet, fmt } from '../financial';

describe('estimateNetBonus', () => {
  it('calculates net bonus for known inputs', () => {
    const result = estimateNetBonus(37662, 15);
    // gross = 37662 * 0.15 = 5649.3
    // pension = 5649.3 * 0.02 = 112.986
    // tax = (5649.3 - 112.986) * 0.20 = 1107.2628
    // nic = (5649.3 - 112.986) * 0.08 = 442.90512
    // studentLoan = 5649.3 * 0.09 = 508.437
    // net = 5649.3 - 112.986 - 1107.2628 - 442.90512 - 508.437 = 3477.7091
    expect(result).toBeCloseTo(3477.71, 0);
  });

  it('returns 0 for zero bonus percentage', () => {
    expect(estimateNetBonus(37662, 0)).toBe(0);
  });

  it('handles very small salary', () => {
    const result = estimateNetBonus(1000, 10);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(100);
  });

  it('scales linearly with bonus percentage', () => {
    const at10 = estimateNetBonus(37662, 10);
    const at20 = estimateNetBonus(37662, 20);
    expect(at20).toBeCloseTo(at10 * 2, 2);
  });
});

describe('estimateOneWeekNet', () => {
  it('calculates one week net pay for known salary', () => {
    const result = estimateOneWeekNet(37662);
    // gross = 37662 / 12 / 4.33 ≈ 724.75
    // Should be a reasonable weekly net (positive, less than gross)
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(37662 / 12 / 4.33); // less than gross
  });

  it('returns positive for typical salaries', () => {
    expect(estimateOneWeekNet(25000)).toBeGreaterThan(0);
    expect(estimateOneWeekNet(50000)).toBeGreaterThan(0);
  });

  it('student loan is zero when below threshold', () => {
    // Threshold is 27295/year, so monthly threshold ≈ 2274.58
    // Weekly threshold ≈ 525.31
    // A salary of 10000 gives weekly gross ≈ 192.49 (below threshold)
    const low = estimateOneWeekNet(10000);
    // Manual calc without student loan
    const gross = 10000 / 12 / 4.33;
    const p = gross * 0.02;
    const t = (gross - p) * 0.20;
    const n = (gross - p) * 0.08;
    const expected = gross - p - t - n; // no student loan
    expect(low).toBeCloseTo(expected, 2);
  });
});

describe('fmt', () => {
  it('formats positive numbers with pound sign', () => {
    expect(fmt(1234)).toBe('\u00A31,234');
  });

  it('formats negative numbers with minus sign', () => {
    expect(fmt(-500)).toBe('\u2212\u00A3500');
  });

  it('formats zero', () => {
    expect(fmt(0)).toBe('\u00A30');
  });

  it('rounds to nearest integer', () => {
    expect(fmt(99.7)).toBe('\u00A3100');
    expect(fmt(99.4)).toBe('\u00A399');
  });

  it('handles large numbers with thousands separator', () => {
    const result = fmt(12345);
    expect(result).toContain('12');
    expect(result).toContain('345');
  });
});
