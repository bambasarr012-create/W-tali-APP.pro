import React, { useState, useEffect } from 'react';
import { getAllProfiles } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import AICoachWidget from './AICoachWidget';
import DailyTip from './DailyTip';
import { Crown, MessageCircle, Heart, Eye, Star, UserCheck, Zap, BarChart2, Power, Quote, MapPin, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { userProfile } = useAuth();
  const { setCurrentView } = useApp();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await getAllProfiles(userProfile?.id);
        // Only keep 6-8 profiles for "La sélection Wétali"
        setProfiles(list.slice(0, 8));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userProfile]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      
      {/* Conseil / Rappel du jour */}
      <DailyTip />

      {/* 1. Bannière Passer Premium */}
      <div className="bg-[#0A2F4A] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-[#134B73]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center border border-[#D4AF37]/30 shrink-0">
            <Crown className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm sm:text-base flex items-center flex-wrap gap-2">
              Passez Premium
              <span className="bg-[#D4AF37] text-[#0A2F4A] text-[9px] px-2 py-0.5 rounded-full uppercase font-black tracking-wider">Offre</span>
            </h3>
            <p className="text-[#A0C0D6] text-xs mt-0.5">Démarquez-vous, parlez en priorité, naviguez Premium</p>
          </div>
        </div>
        <button 
          onClick={() => setCurrentView('settings')}
          className="w-full sm:w-auto shrink-0 px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#c4a133] hover:from-[#c4a133] hover:to-[#b39129] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
        >
          S'abonner →
        </button>
      </div>

      {/* 2. Barre de Complétion de Profil */}
      <div className="bg-[#2D8659] rounded-2xl p-5 sm:p-6 shadow-sm text-white">
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={userProfile?.photos?.[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'} 
            alt="Profil" 
            className="w-14 h-14 rounded-full object-cover border-2 border-white/50 shadow-sm"
          />
          <div>
            <h3 className="font-bold font-serif text-lg">{userProfile?.prenom || 'Utilisateur'}, {userProfile?.age || '...'}</h3>
            <div className="flex items-center gap-1 text-xs text-white/90 mt-0.5 font-medium">
              <MapPin className="w-3 h-3" /> {userProfile?.ville || 'Dakar'}, {userProfile?.pays || 'Sénégal'}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-end text-xs font-bold">
            <span>Profil complété</span>
            <span className="text-sm">80%</span>
          </div>
          <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full w-[80%] shadow-inner"></div>
          </div>
          <button 
            onClick={() => setCurrentView('settings')}
            className="w-full text-center text-[10px] uppercase tracking-wider mt-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-bold"
          >
            Cliquez pour compléter
          </button>
        </div>
      </div>

      {/* 3. La sélection Wétali */}
      <div className="bg-white rounded-[2rem] p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#EAF5EF] flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-[#2D8659] fill-[#2D8659]/20" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#0A2F4A]">La sélection Wétali</h3>
            <p className="text-[11px] text-slate-500 font-medium">Des profils choisis pour vous</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-4 border-[#2D8659] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {profiles.map(profile => (
              <div 
                key={profile.id} 
                onClick={() => setCurrentView('discover')}
                className="relative bg-slate-100 rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer group border border-slate-200 hover:border-[#2D8659] transition-all"
              >
                <img 
                  src={profile.photos?.[0] || 'https://via.placeholder.com/200x300'} 
                  alt={profile.prenom} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
                {/* Badges en haut */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
                    <Heart className="w-2.5 h-2.5" />
                    Célibataire
                  </div>
                  {/* Badge optionnel premium sur le premier profil */}
                  {profile.id === profiles[0]?.id && (
                    <div className="bg-[#D4AF37] text-white text-[9px] px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="font-bold text-xs sm:text-sm leading-tight flex items-center gap-1.5">
                    <span className="truncate">{profile.prenom}</span>
                    <span>{profile.age}</span>
                    <CheckCircle2 className="w-3 h-3 text-[#2D8659] fill-white shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/90 mt-1 font-medium">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{profile.ville}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={() => setCurrentView('discover')}
          className="w-full mt-6 py-3.5 border border-slate-200 text-[#2D8659] text-xs font-bold rounded-xl hover:bg-[#F0F4F2] transition-colors"
        >
          Voir tous les profils →
        </button>
      </div>

      {/* 4. Rappel du Jour */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#EAF5EF] flex items-center justify-center shrink-0">
          <Quote className="w-5 h-5 text-[#2D8659] fill-[#2D8659]/20" />
        </div>
        <div>
          <h4 className="text-[10px] font-bold text-[#2D8659] uppercase tracking-wider mb-1.5">Rappel du jour</h4>
          <p className="text-xs text-slate-700 italic leading-relaxed font-medium">
            "Le meilleur d'entre vous est celui qui est le meilleur envers sa famille."
          </p>
          <div className="text-[9px] text-slate-400 font-bold mt-2">- Hadith - (Ibn Majah)</div>
        </div>
      </div>

      {/* 5. Grille Raccourcis */}
      <div className="bg-white rounded-[2rem] p-5 sm:p-6 shadow-sm border border-slate-200 space-y-6">
        <div className="bg-[#2D8659] text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 border border-white/30">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">S'abonner, {userProfile?.prenom} !</h3>
              <p className="text-[11px] text-white/90 mt-0.5 font-medium">Prenez en charge votre destin amoureux, passez Premium.</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentView('settings')}
            className="relative z-10 w-full sm:w-auto px-6 py-3 bg-white text-[#2D8659] text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            S'abonner →
          </button>
          
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div 
            onClick={() => setCurrentView('chat')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <MessageCircle className="w-6 h-6 text-[#2D8659]" />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-[#0A2F4A]">Messages</div>
              <div className="text-[9px] text-slate-500 font-medium">Conversations</div>
            </div>
          </div>
          <div 
            onClick={() => setCurrentView('matches')}
            className="bg-rose-50/50 hover:bg-rose-50 border border-rose-100 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-[#0A2F4A]">Rencontres</div>
              <div className="text-[9px] text-slate-500 font-medium">Matchs</div>
            </div>
          </div>
          <div 
            onClick={() => setCurrentView('visitors')}
            className="bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Eye className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-[#0A2F4A]">Visiteurs</div>
              <div className="text-[9px] text-indigo-500 font-bold bg-indigo-100 px-2 rounded-full mt-1">Premium</div>
            </div>
          </div>
          <div 
            onClick={() => setCurrentView('favorites')}
            className="bg-amber-50/50 hover:bg-amber-50 border border-amber-100 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Star className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]/20" />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-[#0A2F4A]">Favoris</div>
              <div className="text-[9px] text-slate-500 font-medium mt-1">Vos coups de ❤️</div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Boost Banner */}
      <div className="bg-gradient-to-r from-[#2D8659] to-[#236c47] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-[#1e583a]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 border border-white/30">
            <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Augmentez vos chances 🚀</h3>
            <p className="text-[11px] text-white/90 mt-0.5 font-medium">Achetez des boosts pour apparaître en premier</p>
          </div>
        </div>
        <button 
          className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-slate-50 text-[#2D8659] font-bold rounded-xl text-xs transition-colors shadow-sm"
        >
          Vos boosts →
        </button>
      </div>

      {/* 7. Demandes en attente */}
      <div 
        onClick={() => setCurrentView('requests')}
        className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex items-center justify-between cursor-pointer hover:border-[#2D8659] hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center group-hover:bg-[#2D8659] transition-colors">
            <ShieldCheck className="w-5 h-5 text-[#2D8659] group-hover:text-white transition-colors" />
          </div>
          <div>
            <span className="font-bold text-sm text-[#0A2F4A] block">Demandes en attente</span>
            <span className="text-[10px] text-slate-500 font-medium">Découvrez qui souhaite vous contacter</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-[#2D8659] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">3</span>
          <span className="text-slate-400 group-hover:text-[#2D8659] transition-colors">→</span>
        </div>
      </div>

      {/* 8. Stats et Statut */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Visibilité (Stats) */}
        <div className="bg-white rounded-[2rem] p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col">
          <h3 className="font-bold text-sm text-[#0A2F4A] flex items-center gap-2 mb-1">
            <BarChart2 className="w-4 h-4 text-[#2D8659]" />
            Visibilité du profil
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mb-6">Aperçu de vos statistiques récentes</p>
          
          <div className="grid grid-cols-4 gap-2 text-center mt-auto">
            <div className="flex flex-col items-center">
              <div className="w-full h-16 bg-slate-50 rounded-t-lg relative flex items-end justify-center border-b border-slate-100">
                <div className="w-5 h-[30%] bg-[#2D8659] rounded-t-sm"></div>
              </div>
              <div className="text-xs font-bold text-[#0A2F4A] mt-2">12</div>
              <div className="text-[9px] text-slate-500 font-medium">Vues</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-16 bg-slate-50 rounded-t-lg relative flex items-end justify-center border-b border-slate-100">
                <div className="w-5 h-[60%] bg-rose-400 rounded-t-sm"></div>
              </div>
              <div className="text-xs font-bold text-[#0A2F4A] mt-2">4</div>
              <div className="text-[9px] text-slate-500 font-medium">Likes</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-16 bg-slate-50 rounded-t-lg relative flex items-end justify-center border-b border-slate-100">
                <div className="w-5 h-[20%] bg-[#D4AF37] rounded-t-sm"></div>
              </div>
              <div className="text-xs font-bold text-[#0A2F4A] mt-2">2</div>
              <div className="text-[9px] text-slate-500 font-medium">Favoris</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-16 bg-slate-50 rounded-t-lg relative flex items-end justify-center border-b border-slate-100">
                <div className="w-5 h-[85%] bg-indigo-400 rounded-t-sm"></div>
              </div>
              <div className="text-xs font-bold text-[#0A2F4A] mt-2">8</div>
              <div className="text-[9px] text-slate-500 font-medium">Matchs</div>
            </div>
          </div>
          
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#0A2F4A] mb-1">Conseil</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  Vos photos ont un fort taux d'attractivité. Complétez "Ma vision du mariage" pour attirer plus de profils sérieux.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statut du Profil */}
        <div className="bg-white rounded-[2rem] p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col">
          <h3 className="font-bold text-sm text-[#0A2F4A] flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-[#2D8659]" />
            Visibilité du profil
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mb-6">Mettez en pause quand vous le souhaitez</p>
          
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="border-2 border-[#2D8659] bg-[#EAF5EF] rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-sm">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-[#2D8659]" />
              </div>
              <span className="text-[10px] font-bold text-[#2D8659] uppercase tracking-wider">Publié</span>
            </div>
            <div className="border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <Power className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">En pause</span>
            </div>
            <div className="border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-slate-400 opacity-50" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Incognito</span>
            </div>
          </div>
          
          <div className="mt-auto pt-5 border-t border-slate-100">
            <h4 className="font-bold text-sm text-[#0A2F4A] mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2D8659]" />
              Assistante de Mariage
            </h4>
            <p className="text-[10px] text-slate-500 mb-4 font-medium">Assistante intelligente intégrée</p>
            
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#F0F4F2] text-[#2D8659] border border-[#2D8659]/20 text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm">Coaching séduction</span>
              <span className="bg-[#F0F4F2] text-[#2D8659] border border-[#2D8659]/20 text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm">Analyse compatibilité</span>
              <span className="bg-[#F0F4F2] text-[#2D8659] border border-[#2D8659]/20 text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm">Questions brise-glace</span>
            </div>
          </div>
        </div>

      </div>

      {/* AICoachWidget intégré à la fin */}
      <div className="mt-8">
        <AICoachWidget />
      </div>

    </div>
  );
}
