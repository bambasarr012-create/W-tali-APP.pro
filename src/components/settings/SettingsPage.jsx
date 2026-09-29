import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import ProfileCreation from '../profile/ProfileCreation';
import { 
  Camera, 
  User, 
  MapPin, 
  Heart, 
  Smile, 
  BookOpen, 
  Target, 
  Star, 
  Eye, 
  Bell, 
  Shield, 
  Trash2,
  ChevronRight,
  CheckCircle2,
  LogOut,
  ArrowLeft,
  Volume2,
  EyeOff
} from 'lucide-react';

const ADMIN_EMAILS = ['bambasarr012@gmail.com', 'wetalidiaspora@gmail.com'];

export default function SettingsPage() {
  const { user, userProfile, logout, updateProfile } = useAuth();
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);
  const { showToast, setCurrentView } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingStep, setEditingStep] = useState(1);
  const [preferences, setPreferences] = useState({
    blurPhotos: userProfile?.preferences?.blurPhotos || false,
    soundEnabled: userProfile?.preferences?.soundEnabled !== false,
  });

  const togglePreference = async (key) => {
    const newValue = !preferences[key];
    setPreferences(prev => ({ ...prev, [key]: newValue }));
    
    if (userProfile && updateProfile) {
      await updateProfile({
        ...userProfile,
        preferences: {
          ...preferences,
          [key]: newValue
        }
      });
      showToast("Préférence mise à jour", "success");
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast("Vous avez été déconnecté.", "info");
    setCurrentView('home');
  };

  const handleResetData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ou réinitialiser les données ?")) {
      localStorage.clear();
      showToast("Données réinitialisées.", "info");
      window.location.reload();
    }
  };

  if (isEditingProfile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-4">
        <button
          onClick={() => setIsEditingProfile(false)}
          className="flex items-center gap-2 text-sm font-bold text-[#0A2F4A] hover:text-[#2D8659] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux paramètres
        </button>
        <ProfileCreation isEditing={true} initialStep={editingStep} onComplete={() => setIsEditingProfile(false)} />
      </div>
    );
  }

  const settingsGroups = [
    {
      title: "Mon Profil Wétali",
      items: [
        { icon: Camera, title: "Mes Photos", subtitle: "Gérer tes photos et ton apparence publique", isComplete: !!userProfile?.photos?.length, action: () => { setEditingStep(1); setIsEditingProfile(true); } },
        { icon: User, title: "Mon Identité", subtitle: "Date de naissance, situation familiale et détails de base", isComplete: true, action: () => { setEditingStep(2); setIsEditingProfile(true); } },
        { icon: MapPin, title: "Situation actuelle", subtitle: "Où tu vis, ton métier et tes études", isComplete: !!(userProfile?.ville && userProfile?.profession), action: () => { setEditingStep(3); setIsEditingProfile(true); } },
        { icon: Heart, title: "Ma vision de l'union", subtitle: "Ce qui compte vraiment pour toi dans le mariage", isComplete: !!userProfile?.visionMariageLabel, action: () => { setEditingStep(5); setIsEditingProfile(true); } },
        { icon: BookOpen, title: "Pratique & Foi", subtitle: "Ton socle religieux et tes repères", isComplete: !!userProfile?.dahira, action: () => { setEditingStep(6); setIsEditingProfile(true); } },
        { icon: Target, title: "Ma présentation (Bio)", subtitle: "Laisse parler ton cœur et tes projets d'avenir", isComplete: !!userProfile?.bio, action: () => { setEditingStep(5); setIsEditingProfile(true); } },
      ]
    },
    {
      title: "Préférences & Sécurité",
      items: [
        { icon: Star, title: "Mon abonnement", subtitle: "Gérer ton abonnement et tes demandes", action: () => setCurrentView('subscription'), highlight: true },
        { icon: EyeOff, title: "Flouter mes photos", subtitle: "Cacher tes photos aux non-matchs", isToggle: true, toggleKey: 'blurPhotos' },
        { icon: Volume2, title: "Sons activés", subtitle: "Bruitages de notifications", isToggle: true, toggleKey: 'soundEnabled' },
        { icon: Shield, title: "Sécurité", subtitle: "Mot de passe et vérification d'identité", action: () => showToast("Bientôt disponible", "info") },
        { icon: Trash2, title: "Compte", subtitle: "Suspendre ou réinitialiser ton compte", action: handleResetData, danger: true },
      ]
    }
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-28 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-xl text-[#0A2F4A]">Paramètres</h1>
        </div>
      </div>

      {/* Progress Bar (Optional Farata Style) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EAF5EF] flex items-center justify-center">
            <User className="w-5 h-5 text-[#2D8659]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Complète ton profil</h3>
            <p className="text-[10px] text-slate-500">6 informations manquantes</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[#2D8659] font-bold text-lg">84%</span>
          <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
            <div className="w-[84%] h-full bg-[#2D8659] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="space-y-6">
        {settingsGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 mb-3">{group.title}</h2>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
              {group.items.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={item.isToggle ? () => togglePreference(item.toggleKey) : item.action}
                  className={`flex items-center p-4 transition-colors ${item.isToggle ? '' : 'cursor-pointer hover:bg-slate-50'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${item.highlight ? 'bg-orange-50' : 'bg-slate-50'}`}>
                    <item.icon className={`w-5 h-5 ${item.highlight ? 'text-orange-500' : item.danger ? 'text-rose-500' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate ${item.danger ? 'text-rose-600' : 'text-slate-800'}`}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                  </div>
                  
                  {item.isToggle ? (
                    <div className={`w-11 h-6 rounded-full flex items-center transition-colors px-1 ml-3 ${preferences[item.toggleKey] ? 'bg-[#2D8659]' : 'bg-slate-200'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${preferences[item.toggleKey] ? 'transform translate-x-5' : ''}`} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 ml-3">
                      {item.isComplete !== undefined && (
                        item.isComplete 
                          ? <CheckCircle2 className="w-5 h-5 text-[#2D8659]" />
                          : <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {isAdmin && (
          <div className="bg-[#0A2F4A] rounded-3xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-[#062033] transition-colors" onClick={() => window.location.href = '/admin'}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#134B73] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Administration</h4>
                <p className="text-[11px] text-[#A0C0D6]">Gérer la plateforme Wétali</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#1E5680]" />
          </div>
        )}

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm text-rose-600 font-bold text-sm hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>

      </div>
    </div>
  );
}
