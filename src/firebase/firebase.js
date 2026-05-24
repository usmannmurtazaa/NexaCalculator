import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Safe config reading
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Only initialize if essential config is present
const requiredFields = ['projectId', 'apiKey', 'appId'];
const isConfigValid = requiredFields.every(
  (field) => firebaseConfig[field] && firebaseConfig[field].length > 0
);

let app;
let analytics = null;
let firestore = null;

if (typeof window !== 'undefined' && isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    firestore = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    // Leave analytics & firestore as null
  }
}

export { analytics, firestore };
export default app;