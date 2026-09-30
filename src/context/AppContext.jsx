import React, { createContext, useContext, useState, useEffect } from 'react';
import { getReceivedRequests, getMatches, subscribeToUserReceivedRequests, subscribeToUserMatches } from '../services/firestoreService';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { userProfile, isAuthenticated } = useAuth();
  
  // Navigation State
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'matches' | 'requests' | 'chat' | 'settings' | 'profile-create' | 'profile-detail'
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [activeMatch, setActiveMatch] = useState(null);
  
  // Counts & Badges
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);

  // Request Modal State
  const [requestModalState, setRequestModalState] = useState({
    isOpen: false,
    targetProfile: null
  });

  // Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const refreshCounts = async () => {
    try {
      const reqs = await getReceivedRequests(userProfile?.id);
      setPendingRequestsCount(reqs.length);
      const matches = await getMatches(userProfile?.id);
      setMatchesCount(matches.length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !userProfile?.id) return;

    refreshCounts();
    const unsubReqs = subscribeToUserReceivedRequests(userProfile.id, refreshCounts);
    const unsubMatches = subscribeToUserMatches(userProfile.id, refreshCounts);

    return () => {
      unsubReqs();
      unsubMatches();
    };
  }, [userProfile, isAuthenticated]);

  // Navigate to profile details
  const viewProfileDetail = (profile) => {
    setSelectedProfile(profile);
    setCurrentView('profile-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Chat directly
  const openChatWithMatch = (match) => {
    setActiveMatch(match);
    setCurrentView('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Request Modal
  const openSendRequestModal = (profile) => {
    setRequestModalState({
      isOpen: true,
      targetProfile: profile
    });
  };

  const closeSendRequestModal = () => {
    setRequestModalState({
      isOpen: false,
      targetProfile: null
    });
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      selectedProfile,
      setSelectedProfile,
      viewProfileDetail,
      activeMatch,
      setActiveMatch,
      openChatWithMatch,
      pendingRequestsCount,
      matchesCount,
      requestModalState,
      openSendRequestModal,
      closeSendRequestModal,
      toast,
      showToast,
      refreshCounts
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
