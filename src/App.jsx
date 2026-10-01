import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { isAdult } from './utils/age';

import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import SendRequestModal from './components/layout/SendRequestModal';
import WeddingRingLogo from './components/common/WeddingRingLogo';
import CookieConsent from './components/common/CookieConsent';
import WaitlistPage from './components/prelaunch/WaitlistPage';
import { IS_PRELAUNCH_MODE, TESTER_EMAILS } from './config/prelaunch';

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
import MessagesListPage from './components/chat/MessagesListPage';
import ChatPage from './components/chat/ChatPage';
import SettingsPage from './components/settings/SettingsPage';
import SubscriptionPage from './components/subscription/SubscriptionPage';
import VisitorsPage from './components/visitors/VisitorsPage';
import FavoritesPage from './components/favorites/FavoritesPage';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivacyPage from './components/legal/PrivacyPage';
import HelpPage from './components/help/HelpPage';

// Gate component: shows landing page first, then auth when user clicks CTA
function LandingPageGate() {
  const [showAuth, setShowAuth] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [activeCity, setActiveCity] = useState(null); // 'paris' etc. or 'all'

  if (showWaitlist) {
    return (
      <WaitlistPage 
        onBack={() => setShowWaitlist(false)} 
        onTesterLogin={() => { setShowWaitlist(false); setShowAuth(true); }} 
      />
    );
  }

  if (showAuth) {
    return (
      <div style={{ animation: 'lpFadeIn 0.4s ease' }}>
        <style>{`@keyframes lpFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <AuthPage onBack={() => setShowAuth(false)} />
      </div>
    );
  }

  const handleOpenAuth = () => {
    if (IS_PRELAUNCH_MODE) {
      setShowWaitlist(true);
    } else {
      setShowAuth(true);
    }
  };

  if (activeCity === 'all') {
    return <CitiesListPage onBack={() => setActiveCity(null)} onNavCity={setActiveCity} />;
  }

  if (activeCity) {
    return (
      <CityLandingPage 
        ville={activeCity} 
        onBack={() => setActiveCity(null)}
        onSignup={handleOpenAuth}
        onNavCity={setActiveCity}
      />
    );
  }

  return <LandingPage onEnterApp={handleOpenAuth} onNavCity={setActiveCity} />;
}

function MainApp() {
  const { isAuthenticated, hasProfile, loading, userProfile, updateProfile, logout, user } = useAuth();
  const { currentView, toast, showToast } = useApp();

  const [missingBirthDate, setMissingBirthDate] = useState(false);
  const [tempBirthDate, setTempBirthDate] = useState('');

  useEffect(() => {
    if (isAuthenticated && hasProfile && userProfile && !userProfile.age && !userProfile.birthDate) {
      setMissingBirthDate(true);
    }
  }, [isAuthenticated, hasProfile, userProfile]);

  const handleMissingBirthDateSubmit = async () => {
    if (!tempBirthDate) {
      showToast("Veuillez saisir votre date de naissance.", "error");
      return;
    }

    if (!isAdult(tempBirthDate)) {
      await updateProfile({
        ...userProfile,
        birthDate: tempBirthDate,
        suspended: true,
        hidden: true
      });
      await logout();
      alert("Wétali est réservé aux personnes majeures (18 ans et plus).");
      window.location.reload();
      return;
    }

    await updateProfile({
      ...userProfile,
      birthDate: tempBirthDate,
      // Supprimer l'ancienne propriété age n'est pas strictement nécessaire en NoSQL mais on l'écrase
      age: null 
    });
    setMissingBirthDate(false);
    showToast("Date de naissance mise à jour avec succès !", "success");
  };

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
    if (IS_PRELAUNCH_MODE && user && !TESTER_EMAILS.includes(user.email)) {
      return (
        <WaitlistPage 
          isBlockedTester={true} 
          logout={async () => { await logout(); window.location.reload(); }} 
        />
      );
    }

    return (
      <div className="min-h-screen bg-[#F4F7F6]">
        <Header />
        <ProfileCreation />
      </div>
    );
  }

  // (La logique de blocage total de l'abonnement a été retirée pour passer au modèle Freemium)

  // 4. Authentifié avec Profil ET Abonnement -> Afficher vue active + navigation
  return (
    <div className="min-h-screen bg-[#F4F7F6] text-slate-800 font-sans flex flex-col">
      {missingBirthDate && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h2 className="text-xl font-bold text-[#0A2F4A] mb-3">Mise à jour importante</h2>
            <p className="text-sm text-slate-600 mb-5">
              Wétali est strictement réservé aux personnes majeures. Veuillez confirmer votre date de naissance.
            </p>
            <input 
              type="date"
              value={tempBirthDate}
              onChange={(e) => setTempBirthDate(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 mb-4 focus:border-[#D4AF37] outline-none"
            />
            <button 
              onClick={handleMissingBirthDateSubmit}
              className="w-full py-3 bg-[#0A2F4A] text-[#D4AF37] rounded-xl font-bold shadow-md"
            >
              Confirmer
            </button>
          </div>
        </div>
      )}

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
        {currentView === 'messages' && <MessagesListPage />}
        {currentView === 'chat' && <ChatPage />}
        {currentView === 'settings' && <SettingsPage />}
        {currentView === 'visitors' && <VisitorsPage />}
        {currentView === 'favorites' && <FavoritesPage />}
        {currentView === 'subscription' && <SubscriptionPage />}
        {currentView === 'profile-create' && <ProfileCreation />}
        {currentView === 'help' && <HelpPage />}
      </main>

      {/* Modals & Bottom Navigation */}
      <SendRequestModal />
      <BottomNav />
    </div>
  );
}

export default function App() {
  const isAdminPage = window.location.pathname.startsWith('/admin');
  const [showPrivacy, setShowPrivacy] = useState(window.location.pathname === '/privacy');
  
  useEffect(() => {
    const handleShowPrivacy = () => setShowPrivacy(true);
    window.addEventListener('show-privacy', handleShowPrivacy);
    return () => window.removeEventListener('show-privacy', handleShowPrivacy);
  }, []);

  if (showPrivacy) {
    return <PrivacyPage onBack={() => {
      setShowPrivacy(false);
      if (window.location.pathname === '/privacy') {
        window.history.pushState({}, '', '/');
      }
    }} />;
  }

  if (isAdminPage) {
    return (
      <AuthProvider>
        <AppProvider>
          <AdminDashboard />
          <CookieConsent />
        </AppProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AppProvider>
        <MainApp />
        <CookieConsent />
      </AppProvider>
    </AuthProvider>
  );
}
