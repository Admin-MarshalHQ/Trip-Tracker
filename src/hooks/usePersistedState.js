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
      localStorage.setItem(key, JSON.stringify(state));
    }, 300);
    return () => clearTimeout(timeoutRef.current);
  }, [key, state]);

  return [state, setState];
}
