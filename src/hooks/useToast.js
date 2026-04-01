import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, { type = "success", undoAction = null } = {}) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, undoAction }]);
    const delay = undoAction ? 5000 : 3500;
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), delay);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
