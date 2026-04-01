import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace these with your Firebase project config
// Go to https://console.firebase.google.com → Create project → Web app → Copy config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

const hasConfig = firebaseConfig.projectId && firebaseConfig.apiKey;

let app = null;
let db = null;

if (hasConfig) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export { db, hasConfig };
