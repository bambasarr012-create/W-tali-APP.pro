import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getMatches, subscribeToUserMatches } from '../../services/firestoreService';
import { MessageCircle, Search, ChevronRight, Sparkles, Mic } from 'lucide-react';
import VerifiedBadge from '../common/VerifiedBadge';

export default function MessagesListPage() {
  const { setCurrentView, setActiveMatch } = useApp();
  const { userProfile } = useAuth();
  
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tous'); // 'tous', 'non-lus', 'lus', 'archives'

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
    if (!userProfile?.id) return;
    loadMatches();
    const unsub = subscribeToUserMatches(userProfile.id, loadMatches);
    return () => unsub();
  }, [userProfile]);

  const handleOpenChat = (match) => {
    setActiveMatch(match);
    setCurrentView('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const newMatches = matches?.filter(m => !m.lastMessage) || [];
  const activeChats = matches?.filter(m => m.lastMessage) || [];

  // Dans un vrai système, on filtrerait selon activeTab (non-lus, lus, etc.)
  const displayedChats = activeChats;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      
      {/* Navigation par Onglets (Tabs) */}
      <div className="flex items-center justify-between gap-2 mb-6 border-b border-slate-200 overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        {[
          { id: 'tous', label: 'Tous' },
          { id: 'non-lus', label: 'Non lus' },
          { id: 'lus', label: 'Lus' },
          { id: 'archives', label: 'Archivées' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-2 text-sm font-bold transition-all whitespace-nowrap border-b-2 -mb-[1px] ${
              activeTab === tab.id 
                ? 'border-[#0A2F4A] text-[#0A2F4A]' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bannière Premium (Messages Vocaux) */}
      <div 
        onClick={() => setCurrentView('subscription')}
        className="bg-[#0A2F4A] rounded-2xl p-4 mb-6 text-white cursor-pointer hover:shadow-lg hover:shadow-[#0A2F4A]/20 transition-all flex items-center justify-between relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center">
            <Mic className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base flex items-center gap-2 text-white">
              Notes Vocales
              <span className="text-[9px] bg-[#D4AF37] text-[#0A2F4A] px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider font-black font-sans">Premium</span>
            </h3>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">Faites entendre votre voix pour plus d'authenticité ✨</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#D4AF37] relative z-10" />
      </div>

      {/* Contenu Principal */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-8 h-8 border-4 border-[#2D8659] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs text-slate-400 font-medium">Chargement de vos échanges...</p>
          </div>
        ) : matches.length === 0 ? (
          /* État Vide Wétali */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center h-full">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-2xl"></div>
              <div className="w-20 h-20 bg-white border border-slate-100 rounded-full flex items-center justify-center relative z-10 shadow-sm">
                <MessageCircle className="w-8 h-8 text-[#0A2F4A]" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#0A2F4A] mb-2">Vos échanges</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-[260px] font-medium leading-relaxed">
              Il n'y a pas encore de conversation ici. Trouvez votre affinité pour commencer à discuter.
            </p>
            <button 
              onClick={() => setCurrentView('discover')} 
              className="flex items-center gap-2 bg-[#0A2F4A] text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-[#061d2e] hover:shadow-lg hover:shadow-[#0A2F4A]/20 transition-all active:scale-95"
            >
              <Search className="w-4 h-4" /> 
              Trouver mon affinité
            </button>
          </div>
        ) : (
          /* Liste des Conversations */
          <div className="p-2 sm:p-4">
            
            {/* Nouvelles Affinités (Bulle Horizontale) */}
            {newMatches.length > 0 && activeTab === 'tous' && (
              <div className="mb-4 pb-4 border-b border-slate-50 px-2">
                <div className="flex gap-4 overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {newMatches.map(match => {
                    const partner = match.otherUser || {};
                    const photo = partner.photos && partner.photos[0] ? partner.photos[0] : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
                    
                    return (
                      <div 
                        key={match.id}
                        onClick={() => handleOpenChat(match)}
                        className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 group w-[72px]"
                      >
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#D4AF37] to-[#2D8659] group-hover:scale-105 transition-transform">
                            <img 
                              src={photo}
                              alt={partner.prenom}
                              className="w-full h-full rounded-full object-cover border-2 border-white"
                            />
                          </div>
                          {partner.profileStatus === 'verified' && (
                            <VerifiedBadge size="sm" className="absolute -bottom-1 -right-1 shadow-sm" />
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 truncate w-full text-center">
                          {partner.prenom}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Conversations Actives */}
            <div className="space-y-1">
              {displayedChats.length > 0 ? (
                displayedChats.map((match, index) => {
                  const partner = match.otherUser || {};
                  const lastMsgTime = match.lastMessageAt ? new Date(match.lastMessageAt).toLocaleDateString('fr-FR', { weekday: 'short' }) : '';
                  const isLast = index === displayedChats.length - 1;
                  
                  return (
                    <div 
                      key={match.id}
                      onClick={() => handleOpenChat(match)}
                      className={`p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-4 group ${!isLast ? 'border-b border-slate-50' : ''}`}
                    >
                      <div className="relative flex-shrink-0">
                        <img 
                          src={partner.photos && partner.photos[0] ? partner.photos[0] : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
                          alt={partner.prenom || "Utilisateur"} 
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-[#2D8659]/20 transition-colors"
                        />
                      </div>

                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-[15px] text-[#0A2F4A] truncate flex items-center gap-1">
                            {partner.prenom || "Match"}
                            {partner.profileStatus === 'verified' && <VerifiedBadge size="sm" />}
                          </h3>
                          <span className="text-[10px] text-slate-400 font-semibold ml-2 flex-shrink-0 uppercase">
                            {lastMsgTime}
                          </span>
                        </div>
                        <p className="text-[13px] text-slate-500 truncate font-medium pr-4">
                          {match.lastMessage}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2D8659] transition-colors" />
                      </div>
                    </div>
                  );
                })
              ) : (
                activeTab !== 'tous' && (
                  <div className="text-center py-10">
                    <p className="text-xs text-slate-500 font-medium">Aucun message dans cette catégorie.</p>
                  </div>
                )
              )}
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
