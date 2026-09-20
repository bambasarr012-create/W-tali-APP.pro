import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

export function getStoredFirebaseConfig() {
  const cleanEnv = (val) => val ? val.replace(/['"]/g, '').trim() : undefined;
  
  return {
    apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID)
  };
}

export const firebaseState = {
  isConfigured: false,
  isLive: false,
  app: null,
  auth: null,
  db: null,
  storage: null
};

export async function initializeFirebaseApp() {
  const config = getStoredFirebaseConfig();
  
  if (!config.apiKey) {
    console.warn("Firebase configuration is missing! Check your environment variables.");
    firebaseState.isConfigured = false;
    return firebaseState;
  }
  
  try {
    let app;
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    
    // Initialize App Check if ReCaptcha site key is provided
    if (import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true
      });
    }
    
    firebaseState.app = app;
    firebaseState.auth = getAuth(app);
    firebaseState.db = getFirestore(app);
    firebaseState.storage = getStorage(app);
    firebaseState.isConfigured = true;
    firebaseState.isLive = true;
    
    return firebaseState;
  } catch (err) {
    console.error("Firebase initialization error:", err);
    firebaseState.isConfigured = false;
    return firebaseState;
  }
}

