import { useEffect, useRef, useCallback } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, hasConfig } from "../firebase";

const DOC_ID = "shared";
const COLLECTION = "trip-tracker-data";

export function useCloudSync(allState, setters) {
  const isRemoteUpdate = useRef(false);
  const hasReceivedFirst = useRef(false);
  const debounceRef = useRef(null);
  const ready = hasConfig && !!db;

  // Subscribe to remote changes
  useEffect(() => {
    if (!ready) return;

    const docRef = doc(db, COLLECTION, DOC_ID);
    const unsub = onSnapshot(docRef, (snap) => {
      hasReceivedFirst.current = true;

      if (!snap.exists()) return;
      const data = snap.data();

      // Always apply remote data (skip if we just pushed it ourselves)
      if (isRemoteUpdate.current) return;

      isRemoteUpdate.current = true;
      if (data.settings) setters.setS(data.settings);
      if (data.actuals) setters.setActuals(data.actuals);
      if (data.expenses) setters.setExpenses(data.expenses);
      if (data.tripSpends) setters.setTripSpends(data.tripSpends);
      if (data.tripConfig) setters.setTripConfig(data.tripConfig);
      if (data.rates) setters.setRates(data.rates);
      if (data.tripCurrency) setters.setTripCurrency(data.tripCurrency);
      setTimeout(() => { isRemoteUpdate.current = false; }, 200);
    });

    return () => unsub();
  }, [ready, setters]);

  // Push local changes to Firestore (debounced)
  // Only push after we've received the first snapshot to avoid overwriting remote data on load
  const pushToCloud = useCallback(() => {
    if (!ready || isRemoteUpdate.current || !hasReceivedFirst.current) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (isRemoteUpdate.current) return;
      try {
        isRemoteUpdate.current = true;
        const docRef = doc(db, COLLECTION, DOC_ID);
        await setDoc(docRef, {
          settings: allState.settings,
          actuals: allState.actuals,
          expenses: allState.expenses,
          tripSpends: allState.tripSpends,
          tripConfig: allState.tripConfig,
          rates: allState.rates,
          tripCurrency: allState.tripCurrency,
          _timestamp: Date.now(),
        });
        setTimeout(() => { isRemoteUpdate.current = false; }, 200);
      } catch (e) {
        isRemoteUpdate.current = false;
        console.warn("Cloud sync push failed:", e.message);
      }
    }, 1500);
  }, [ready, allState]);

  useEffect(() => {
    pushToCloud();
  }, [pushToCloud]);

  return { isSyncing: ready };
}
