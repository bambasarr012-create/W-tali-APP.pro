import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Sparkles, User, Settings as SettingsIcon } from 'lucide-react';
import WeddingRingLogo from '../common/WeddingRingLogo';

export default function Header() {
  const { userProfile } = useAuth();
  const { currentView, setCurrentView } = useApp();

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
