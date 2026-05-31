import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// ── Firebase configuration from Vite environment ──────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ── Validate required fields ──────────────────────────────────────
const requiredFields = ['projectId', 'apiKey', 'appId'];
const isConfigValid = requiredFields.every(
  (field) =>
    firebaseConfig[field] &&
    typeof firebaseConfig[field] === 'string' &&
    firebaseConfig[field].trim().length > 0
);

// ── State ─────────────────────────────────────────────────────────
let app = null;
let analytics = null;
let firestore = null;

// ── Initialization (only in browser environment) ──────────────────
if (typeof window !== 'undefined' && isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    firestore = getFirestore(app);
  } catch (error) {
    // Non‑fatal: Firebase is optional for core features
    if (import.meta.env.DEV) {
      console.warn('Firebase initialization failed:', error.message);
    }
    // Ensure they stay null
    app = null;
    analytics = null;
    firestore = null;
  }
} else if (typeof window !== 'undefined') {
  // Only warn in development
  if (import.meta.env.DEV) {
    console.warn('Firebase configuration is incomplete. Analytics and exports are disabled.');
  }
}

// ── Helper ─────────────────────────────────────────────────────────
export function isFirebaseReady() {
  return !!(app && analytics && firestore);
}

// ── Exports ────────────────────────────────────────────────────────
export { analytics, firestore };
export default app;