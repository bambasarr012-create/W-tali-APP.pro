import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredAuthUser, signupUser, loginUser, logoutUser } from '../services/authService';
import { getCurrentStoredProfile, saveUserProfile } from '../services/firestoreService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialisation session
    const authUser = getStoredAuthUser();
    const profile = getCurrentStoredProfile();

    if (authUser) {
      setUser(authUser);
    }
    if (profile) {
      setUserProfile(profile);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const authUser = await loginUser(email, password);
    setUser(authUser);
    const profile = getCurrentStoredProfile();
    if (profile) {
      setUserProfile(profile);
    }
    return authUser;
  };

  const signup = async (email, password) => {
    const authUser = await signupUser(email, password);
    setUser(authUser);
    return authUser;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setUserProfile(null);
  };

  const updateProfile = async (profileData) => {
    const saved = await saveUserProfile(profileData);
    setUserProfile(saved);
    if (user) {
      const updatedUser = { ...user, hasCompletedProfile: true };
      setUser(updatedUser);
      localStorage.setItem('wetali_auth_user', JSON.stringify(updatedUser));
    }
    return saved;
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      login,
      signup,
      logout,
      updateProfile,
      isAuthenticated: !!user,
      hasProfile: !!userProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
