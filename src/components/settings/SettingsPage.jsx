import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getStoredFirebaseConfig, saveStoredFirebaseConfig } from '../../services/firebase';
import ProfileCreation from '../profile/ProfileCreation';
import { 
  User, 
  Settings as SettingsIcon, 
  LogOut, 
  Trash2, 
  Database, 
  Check, 
  ShieldCheck, 
  Edit3, 
  Key, 
  Server, 
  Sparkles,
  MapPin,
  Briefcase
} from 'lucide-react';

export default function SettingsPage() {
  const { user, userProfile, logout } = useAuth();
  const { showToast, setCurrentView } = useApp();

  const [activeSection, setActiveSection] = useState('profile'); // 'profile' | 'firebase'
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState(getStoredFirebaseConfig());
  const [savingConfig, setSavingConfig] = useState(false);

  const handleLogout = async () => {
    await logout();
    showToast("Vous avez été déconnecté.", "info");
    setCurrentView('home');
  };

  const handleSaveFirebaseConfig = (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      saveStoredFirebaseConfig(firebaseConfig);
      showToast("Configuration Firebase enregistrée avec succès !", "success");
    } catch (e) {
      showToast("Erreur d'enregistrement de la configuration.", "error");
    } finally {
      setSavingConfig(false);
    }
  };

  const handleResetData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser vos données locales de démonstration ?")) {
      localStorage.clear();
      showToast("Données réinitialisées.", "info");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0A2F4A] flex items-center gap-2">
            <SettingsIcon className="w-7 h-7 text-[#2D8659]" />
            <span>Paramètres & Profil</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez votre compte Wétali, vos informations personnelles et votre configuration cloud.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex bg-[#F0F4F2] p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveSection('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'profile'
                ? 'bg-white text-[#2D8659] shadow-sm'
                : 'text-slate-600 hover:text-[#0A2F4A]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Mon Profil</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('firebase')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'firebase'
                ? 'bg-white text-[#0A2F4A] shadow-sm'
                : 'text-slate-600 hover:text-[#0A2F4A]'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Firebase Cloud</span>
          </button>
        </div>
      </div>

      {activeSection === 'profile' ? (
        /* ========================================== */
        /* SECTION MON PROFIL                         */
        /* ========================================== */
        isEditingProfile ? (
          <div className="space-y-4">
            <button
              onClick={() => setIsEditingProfile(false)}
              className="text-xs font-bold text-[#0A2F4A] hover:underline"
            >
              ← Annuler l'édition
            </button>
            <ProfileCreation isEditing={true} onComplete={() => setIsEditingProfile(false)} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Overview Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img
                  src={userProfile?.photos && userProfile.photos[0] ? userProfile.photos[0] : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"}
                  alt={userProfile?.prenom || "Profil"}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-slate-100 shadow-md"
                />

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="font-serif font-bold text-2xl text-[#0A2F4A]">
                      {userProfile?.prenom || "Membre Wétali"}, {userProfile?.age || 28} ans
                    </h2>
                    <span className="inline-flex items-center gap-1 bg-[#EAF5EF] text-[#2D8659] text-xs font-bold px-3 py-1 rounded-full self-center sm:self-auto">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Profil Vérifié</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-[#2D8659]">
                      <MapPin className="w-3.5 h-3.5" />
                      {userProfile?.ville || "Paris"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {userProfile?.profession || "Profession non renseignée"}
                    </span>
                  </div>

                  {userProfile?.bio && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 italic">
                      "{userProfile.bio}"
                    </p>
                  )}
                </div>
              </div>

              {/* Attributes Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-2xl text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Dahira</div>
                  <div className="text-xs font-bold text-[#0A2F4A] mt-0.5">{userProfile?.dahira || "Touba Mouride"}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Vision Mariage</div>
                  <div className="text-xs font-bold text-[#0A2F4A] mt-0.5">{userProfile?.visionMariageLabel || "Court terme (< 6 mois)"}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Photos</div>
                  <div className="text-xs font-bold text-[#0A2F4A] mt-0.5">{userProfile?.photos?.length || 1} photo(s)</div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditingProfile(true)}
                className="w-full py-3 rounded-2xl bg-[#0A2F4A] hover:bg-[#061C2C] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Modifier mon profil complet</span>
              </button>

            </div>

            {/* Account Danger Zone / Actions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-[#0A2F4A]">Options de Compte</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-slate-500" />
                  <span>Se Déconnecter</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetData}
                  className="py-3 px-4 rounded-2xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>Réinitialiser les données démo</span>
                </button>
              </div>
            </div>
          </div>
        )
      ) : (
        /* ========================================== */
        /* SECTION FIREBASE CONFIGURATION             */
        /* ========================================== */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5EF] text-[#2D8659] text-xs font-bold">
              <Database className="w-3.5 h-3.5" />
              <span>Firebase Cloud Integration</span>
            </div>
            <h2 className="font-serif font-bold text-xl text-[#0A2F4A]">
              Branchez votre propre projet Firebase (Optionnel)
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              L'application fonctionne immédiatement en mode temps réel hybride. Pour synchroniser avec votre propre console Firebase (Firestore, Auth, Storage), collez vos identifiants ci-dessous.
            </p>
          </div>

          <form onSubmit={handleSaveFirebaseConfig} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1">
                API Key
              </label>
              <input
                type="text"
                value={firebaseConfig.apiKey || ''}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:border-[#2D8659] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1">
                  Auth Domain
                </label>
                <input
                  type="text"
                  value={firebaseConfig.authDomain || ''}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value })}
                  placeholder="votre-projet.firebaseapp.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:border-[#2D8659] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  value={firebaseConfig.projectId || ''}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })}
                  placeholder="votre-projet-id"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:border-[#2D8659] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1">
                  Storage Bucket
                </label>
                <input
                  type="text"
                  value={firebaseConfig.storageBucket || ''}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, storageBucket: e.target.value })}
                  placeholder="votre-projet.appspot.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:border-[#2D8659] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1">
                  App ID
                </label>
                <input
                  type="text"
                  value={firebaseConfig.appId || ''}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, appId: e.target.value })}
                  placeholder="1:123456:web:abcdef"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:border-[#2D8659] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingConfig}
              className="w-full py-3.5 rounded-2xl bg-[#2D8659] hover:bg-[#236c47] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{savingConfig ? "Enregistrement..." : "Sauvegarder les clés Firebase"}</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
