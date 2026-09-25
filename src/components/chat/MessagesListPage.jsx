import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, Search, ChevronRight } from 'lucide-react';

export default function MessagesListPage() {
  const { matches, setCurrentView, setActiveMatch } = useApp();

  const handleOpenChat = (match) => {
    setActiveMatch(match);
    setCurrentView('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0A2F4A] mb-2 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-[#D4AF37]" />
          Messages
        </h1>
        <p className="text-xs text-slate-500">
          Discutez avec vos matchs et apprenez à vous connaître.
        </p>
      </div>

      {/* Barre de recherche factice pour le design */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Rechercher une conversation..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#2D8659] shadow-sm transition-colors"
        />
      </div>

      <div className="space-y-3">
        {matches && matches.length > 0 ? (
          matches.map(match => {
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
                  {/* Badge en ligne vert */}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-[#0A2F4A] truncate">{partner.prenom || "Match"}</h3>
                    <span className="text-[10px] text-slate-400 font-medium ml-2 flex-shrink-0">
                      {lastMsgTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-medium">
                    {match.lastMessage || "Dites bonjour ! 👋"}
                  </p>
                </div>

                <div className="flex-shrink-0 text-slate-300 group-hover:text-[#2D8659] transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
            <MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700 mb-1">Aucun message</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Vous n'avez pas encore de conversation. Acceptez des demandes pour commencer à discuter !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
