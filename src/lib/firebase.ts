import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0410430340",
  appId: "1:66802565175:web:dec666d19b5a1c50dbffb2",
  apiKey: "AIzaSyBM3o8l0gtNAxeIsoKAiOIrUqjjd8O8azg",
  authDomain: "gen-lang-client-0410430340.firebaseapp.com",
  storageBucket: "gen-lang-client-0410430340.firebasestorage.app",
  messagingSenderId: "66802565175",
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
