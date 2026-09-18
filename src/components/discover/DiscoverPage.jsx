import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getAllProfiles } from '../../services/firestoreService';
import { X, MessageCircle, Plus, Crown, MapPin, Heart, User, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';

export default function DiscoverPage() {
  const { userProfile } = useAuth();
  const { setCurrentView, showToast } = useApp();
  
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await getAllProfiles(userProfile?.id);
        setProfiles(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userProfile]);

  const currentProfile = profiles[currentIndex];

  const handleNext = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      showToast("Vous avez vu tous les profils de votre région pour le moment.", "info");
    }
  };

  const handleAdd = () => {
    showToast(`Demande envoyée à ${currentProfile.prenom} !`, "success");
    handleNext();
  };

  const handleMessage = () => {
    showToast(`Vous devez d'abord matcher avec ${currentProfile.prenom} pour envoyer un message.`, "info");
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-4 border-[#2D8659] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Recherche de profils compatibles...</p>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <div className="w-16 h-16 bg-[#F0F4F2] rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-[#2D8659]" />
        </div>
        <h2 className="text-xl font-bold text-[#0A2F4A] mb-2">Plus de profils disponibles</h2>
        <p className="text-slate-500 mb-6 max-w-sm mx-auto">
          Vous avez fait le tour de tous les profils correspondant à vos critères actuels. Revenez plus tard ou élargissez vos filtres !
        </p>
        <button 
          onClick={() => setCurrentView('home')}
          className="px-6 py-3 bg-[#2D8659] text-white font-bold rounded-xl shadow-lg hover:bg-[#236c47]"
        >
          Retour à l'Accueil
        </button>
      </div>
    );
  }

  return (
    <div className="relative max-w-md mx-auto px-4 py-6 sm:py-8 pb-32 h-[calc(100vh-64px)] flex flex-col">
      
      {/* Container principal de la carte */}
      <div className="flex-1 bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden flex flex-col relative">
        
        {/* Photo Header (Fixe en haut de la carte) */}
        <div className="relative h-[45%] shrink-0">
          <img 
            src={currentProfile.photos?.[0] || 'https://via.placeholder.com/400x500'} 
            alt={currentProfile.prenom} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Badge Premium (Optionnel) */}
          <div className="absolute top-4 left-4 bg-[#D4AF37] text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Crown className="w-3 h-3" />
            Premium
          </div>
          
          {/* Info Base */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
              {currentProfile.prenom}, {currentProfile.age}
              <CheckCircle2 className="w-5 h-5 text-[#2D8659] fill-white" />
            </h2>
            <div className="flex items-center gap-1 text-sm text-white/90 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {currentProfile.ville}, {currentProfile.pays}
            </div>
            <div className="flex items-center gap-3 mt-2 text-[11px] font-medium">
              <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                <Heart className="w-3 h-3" /> Célibataire
              </span>
              <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                <User className="w-3 h-3" /> {currentProfile.profession}
              </span>
            </div>
          </div>
        </div>

        {/* Détails Scrollables */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide bg-[#FDFDFD]">
          
          {/* Vision du Mariage */}
          {currentProfile.bio && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-[#2D8659] uppercase tracking-widest flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" /> Ma vision du mariage
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {currentProfile.bio}
              </p>
            </div>
          )}

          {/* Ce que je recherche */}
          {currentProfile.recherche && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-[#2D8659] uppercase tracking-widest flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" /> Ce que je recherche
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {currentProfile.recherche}
              </p>
            </div>
          )}

          {/* Centres d'intérêt */}
          {currentProfile.interets && currentProfile.interets.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-[#2D8659] uppercase tracking-widest flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" /> Centres d'intérêt
              </h3>
              <p className="text-sm text-slate-700 font-medium">
                {currentProfile.interets.join(', ')}
              </p>
            </div>
          )}

          {/* Mes Qualités */}
          {currentProfile.qualites && currentProfile.qualites.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-[#2D8659] uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mes qualités
              </h3>
              <p className="text-sm text-slate-700 font-medium">
                {currentProfile.qualites.join(', ')}
              </p>
            </div>
          )}

          {/* Informations Grid */}
          <div className="space-y-3 pt-2">
            <h3 className="text-[10px] font-bold text-[#2D8659] uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-3.5 h-3.5" /> Informations
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Madhhab</span>
                <span className="text-xs text-slate-800 font-semibold">{currentProfile.madhhab || 'Non spécifié'}</span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Éducation</span>
                <span className="text-xs text-slate-800 font-semibold">{currentProfile.education || 'Non spécifié'}</span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Enfants</span>
                <span className="text-xs text-slate-800 font-semibold">{currentProfile.enfants || 'Aucun'}</span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Souhaite des enfants</span>
                <span className="text-xs text-slate-800 font-semibold">{currentProfile.souhaiteEnfants || 'Oui'}</span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Peut déménager</span>
                <span className="text-xs text-slate-800 font-semibold">{currentProfile.peutDemenager || 'Oui'}</span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Polygamie</span>
                <span className="text-xs text-slate-800 font-semibold">{currentProfile.polygamie || 'À discuter'}</span>
              </div>
            </div>
          </div>

          {/* Bouton Match IA */}
          <div className="pt-6 pb-24">
            <button 
              onClick={() => setShowPremiumModal(true)}
              className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-center gap-3 hover:shadow-md transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Crown className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="font-bold text-indigo-900 group-hover:text-indigo-700">Analyse de compatibilité IA ✨</span>
            </button>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6 z-10 px-6">
          <button 
            onClick={handleNext}
            className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center shadow-lg border border-rose-100 text-rose-500 hover:bg-rose-100 hover:scale-110 transition-all"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
          
          <button 
            onClick={handleMessage}
            className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shadow-lg border border-amber-200 text-amber-600 hover:bg-amber-200 hover:scale-110 transition-all"
          >
            <MessageCircle className="w-5 h-5 stroke-[2.5]" />
          </button>
          
          <button 
            onClick={handleAdd}
            className="w-14 h-14 bg-[#2D8659] rounded-full flex items-center justify-center shadow-lg border border-[#236c47] text-white hover:bg-[#236c47] hover:scale-110 transition-all"
          >
            <Plus className="w-7 h-7 stroke-[3]" />
          </button>
        </div>
        
      </div>

      {/* Modal Premium (Analyse IA) */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in relative">
            <button 
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 text-center space-y-6">
              <h3 className="font-bold text-lg text-[#0A2F4A]">Analyse de compatibilité</h3>
              
              <div className="flex justify-center items-center gap-4">
                <img src={userProfile?.photos?.[0] || 'https://via.placeholder.com/150'} alt="Vous" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                <img src={currentProfile.photos?.[0] || 'https://via.placeholder.com/150'} alt={currentProfile.prenom} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
              </div>
              
              <div className="w-16 h-16 mx-auto bg-amber-50 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-amber-500" />
              </div>
              
              <div>
                <h4 className="font-bold text-xl text-[#0A2F4A] mb-1">Analyse IA exclusive</h4>
                <p className="text-xs text-slate-500">Débloquez l'analyse de compatibilité avec Premium</p>
              </div>
              
              <div className="space-y-2 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Heart className="w-4 h-4 text-[#2D8659]" /> Score détaillé
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#2D8659]" /> Valeurs communes
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MessageCircle className="w-4 h-4 text-[#2D8659]" /> Sujets suggérés
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setShowPremiumModal(false);
                  setCurrentView('settings');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <Crown className="w-5 h-5" />
                Passer Premium
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
