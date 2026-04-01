import { useState, useEffect, useRef } from "react";

export function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const timeoutRef = useRef(null);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (e) {
        console.warn(`localStorage write failed for "${key}":`, e.message);
      }
    }, 300);
    return () => clearTimeout(timeoutRef.current);
  }, [key, state]);

  return [state, setState];
}
