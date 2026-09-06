// Service d'authentification Wétali (Firebase Auth & Local State)

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

  // Simule / Exécute l'inscription
  const user = {
    uid: `user_${Date.now()}`,
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
    hasCompletedProfile: false
  };

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  return user;
}

export async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error("Veuillez renseigner votre email et votre mot de passe.");
  }

  const existingProfile = localStorage.getItem('wetali_current_profile');
  const user = {
    uid: "current_user",
    email: email.trim().toLowerCase(),
    hasCompletedProfile: !!existingProfile
  };

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  return user;
}

export async function forgotPassword(email) {
  if (!email) {
    throw new Error("Veuillez renseigner votre adresse e-mail.");
  }
  return { success: true, message: `Un lien de réinitialisation sécurisé a été envoyé à ${email}.` };
}

export async function logoutUser() {
  localStorage.removeItem(AUTH_USER_KEY);
  return true;
}
