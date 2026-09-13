import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Star, Heart, Lock, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { getAllProfiles } from '../../services/firestoreService';

export default function FavoritesPage() {
  const { userProfile } = useAuth();
  const { setCurrentView, viewProfileDetail } = useApp();
  
  const [activeTab, setActiveTab] = useState('mes_favoris'); // 'mes_favoris' | 'qui_maime'

  const allProfiles = getAllProfiles();
  
  // Simulation de données
  const myFavorites = allProfiles.slice(0, 3);
  const whoLikesMe = allProfiles.slice(4, 7);

  // Le palier supérieur débloque la vue "Qui m'aime" (3 mois ou 6 mois)
  const isPremium = userProfile?.subscriptionTier === '3_months' || userProfile?.subscriptionTier === '6_months';

  const renderProfileCard = (profile, blur) => {
    if (blur) {
      return (
        <div key={profile.id} className="bg-white rounded-3xl p-4 border border-slate-200 pointer-events-none select-none">
          <div className="w-full h-40 bg-slate-200 rounded-2xl mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
      );
    }

    return (
      <div 
        key={profile.id}
        onClick={() => viewProfileDetail(profile)}
        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:border-[#D4AF37]/50 transition-all cursor-pointer group relative"
      >
        <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50">
          <Heart className="w-4 h-4 text-white fill-white" />
        </div>
        
        <div className="relative h-64 overflow-hidden">
          <img 
            src={profile.photos[0]} 
            alt={profile.prenom} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute top-4 left-4">
            <div className="bg-[#2D8659] text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-3 h-3" />
              Vérifié
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-serif font-bold text-xl flex items-end gap-2">
              {profile.prenom}, {profile.age}
            </h3>
            <div className="flex items-center gap-1 text-white/90 text-xs mt-1">
              <MapPin className="w-3 h-3" />
              {profile.ville}
            </div>
          </div>
        </div>
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-500 line-clamp-1">{profile.profession}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 pb-28">
      
      {/* Header & Tabs */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#0A2F4A] flex items-center gap-3 mb-6">
          <Star className="w-8 h-8 text-[#D4AF37] fill-[#D4AF37]/20" />
          Favoris
        </h1>
        
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl max-w-sm">
          <button
            onClick={() => setActiveTab('mes_favoris')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeTab === 'mes_favoris'
                ? 'bg-white text-[#0A2F4A] shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Mes Favoris ({myFavorites.length})
          </button>
          <button
            onClick={() => setActiveTab('qui_maime')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeTab === 'qui_maime'
                ? 'bg-white text-[#0A2F4A] shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Qui m'aime ({whoLikesMe.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'mes_favoris' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {myFavorites.map(p => renderProfileCard(p, false))}
        </div>
      )}

      {activeTab === 'qui_maime' && (
        <div className="relative">
          {!isPremium && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md bg-white/40 rounded-3xl border border-white/50 shadow-sm">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center shadow-lg mb-6">
                <Heart className="w-10 h-10 text-rose-500 fill-rose-500/20" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A2F4A] mb-4">
                Découvre qui a craqué sur toi
              </h2>
              <p className="text-slate-700 max-w-md mx-auto mb-8 font-medium">
                Ton abonnement basique masque les personnes qui t'ont mis en favori. 
                Passe à un abonnement supérieur pour matcher immédiatement avec elles !
              </p>
              <button
                onClick={() => setCurrentView('settings')}
                className="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Débloquer l'accès complet
              </button>
            </div>
          )}
          
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${!isPremium ? 'filter blur-xl opacity-60 pointer-events-none select-none' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'}`}>
            {whoLikesMe.map(p => renderProfileCard(p, !isPremium))}
          </div>
        </div>
      )}

    </div>
  );
}
