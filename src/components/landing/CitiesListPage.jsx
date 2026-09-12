import React from 'react';
import WeddingRingLogo from '../common/WeddingRingLogo';

const CITIES = {
  paris: { name: 'Paris', stats: '1 200+' },
  marseille: { name: 'Marseille', stats: '450+' },
  montreal: { name: 'Montréal', stats: '800+' },
  newyork: { name: 'New York', stats: '650+' },
  londres: { name: 'Londres', stats: '500+' },
  milan: { name: 'Milan', stats: '300+' },
  bruxelles: { name: 'Bruxelles', stats: '400+' },
};

export default function CitiesListPage({ onBack, onNavCity }) {
  return (
    <div className="min-h-screen bg-[#F4F7F6] text-slate-800 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-[#0F172A] border-b border-[#D4AF37] py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
          <WeddingRingLogo size="sm" />
          <span className="text-white font-serif font-bold text-xl tracking-wide">Wétali</span>
        </div>
        <button 
          onClick={onBack}
          className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2"
        >
          <span>←</span> Retour à l'accueil
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            Rencontre la diaspora sénégalaise
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Wétali est présent dans les plus grandes villes du monde. Choisis ta ville pour découvrir une communauté sérieuse près de chez toi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(CITIES).map(([k, v]) => (
            <button
              key={k}
              onClick={() => onNavCity(k)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-[#D4AF37] hover:shadow-md transition-all text-left flex items-center justify-between group"
            >
              <div>
                <h3 className="font-bold text-xl text-[#0F172A] mb-1 group-hover:text-[#D4AF37] transition-colors">{v.name}</h3>
                <p className="text-sm text-slate-500">{v.stats} membres actifs</p>
              </div>
              <span className="text-[#D4AF37] text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
