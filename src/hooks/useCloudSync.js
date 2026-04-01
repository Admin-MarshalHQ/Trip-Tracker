import { useEffect, useRef, useCallback } from "react";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db, hasConfig } from "../firebase";

const COLLECTION = "trip-tracker-data";

export function useCloudSync(syncCode, allState, setters) {
  const isRemoteUpdate = useRef(false);
  const debounceRef = useRef(null);

  // Subscribe to remote changes
  useEffect(() => {
    if (!hasConfig || !syncCode || !db) return;

    const docRef = doc(db, COLLECTION, syncCode);
    const unsub = onSnapshot(docRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      const localTimestamp = parseInt(localStorage.getItem("trip-tracker-last-sync") || "0", 10);

      // Only apply remote data if it's newer than our last write
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
        // Reset flag after a tick to allow state to settle
        setTimeout(() => { isRemoteUpdate.current = false; }, 100);
      }
    });

    return () => unsub();
  }, [syncCode, setters]);

  // Push local changes to Firestore (debounced)
  const pushToCloud = useCallback(() => {
    if (!hasConfig || !syncCode || !db || isRemoteUpdate.current) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const timestamp = Date.now();
      const docRef = doc(db, COLLECTION, syncCode);
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
    }, 1000);
  }, [syncCode, allState]);

  useEffect(() => {
    pushToCloud();
  }, [pushToCloud]);

  // Initial load from cloud when first syncing
  const loadFromCloud = useCallback(async (code) => {
    if (!hasConfig || !db) return false;
    const docRef = doc(db, COLLECTION, code);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      isRemoteUpdate.current = true;
      if (data.settings) setters.setS(data.settings);
      if (data.actuals) setters.setActuals(data.actuals);
      if (data.expenses) setters.setExpenses(data.expenses);
      if (data.tripSpends) setters.setTripSpends(data.tripSpends);
      if (data.tripConfig) setters.setTripConfig(data.tripConfig);
      if (data.rates) setters.setRates(data.rates);
      if (data.tripCurrency) setters.setTripCurrency(data.tripCurrency);
      setTimeout(() => { isRemoteUpdate.current = false; }, 100);
      return true;
    }
    return false;
  }, [setters]);

  return { loadFromCloud, isSyncing: hasConfig && !!syncCode };
}

export function generateSyncCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
