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
      <div className="flex items-center justify-between gap-1 mb-6 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        {[
          { id: 'tous', label: 'Tous' },
          { id: 'non-lus', label: 'Non lus' },
          { id: 'lus', label: 'Lus' },
          { id: 'archives', label: 'Archivées' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[70px] py-2.5 px-3 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-[#2D8659] text-white shadow-sm' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bannière Premium (Messages Vocaux) */}
      <div 
        onClick={() => setCurrentView('subscription')}
        className="bg-gradient-to-r from-[#D4AF37] to-[#e5c765] rounded-2xl p-4 mb-6 text-white cursor-pointer hover:shadow-lg transition-all flex items-center justify-between shadow-md"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center backdrop-blur-sm shadow-inner">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2 drop-shadow-sm">
              Messages vocaux 
              <span className="text-[9px] bg-[#2D8659] text-white px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider font-black">Nouveau</span>
            </h3>
            <p className="text-[11px] text-white/95 font-medium mt-0.5">Fais entendre ta voix ! Exclusif Premium ✨</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/80" />
      </div>

      {/* Contenu Principal */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-8 h-8 border-4 border-[#2D8659] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs text-slate-400 font-medium">Chargement de vos échanges...</p>
          </div>
        ) : matches.length === 0 ? (
          /* État Vide (Inspiré Farata) */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center h-full">
            <div className="w-24 h-24 bg-[#EAF5EF] rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
              <MessageCircle className="w-10 h-10 text-[#2D8659]" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-[#0A2F4A] mb-2">Aucune conversation</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-[260px] font-medium leading-relaxed">
              Envoie une demande de contact pour commencer à échanger.
            </p>
            <button 
              onClick={() => setCurrentView('discover')} 
              className="flex items-center gap-2 bg-[#2D8659] text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-[#236c47] hover:shadow-lg transition-all active:scale-95"
            >
              <Search className="w-4 h-4" strokeWidth={3} /> 
              Découvrir des profils
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
