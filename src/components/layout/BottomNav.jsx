import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Heart, UserCheck, MessageCircle, User, Eye, Star, LayoutGrid } from 'lucide-react';

export default function BottomNav() {
  const { currentView, setCurrentView, pendingRequestsCount, matchesCount } = useApp();

  const navItems = [
    { id: 'home', label: 'Accueil', icon: LayoutGrid },
    { id: 'discover', label: 'Découvrir', icon: Compass },
    { id: 'matches', label: 'Matchs', icon: Heart, badge: matchesCount > 0 ? matchesCount : null },
    { id: 'requests', label: 'Demandes', icon: UserCheck, badge: pendingRequestsCount > 0 ? pendingRequestsCount : null },
    { id: 'visitors', label: 'Visiteurs', icon: Eye, badge: 2 },
    { id: 'favorites', label: 'Favoris', icon: Star },
    { id: 'chat', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Profil', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-1 overflow-x-auto px-2 py-1.5 md:py-2 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'discover' && currentView === 'profile-detail');

          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex-shrink-0 flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#2D8659] font-bold scale-105'
                  : 'text-slate-500 hover:text-[#0A2F4A]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 bg-[#2D8659] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-0.5 ${isActive ? 'text-[#2D8659]' : 'text-slate-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#2D8659] -mb-1 mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
