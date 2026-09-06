// Firebase Configuration & Service Initializer
// Supporte à la fois les identifiants en direct et la persistance locale transparente

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDemoKeyWetaliMatrimonial2026",
  authDomain: "wetali-matrimonial.firebaseapp.com",
  projectId: "wetali-matrimonial",
  storageBucket: "wetali-matrimonial.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

export function getStoredFirebaseConfig() {
  try {
    const saved = localStorage.getItem('wetali_firebase_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Could not read stored Firebase config", e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveStoredFirebaseConfig(config) {
  try {
    localStorage.setItem('wetali_firebase_config', JSON.stringify(config));
    return true;
  } catch (e) {
    console.error("Could not save Firebase config", e);
    return false;
  }
}

// État de connexion Firebase
export const firebaseState = {
  isConfigured: false,
  isLive: false,
  app: null,
  auth: null,
  db: null,
  storage: null
};

// Initialisation conditionnelle
export async function initializeFirebaseApp() {
  const config = getStoredFirebaseConfig();
  
  // Vérifie si des clés réelles sont fournies ou si on tourne en mode hybride
  const isCustomKey = config.apiKey && !config.apiKey.includes("DemoKey");
  
  if (typeof window !== 'undefined' && window.firebaseAppInstance) {
    return window.firebaseAppInstance;
  }

  try {
    // Si Firebase SDK est chargé globalement via CDN (ex: ESM ou bundle)
    if (window.firebase && window.firebase.initializeApp) {
      const app = window.firebase.initializeApp(config);
      firebaseState.app = app;
      firebaseState.auth = window.firebase.auth ? window.firebase.auth() : null;
      firebaseState.db = window.firebase.firestore ? window.firebase.firestore() : null;
      firebaseState.storage = window.firebase.storage ? window.firebase.storage() : null;
      firebaseState.isConfigured = isCustomKey;
      firebaseState.isLive = isCustomKey;
      return firebaseState;
    }
  } catch (err) {
    console.info("Running in Hybrid Realtime / LocalStorage Engine", err.message);
  }

  firebaseState.isConfigured = isCustomKey;
  return firebaseState;
}
