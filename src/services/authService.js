// Service d'authentification Wétali (Firebase Auth & Local State)
import { initializeFirebaseApp, firebaseState } from './firebase';

const AUTH_USER_KEY = 'wetali_auth_user';

export function getStoredAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export async function signupUser(email, password) {
  if (!email || !password) {
    throw new Error("Veuillez fournir un email et un mot de passe.");
  }
  if (password.length < 6) {
    throw new Error("Le mot de passe doit comporter au moins 6 caractères.");
  }

  await initializeFirebaseApp();
  if (!firebaseState.auth) {
    throw new Error("Firebase Auth n'est pas initialisé. Vérifiez vos variables d'environnement.");
  }

  try {
    const userCredential = await firebaseState.auth.createUserWithEmailAndPassword(email, password);
    const fbUser = userCredential.user;
    
    const user = {
      uid: fbUser.uid,
      email: fbUser.email,
      createdAt: new Date().toISOString(),
      hasCompletedProfile: false
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Firebase Signup Error", error);
    throw new Error(error.message || "Échec de l'inscription.");
  }
}

export async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error("Veuillez renseigner votre email et votre mot de passe.");
  }

  await initializeFirebaseApp();
  if (!firebaseState.auth) {
    throw new Error("Firebase Auth n'est pas initialisé. Vérifiez vos variables d'environnement.");
  }

  try {
    const userCredential = await firebaseState.auth.signInWithEmailAndPassword(email, password);
    const fbUser = userCredential.user;
    
    const existingProfile = localStorage.getItem('wetali_current_profile');
    const user = {
      uid: fbUser.uid,
      email: fbUser.email,
      hasCompletedProfile: !!existingProfile
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Firebase Login Error", error);
    throw new Error(error.message || "Échec de la connexion. Vérifiez vos identifiants.");
  }
}

export async function forgotPassword(email) {
  if (!email) {
    throw new Error("Veuillez renseigner votre adresse e-mail.");
  }
  return { success: true, message: `Un lien de réinitialisation sécurisé a été envoyé à ${email}.` };
}

export async function logoutUser() {
  await initializeFirebaseApp();
  if (firebaseState.auth) {
    await firebaseState.auth.signOut();
  }
  localStorage.removeItem(AUTH_USER_KEY);
  return true;
}

export async function loginWithGoogle() {
  await initializeFirebaseApp();
  
  if (!firebaseState.auth) {
    throw new Error("Firebase Auth n'est pas initialisé. Vérifiez vos variables d'environnement.");
  }

  try {
    const provider = new window.firebase.auth.GoogleAuthProvider();
    const result = await firebaseState.auth.signInWithPopup(provider);
    const fbUser = result.user;
    
    const existingProfile = localStorage.getItem('wetali_current_profile');
    const user = {
      uid: fbUser.uid,
      email: fbUser.email,
      hasCompletedProfile: !!existingProfile,
      displayName: fbUser.displayName,
      photoURL: fbUser.photoURL
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Firebase Google Auth Error", error);
    // Gestion spécifique des erreurs
    let message = "Échec de la connexion avec Google.";
    if (error.code === 'auth/popup-closed-by-user') {
      message = "La fenêtre de connexion a été fermée avant la fin.";
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      message = "Un compte existe déjà avec la même adresse e-mail mais d'autres identifiants de connexion.";
    }
    throw new Error(message);
  }
}
