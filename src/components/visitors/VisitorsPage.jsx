import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Eye, Lock, ShieldCheck, Sparkles, User, MapPin } from 'lucide-react';
import { getAllProfiles } from '../../services/firestoreService';

export default function VisitorsPage() {
  const { userProfile } = useAuth();
  const { setCurrentView, viewProfileDetail } = useApp();

  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const profiles = await getAllProfiles();
      setVisitors(profiles.slice(2, 6)); // Simulation de quelques visiteurs
    };
    loadData();
  }, []);

  // Le palier supérieur débloque la vue (3 mois ou 6 mois)
  const isPremium = userProfile?.subscriptionTier === '3_months' || userProfile?.subscriptionTier === '6_months';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 pb-28">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#0A2F4A] flex items-center gap-3">
          <Eye className="w-8 h-8 text-[#D4AF37]" />
          Mes Visiteurs
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Découvre qui s'intéresse à ton profil.
        </p>
      </div>

      {!isPremium ? (
        <div className="relative">
          {/* Overlay de Floutage / Upsell */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md bg-white/40 rounded-3xl border border-white/50 shadow-sm">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
              <Lock className="w-10 h-10 text-[#0A2F4A]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0A2F4A] mb-4">
              Débloque tes Visiteurs
            </h2>
            <p className="text-slate-700 max-w-md mx-auto mb-8 font-medium">
              Ton abonnement actuel ne te permet pas de voir qui consulte ton profil. 
              Passe à un palier supérieur (3 mois ou 6 mois) pour révéler tes admirateurs secrets.
            </p>
            <button
              onClick={() => setCurrentView('settings')}
              className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#c4a133] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Gérer mon abonnement
            </button>
          </div>

          {/* Grille Floutée */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 filter blur-xl opacity-60 pointer-events-none select-none">
            {visitors.map((visitor, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-4 border border-slate-200">
                <div className="w-full h-40 bg-slate-200 rounded-2xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visitors.map(profile => (
            <div 
              key={profile.id}
              onClick={() => viewProfileDetail(profile)}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:border-[#D4AF37]/50 transition-all cursor-pointer group"
            >
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
                  <span className="text-[#A0C0D6] flex-shrink-0 ml-2">il y a 2h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
