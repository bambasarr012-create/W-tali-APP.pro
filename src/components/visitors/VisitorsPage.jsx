import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Eye, Lock, ShieldCheck, Sparkles, User, MapPin } from 'lucide-react';
import { getAllProfiles } from '../../services/firestoreService';

export default function VisitorsPage() {
  const { userProfile, isPremium } = useAuth();
  const { setCurrentView, viewProfileDetail } = useApp();

  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const profiles = await getAllProfiles();
      setVisitors(profiles.slice(2, 6)); // Simulation de quelques visiteurs
    };
    loadData();
  }, []);

  // isPremium est récupéré directement depuis useAuth()

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
              Passe Premium pour révéler tes admirateurs secrets.
            </p>
            <button
              onClick={() => setCurrentView('subscription')}
              className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#c4a133] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Voir les offres Premium
            </button>
          </div>

          {/* Grille Floutée Réaliste (Images floutées pour plus de FOMO) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pointer-events-none select-none overflow-hidden h-[60vh]">
            {visitors.map((profile, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative">
                <div className="absolute inset-0 z-0 bg-white/20 backdrop-blur-[24px]"></div>
                <div className="h-64">
                  <img 
                    src={profile.photos && profile.photos[0] ? profile.photos[0] : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"} 
                    alt="Visiteur flouté" 
                    className="w-full h-full object-cover blur-2xl scale-110 opacity-70"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="h-6 bg-slate-800/40 rounded-lg w-2/3 mb-2 backdrop-blur-md"></div>
                  <div className="h-4 bg-slate-800/30 rounded-lg w-1/3 backdrop-blur-md"></div>
                </div>
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
