import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Sparkles, User, Settings as SettingsIcon, Bell } from 'lucide-react';
import WeddingRingLogo from '../common/WeddingRingLogo';

export default function Header() {
  const { userProfile } = useAuth();
  const { currentView, setCurrentView } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, type: 'visit', text: 'Aïssatou a consulté ton profil', time: 'il y a 2h', isRead: false },
    { id: 2, type: 'favorite', text: "Ousmane t'a ajouté en favori", time: 'hier', isRead: false },
  ];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0A2F4A] text-white border-b border-[#134B73] shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <WeddingRingLogo size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-[#D4AF37] transition-colors">
                Wétali
              </span>
              <span className="bg-[#2D8659] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono">
                Matrimonial
              </span>
            </div>
            <p className="text-[11px] text-[#A0C0D6] font-medium hidden sm:block">
              Diaspora Sénégalaise • Paris • Dakar • MTL • NYC
            </p>
          </div>
        </div>

        {/* Right Info / Profile Avatar */}
        <div className="flex items-center gap-3">
          {userProfile ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full bg-[#0E3B5C] border border-[#1E5680] text-white hover:border-[#2D8659] transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold flex items-center justify-center border border-[#0A2F4A]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                    <div className="p-3 bg-[#0A2F4A] text-white text-xs font-bold flex justify-between items-center">
                      <span>Notifications</span>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{unreadCount} non lues</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className="p-3 border-b border-slate-100 hover:bg-slate-50 flex gap-3 items-start cursor-pointer transition-colors">
                          <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${notif.isRead ? 'bg-transparent' : 'bg-[#2D8659]'}`}></div>
                          <div>
                            <p className="text-xs text-slate-800 font-medium leading-tight">{notif.text}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
              onClick={() => setCurrentView('settings')}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all ${
                currentView === 'settings'
                  ? 'bg-[#2D8659] border-[#2D8659] text-white'
                  : 'bg-[#0E3B5C] border-[#1E5680] text-white hover:border-[#2D8659]'
              }`}
            >
              {userProfile.photos && userProfile.photos[0] ? (
                <img
                  src={userProfile.photos[0]}
                  alt={userProfile.prenom}
                  className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#2D8659] text-white flex items-center justify-center text-xs font-bold">
                  {userProfile.prenom ? userProfile.prenom[0] : 'W'}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold leading-tight">{userProfile.prenom}</div>
                <div className="text-[10px] text-[#A0C0D6] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D8659]"></span>
                  {userProfile.ville || 'Profil actif'}
                </div>
              </div>
            </button>
            </>
          ) : (
            <div className="flex items-center gap-1 text-xs text-[#A0C0D6] bg-[#0E3B5C] px-3 py-1.5 rounded-full border border-[#1E5680]">
              <ShieldCheck className="w-4 h-4 text-[#2D8659]" />
              <span className="font-medium">Espace Sécurisé</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
