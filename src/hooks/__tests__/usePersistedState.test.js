import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersistedState } from '../usePersistedState';

describe('usePersistedState', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it('returns default value when nothing in storage', () => {
    const { result } = renderHook(() => usePersistedState('test-key', 42));
    expect(result.current[0]).toBe(42);
  });

  it('loads stored value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify(99));
    const { result } = renderHook(() => usePersistedState('test-key', 42));
    expect(result.current[0]).toBe(99);
  });

  it('saves state changes to localStorage after debounce', () => {
    const { result } = renderHook(() => usePersistedState('test-key', 42));

    act(() => {
      result.current[1](100);
    });

    // Before debounce fires
    expect(localStorage.getItem('test-key')).toBeNull();

    // After debounce
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(JSON.parse(localStorage.getItem('test-key'))).toBe(100);
  });

  it('falls back to default for corrupt JSON', () => {
    localStorage.setItem('test-key', 'not valid json{{{');
    const { result } = renderHook(() => usePersistedState('test-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('works with objects', () => {
    const defaultVal = { a: 1, b: 2 };
    const { result } = renderHook(() => usePersistedState('test-key', defaultVal));
    expect(result.current[0]).toEqual({ a: 1, b: 2 });

    act(() => {
      result.current[1]({ a: 10, b: 20 });
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(JSON.parse(localStorage.getItem('test-key'))).toEqual({ a: 10, b: 20 });
  });
});
