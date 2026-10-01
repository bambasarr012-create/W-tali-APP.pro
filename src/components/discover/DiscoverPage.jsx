import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getAllProfiles, sendRequest, getSentRequests, getReceivedRequests, getMatches, checkRelationshipStatus, acceptRequest } from '../../services/firestoreService';
import { X, MessageCircle, Plus, Crown, MapPin, Heart, User, CheckCircle2, Navigation, AlertCircle, Home, SlidersHorizontal, RotateCcw, Layers, Camera } from 'lucide-react';

export default function DiscoverPage() {
  const { userProfile } = useAuth();
  const { setCurrentView, showToast } = useApp();
  
  const [allProfiles, setAllProfiles] = useState([]);
  const [excludedIds, setExcludedIds] = useState(new Set());
  
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    pays: '',
    hasPhoto: false,
    celibataire: false,
    ageRange: ''
  });

  useEffect(() => {
    async function load() {
      if (!userProfile?.id) return;
      setLoading(true);
      try {
        const [list, sentReqs, receivedReqs, matches] = await Promise.all([
          getAllProfiles(),
          getSentRequests(userProfile.id),
          getReceivedRequests(userProfile.id),
          getMatches(userProfile.id)
        ]);
        
        const excluded = new Set([userProfile.id]);
        sentReqs.forEach(r => excluded.add(r.toUserId));
        receivedReqs.forEach(r => excluded.add(r.fromUserId));
        matches.forEach(m => m.users.forEach(u => excluded.add(u)));

        setExcludedIds(excluded);
        setAllProfiles(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userProfile]);

  useEffect(() => {
    if (!userProfile) return;
    
    const filteredList = allProfiles.filter(p => {
      if (excludedIds.has(p.id)) return false;
      if (p.age < 18) return false;
      if (p.suspended || p.hidden) return false;
      
      // Sexe opposé par défaut
      if (userProfile.genre && p.genre && p.genre === userProfile.genre) return false;

      // Filtres
      if (filters.pays && p.pays !== filters.pays) return false;
      if (filters.hasPhoto && (!p.photos || p.photos.length === 0)) return false;
      // Pour "Célibataire", on filtre sur un champ si nécessaire. Pour l'instant simulons si on avait statutMatrimonial :
      // if (filters.celibataire && p.statutMatrimonial !== 'Célibataire') return false; 
      
      if (filters.ageRange) {
        if (filters.ageRange === '18-25' && (p.age < 18 || p.age > 25)) return false;
        if (filters.ageRange === '26-35' && (p.age < 26 || p.age > 35)) return false;
        if (filters.ageRange === '36+' && p.age < 36) return false;
      }

      return true;
    });
    
    setProfiles(filteredList);
    setCurrentIndex(0);
  }, [allProfiles, excludedIds, filters, userProfile]);

  const currentProfile = profiles[currentIndex];

  const handleNext = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      showToast("Vous avez vu tous les profils correspondants.", "info");
    }
  };

  const handleAdd = async () => {
    try {
      if (!currentProfile) return;
      
      const statusObj = await checkRelationshipStatus(userProfile.id, currentProfile.id);
      
      if (statusObj.status === 'matched') {
        showToast("Vous avez déjà matché !", "info");
        handleNext();
        return;
      }
      if (statusObj.status === 'request_sent') {
        showToast("Demande déjà envoyée.", "info");
        handleNext();
        return;
      }
      if (statusObj.status === 'request_received') {
        await acceptRequest(statusObj.request.id, userProfile);
        showToast(`It's a Match avec ${currentProfile.prenom} !`, "success");
        handleNext();
        return;
      }

      await sendRequest(userProfile, currentProfile);
      showToast(`Demande envoyée à ${currentProfile.prenom} !`, "success");
      handleNext();
    } catch (e) {
      showToast(e.message || "Erreur lors de l'envoi de la demande", "error");
    }
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

  return (
    <div className="relative max-w-md mx-auto px-4 py-4 pb-32 h-[calc(100vh-64px)] flex flex-col">
      
      {/* HEADER TYPE FARATA */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button 
          onClick={() => setCurrentView('home')}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <Home className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex-1 bg-white border border-slate-200 rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
        </button>
        
        <button 
          onClick={() => setFilters({ pays: '', hasPhoto: false, celibataire: false, ageRange: '' })}
          className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 hover:bg-amber-100 transition-colors relative"
          title="Réinitialiser les filtres"
        >
          <RotateCcw className="w-5 h-5" />
          {Object.values(filters).some(v => v !== '' && v !== false) && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
          )}
        </button>
        
        <button className="w-10 h-10 rounded-full bg-[#EAF5EF] flex items-center justify-center text-[#2D8659] hover:bg-[#d5f0e1] transition-colors">
          <Layers className="w-5 h-5" />
        </button>
      </div>

      {/* FILTRES BOTTOM SHEET / MODAL */}
      {showFilters && (
        <div className="absolute top-16 left-4 right-4 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-[#0A2F4A]">Filtres de recherche</h3>
            <button onClick={() => setShowFilters(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-[#2D8659] text-white rounded-xl text-xs font-bold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
              </button>
              
              <select 
                value={filters.pays}
                onChange={(e) => setFilters({...filters, pays: e.target.value})}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#2D8659]"
              >
                <option value="">Tous les pays</option>
                <option value="Sénégal">Sénégal</option>
                <option value="France">France</option>
                <option value="Canada">Canada</option>
                <option value="USA">USA</option>
                <option value="Belgique">Belgique</option>
              </select>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilters({...filters, hasPhoto: !filters.hasPhoto})}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors ${filters.hasPhoto ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}
              >
                <Camera className="w-3.5 h-3.5" />
                Photo
              </button>
              
              <button 
                onClick={() => setFilters({...filters, celibataire: !filters.celibataire})}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors ${filters.celibataire ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}
              >
                Célibataire
              </button>

              {['18-25', '26-35', '36+'].map(range => (
                <button 
                  key={range}
                  onClick={() => setFilters({...filters, ageRange: filters.ageRange === range ? '' : range})}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors ${filters.ageRange === range ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Container principal de la carte ou de l'état vide */}
      <div className="flex-1 relative flex flex-col min-h-0">
        {!currentProfile ? (
          <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-200 flex flex-col items-center justify-center p-6 text-center h-full">
            <div className="w-16 h-16 bg-[#F0F4F2] rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-[#2D8659]" />
            </div>
            <h2 className="text-xl font-bold text-[#0A2F4A] mb-2">Plus de profils disponibles</h2>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto text-sm">
              Vous avez fait le tour de tous les profils correspondant à vos critères actuels. Revenez plus tard ou élargissez vos filtres !
            </p>
            {Object.values(filters).some(v => v !== '' && v !== false) && (
              <button 
                onClick={() => setFilters({ pays: '', hasPhoto: false, celibataire: false, ageRange: '' })}
                className="px-6 py-3 bg-[#0A2F4A] text-white font-bold rounded-xl shadow-lg hover:bg-[#061C2C]"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="h-full bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden flex flex-col relative">
            
            {/* Photo Header */}
            <div className="relative h-[45%] shrink-0">
              <img 
                src={currentProfile.photos?.[0] || 'https://via.placeholder.com/400x500'} 
                alt={currentProfile.prenom} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute top-4 left-4 bg-[#D4AF37] text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Crown className="w-3 h-3" />
                Premium
              </div>
              
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

              {currentProfile.valeurs && currentProfile.valeurs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-[#2D8659] uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mes valeurs
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.valeurs.map((val, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-[#0A2F4A]/5 border border-[#0A2F4A]/10 text-[#0A2F4A] rounded-full text-xs font-semibold">
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {currentProfile.criteres && currentProfile.criteres.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-[#2D8659] uppercase tracking-widest flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" /> Mes critères
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.criteres.map((crit, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#0A2F4A] rounded-full text-xs font-semibold">
                        {crit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {currentProfile.interets && currentProfile.interets.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-[#2D8659] uppercase tracking-widest flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" /> Centres d'intérêt
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.interets.map((int, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-medium">
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
        )}
      </div>

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
                <img src={currentProfile?.photos?.[0] || 'https://via.placeholder.com/150'} alt={currentProfile?.prenom} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
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
