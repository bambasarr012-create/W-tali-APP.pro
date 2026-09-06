import React, { useState, useEffect } from 'react';
import { getMatches, subscribeToCollection } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Heart, MessageCircle, MapPin, Sparkles, ShieldCheck, ChevronRight, User } from 'lucide-react';

export default function MatchesPage() {
  const { userProfile } = useAuth();
  const { openChatWithMatch, setCurrentView, viewProfileDetail } = useApp();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const list = await getMatches(userProfile?.id);
      setMatches(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
    const unsub = subscribeToCollection('matches', loadMatches);
    return () => unsub();
  }, [userProfile]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0A2F4A] flex items-center gap-2">
            <Heart className="w-7 h-7 text-[#2D8659] fill-[#2D8659]" />
            <span>Vos Matchs & Unions Potentielles</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Les personnes avec qui vous avez validé une volonté mutuelle d'échanger.
          </p>
        </div>

        <span className="self-start sm:self-center font-mono text-xs font-bold bg-[#EAF5EF] text-[#2D8659] px-3 py-1.5 rounded-full">
          {matches.length} Match{matches.length > 1 ? 's' : ''} actif{matches.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-[#2D8659] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Chargement des matchs...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EAF5EF] text-[#2D8659] mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8 fill-[#2D8659]" />
          </div>
          <h3 className="font-bold text-lg text-[#0A2F4A]">Aucun match pour le moment</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explorez les profils sur la page Découvrir et envoyez des demandes d'introduction pour créer vos premières connexions.
          </p>
          <button
            onClick={() => setCurrentView('home')}
            className="px-6 py-3 rounded-2xl bg-[#2D8659] hover:bg-[#236c47] text-white text-xs font-bold transition-all"
          >
            Découvrir des profils
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map(match => {
            const partner = match.otherUser || {};
            const photo = partner.photos && partner.photos[0]
              ? partner.photos[0]
              : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

            return (
              <div
                key={match.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#2D8659]/50 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div 
                    onClick={() => partner.id && viewProfileDetail(partner)}
                    className="relative cursor-pointer"
                  >
                    <img
                      src={photo}
                      alt={partner.prenom}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 group-hover:border-[#2D8659] shadow-sm transition-colors"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow"></span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 
                        onClick={() => partner.id && viewProfileDetail(partner)}
                        className="font-serif font-bold text-lg text-[#0A2F4A] hover:text-[#2D8659] transition-colors truncate cursor-pointer"
                      >
                        {partner.prenom}, {partner.age} ans
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-[#2D8659]">
                        <MapPin className="w-3 h-3" />
                        {partner.ville}
                      </span>
                      <span>•</span>
                      <span className="truncate">{partner.profession}</span>
                    </div>

                    {partner.dahira && (
                      <span className="inline-block text-[10px] font-medium bg-[#F0F4F2] text-[#0A2F4A] px-2 py-0.5 rounded-md mt-1.5">
                        {partner.dahira}
                      </span>
                    )}
                  </div>
                </div>

                {/* Last Message / Intro */}
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 line-clamp-2 italic">
                  "{match.lastMessage || 'Prêt pour échanger dans un cadre sérieux.'}"
                </div>

                {/* Chat Action Button */}
                <button
                  type="button"
                  onClick={() => openChatWithMatch(match)}
                  className="w-full py-2.5 rounded-xl bg-[#0A2F4A] group-hover:bg-[#2D8659] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ouvrir la conversation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
