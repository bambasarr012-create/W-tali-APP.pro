import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, Search, ChevronRight, Sparkles } from 'lucide-react';
import VerifiedBadge from '../common/VerifiedBadge';

export default function MessagesListPage() {
  const { matches, setCurrentView, setActiveMatch, viewProfileDetail } = useApp();

  const handleOpenChat = (match) => {
    setActiveMatch(match);
    setCurrentView('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Séparer les nouveaux matchs (sans message) des conversations actives
  const newMatches = matches?.filter(m => !m.lastMessage) || [];
  const activeChats = matches?.filter(m => m.lastMessage) || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0A2F4A] mb-1 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#2D8659]" />
            Échanges
          </h1>
          <p className="text-xs text-slate-500">
            Vos affinités et discussions en cours.
          </p>
        </div>
      </div>

      {/* Barre de recherche factice pour le design */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Rechercher une affinité ou conversation..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#2D8659] shadow-sm transition-colors"
        />
      </div>

      {/* Section : Nouvelles Affinités (Horizontal) */}
      {newMatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-[#0A2F4A] mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            Nouvelles Affinités
          </h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
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
                      <VerifiedBadge size="sm" className="absolute -bottom-1 -right-1" />
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

      {/* Section : Conversations (Vertical) */}
      <div>
        <h2 className="text-sm font-bold text-[#0A2F4A] mb-3">Messages</h2>
        <div className="space-y-3">
          {activeChats.length > 0 ? (
            activeChats.map(match => {
              const partner = match.otherUser || {};
              const lastMsgTime = match.lastMessageAt ? new Date(match.lastMessageAt).toLocaleDateString('fr-FR', { weekday: 'short' }) : '';
              
              return (
                <div 
                  key={match.id}
                  onClick={() => handleOpenChat(match)}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#2D8659]/30 transition-all cursor-pointer flex items-center gap-4 group"
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={partner.photos && partner.photos[0] ? partner.photos[0] : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
                      alt={partner.prenom || "Utilisateur"} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-50 group-hover:border-[#2D8659] transition-colors"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-[#0A2F4A] truncate flex items-center gap-1">
                        {partner.prenom || "Match"}
                        {partner.profileStatus === 'verified' && <VerifiedBadge size="sm" />}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium ml-2 flex-shrink-0">
                        {lastMsgTime}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate font-medium">
                      {match.lastMessage}
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-slate-300 group-hover:text-[#2D8659] transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
              <MessageCircle className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <h3 className="text-xs font-bold text-slate-600 mb-1">Aucun message</h3>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto px-4">
                {newMatches.length > 0 
                  ? "Cliquez sur une de vos nouvelles affinités pour lancer la discussion !"
                  : "Acceptez des invitations pour créer de nouvelles affinités et discuter."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
