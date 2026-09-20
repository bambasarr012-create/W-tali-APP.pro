import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';

import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import SendRequestModal from './components/layout/SendRequestModal';
import WeddingRingLogo from './components/common/WeddingRingLogo';

import AuthPage from './components/auth/AuthPage';
import LandingPage from './components/landing/LandingPage';
import CityLandingPage from './components/landing/CityLandingPage';
import CitiesListPage from './components/landing/CitiesListPage';
import ProfileCreation from './components/profile/ProfileCreation';
import HomePage from './components/home/HomePage';
import DiscoverPage from './components/discover/DiscoverPage';
import ProfileDetailPage from './components/profile/ProfileDetailPage';
import RequestsPage from './components/requests/RequestsPage';
import MatchesPage from './components/matches/MatchesPage';
import ChatPage from './components/chat/ChatPage';
import SettingsPage from './components/settings/SettingsPage';
import SubscriptionPage from './components/subscription/SubscriptionPage';
import VisitorsPage from './components/visitors/VisitorsPage';
import FavoritesPage from './components/favorites/FavoritesPage';

// Gate component: shows landing page first, then auth when user clicks CTA
function LandingPageGate() {
  const [showAuth, setShowAuth] = useState(false);
  const [activeCity, setActiveCity] = useState(null); // 'paris' etc. or 'all'

  if (showAuth) {
    return (
      <div style={{ animation: 'lpFadeIn 0.4s ease' }}>
        <style>{`@keyframes lpFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <AuthPage onBack={() => setShowAuth(false)} />
      </div>
    );
  }

  if (activeCity === 'all') {
    return <CitiesListPage onBack={() => setActiveCity(null)} onNavCity={setActiveCity} />;
  }

  if (activeCity) {
    return (
      <CityLandingPage 
        ville={activeCity} 
        onBack={() => setActiveCity(null)}
        onSignup={() => setShowAuth(true)}
        onNavCity={setActiveCity}
      />
    );
  }

  return <LandingPage onEnterApp={() => setShowAuth(true)} onNavCity={setActiveCity} />;
}

function MainApp() {
  const { isAuthenticated, hasProfile, loading, userProfile } = useAuth();
  const { currentView, toast } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A2F4A] flex flex-col items-center justify-center text-white space-y-4">
        <div className="animate-pulse">
          <WeddingRingLogo size="xl" />
        </div>
        <p className="font-mono text-xs text-[#A0C0D6] uppercase tracking-widest">
          Chargement de Wétali...
        </p>
      </div>
    );
  }

  // 1. Non authentifié -> Afficher Landing Page puis Auth Page
  if (!isAuthenticated) {
    return <LandingPageGate />;
  }

  // 2. Authentifié mais profil non complété -> Afficher Création de Profil
  if (!hasProfile && currentView !== 'profile-create') {
    return (
      <div className="min-h-screen bg-[#F4F7F6]">
        <Header />
        <ProfileCreation />
      </div>
    );
  }

  // 3. Authentifié avec Profil mais PAS d'abonnement actif -> Bloquer sur Abonnement
  const hasActiveSubscription = userProfile?.subscriptionStatus === 'active';
  
  if (hasProfile && !hasActiveSubscription) {
    // Si la personne clique sur Paramètres depuis le header on peut la laisser y accéder pour se déconnecter
    if (currentView === 'settings') {
      return (
        <div className="min-h-screen bg-[#F4F7F6] text-slate-800 font-sans flex flex-col">
          <Header />
          <main className="flex-1">
            <SettingsPage />
          </main>
          <BottomNav />
        </div>
      );
    }
    
    // Sinon elle est bloquée sur l'abonnement
    return (
      <div className="min-h-screen bg-[#F4F7F6] text-slate-800 font-sans flex flex-col">
        <Header />
        <main className="flex-1">
          <SubscriptionPage />
        </main>
        <BottomNav />
      </div>
    );
  }

  // 4. Authentifié avec Profil ET Abonnement -> Afficher vue active + navigation
  return (
    <div className="min-h-screen bg-[#F4F7F6] text-slate-800 font-sans flex flex-col">
      <Header />

      {/* Global Toast Alert Notification */}
      {toast && (
        <div className="fixed top-16 inset-x-4 sm:inset-x-auto sm:right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white border-rose-700'
              : toast.type === 'info'
              ? 'bg-[#0A2F4A] text-white border-[#134B73]'
              : 'bg-[#2D8659] text-white border-[#236c47]'
          }`}>
            <span>{toast.type === 'error' ? '⚠️' : '✓'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Dynamic View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'discover' && <DiscoverPage />}
        {currentView === 'profile-detail' && <ProfileDetailPage />}
        {currentView === 'requests' && <RequestsPage />}
        {currentView === 'matches' && <MatchesPage />}
        {currentView === 'chat' && <ChatPage />}
        {currentView === 'settings' && <SettingsPage />}
        {currentView === 'visitors' && <VisitorsPage />}
        {currentView === 'favorites' && <FavoritesPage />}
        {currentView === 'profile-create' && <ProfileCreation />}
      </main>

      {/* Modals & Bottom Navigation */}
      <SendRequestModal />
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </AuthProvider>
  );
}
