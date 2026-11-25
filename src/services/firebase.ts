import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBJ3fr-R5lhhKXof8eprxNVovoRB95qriw',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'komisi-pemuda-gkii-btpp.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'komisi-pemuda-gkii-btpp',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'komisi-pemuda-gkii-btpp.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '348674839100',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:348674839100:web:492f042c4a1d77ce1fa939',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XW7JPN718D',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});
