import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics (only in production)
export const analytics = typeof window !== 'undefined' && import.meta.env.PROD 
  ? getAnalytics(app) 
  : null;

// Connect to emulators in development
if (import.meta.env.DEV) {
  // Firestore emulator
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (e) {
    console.warn('Firestore emulator connection failed:', e);
  }

  // Auth emulator
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch (e) {
    console.warn('Auth emulator connection failed:', e);
  }

  // Storage emulator
  try {
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (e) {
    console.warn('Storage emulator connection failed:', e);
  }
}

export default app;
