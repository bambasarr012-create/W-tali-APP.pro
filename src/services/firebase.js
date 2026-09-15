// Firebase Configuration & Service Initializer
// Supporte à la fois les identifiants en direct et la persistance locale transparente

export function getStoredFirebaseConfig() {
  return {
    apiKey: import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };
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
  
  if (!config.apiKey) {
    console.warn("Firebase configuration is missing! Check your environment variables.");
  }
  
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
      firebaseState.isConfigured = !!config.apiKey;
      firebaseState.isLive = !!config.apiKey;
      return firebaseState;
    }
  } catch (err) {
    console.error("Firebase initialization error:", err);
  }

  firebaseState.isConfigured = false;
  return firebaseState;
}
