import { useEffect, useRef, useCallback } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, hasConfig } from "../firebase";

const DOC_ID = "shared";
const COLLECTION = "trip-tracker-data";

export function useCloudSync(allState, setters) {
  const isRemoteUpdate = useRef(false);
  const debounceRef = useRef(null);
  const ready = hasConfig && !!db;

  // Subscribe to remote changes
  useEffect(() => {
    if (!ready) return;

    const docRef = doc(db, COLLECTION, DOC_ID);
    const unsub = onSnapshot(docRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      const localTimestamp = parseInt(localStorage.getItem("trip-tracker-last-sync") || "0", 10);

      if (data._timestamp && data._timestamp > localTimestamp) {
        isRemoteUpdate.current = true;
        if (data.settings) setters.setS(data.settings);
        if (data.actuals) setters.setActuals(data.actuals);
        if (data.expenses) setters.setExpenses(data.expenses);
        if (data.tripSpends) setters.setTripSpends(data.tripSpends);
        if (data.tripConfig) setters.setTripConfig(data.tripConfig);
        if (data.rates) setters.setRates(data.rates);
        if (data.tripCurrency) setters.setTripCurrency(data.tripCurrency);
        localStorage.setItem("trip-tracker-last-sync", String(data._timestamp));
        setTimeout(() => { isRemoteUpdate.current = false; }, 100);
      }
    });

    return () => unsub();
  }, [ready, setters]);

  // Push local changes to Firestore (debounced)
  const pushToCloud = useCallback(() => {
    if (!ready || isRemoteUpdate.current) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const timestamp = Date.now();
        const docRef = doc(db, COLLECTION, DOC_ID);
        await setDoc(docRef, {
          settings: allState.settings,
          actuals: allState.actuals,
          expenses: allState.expenses,
          tripSpends: allState.tripSpends,
          tripConfig: allState.tripConfig,
          rates: allState.rates,
          tripCurrency: allState.tripCurrency,
          _timestamp: timestamp,
        });
        localStorage.setItem("trip-tracker-last-sync", String(timestamp));
      } catch (e) {
        console.warn("Cloud sync push failed:", e.message);
      }
    }, 1000);
  }, [ready, allState]);

  useEffect(() => {
    pushToCloud();
  }, [pushToCloud]);

  return { isSyncing: ready };
}
