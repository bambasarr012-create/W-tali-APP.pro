import React from 'react';

const Footer = () => (
  <footer className="bg-[#0F172A] text-gray-300 py-16 font-sans border-t-4 border-[#D4AF37] mt-auto">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
        {/* COL 1 */}
        <div className="lg:col-span-1 flex flex-col items-start">
          <a className="flex items-center gap-2 mb-4" href="/" style={{textDecoration: 'none'}}>
            <svg width="40" height="40" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="#0F172A" stroke="#D4AF37" strokeWidth="4"/>
              <ellipse cx="37" cy="57" rx="18" ry="18" fill="none" stroke="#D4AF37" strokeWidth="5.5"/>
              <ellipse cx="60" cy="44" rx="18" ry="18" fill="none" stroke="#D4AF37" strokeWidth="5.5" opacity="0.8"/>
              <path d="M 37 39 A 18 18 0 0 1 52 43" fill="none" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round"/>
              <polygon points="60,20 66,28 60,34 54,28" fill="#FFFBF0"/>
              <circle cx="60" cy="27" r="2.5" fill="#D4AF37"/>
            </svg>
            <span className="text-white font-serif font-bold text-2xl tracking-wide">Wétali</span>
          </a>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Ta moitié, par confiance et respect. La plateforme matrimoniale sérieuse pour la diaspora sénégalaise.
          </p>
          <div className="flex items-center gap-2 border border-[#D4AF37]/50 rounded-lg py-2 px-3 bg-transparent">
            <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">RGPD</span>
              <span className="text-xs text-[#D4AF37] font-semibold leading-none mt-1">100% Conforme</span>
            </div>
          </div>
        </div>

        {/* COL 2 */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Navigation</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="/" className="hover:text-[#D4AF37] transition-colors">Accueil</a></li>
            <li><a href="/#how-it-works" className="hover:text-[#D4AF37] transition-colors">Comment ça marche</a></li>
            <li><a href="/#pricing" className="hover:text-[#D4AF37] transition-colors">Tarifs</a></li>
            <li><a href="/#blog" className="hover:text-[#D4AF37] transition-colors">Blog</a></li>
            <li><a href="/#faq" className="hover:text-[#D4AF37] transition-colors">FAQ</a></li>
          </ul>
        </div>

        {/* COL 3 */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Rencontre</h4>
          <ul className="space-y-3 text-sm">
            <li><button onClick={() => window.openCity && window.openCity('paris')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Rencontre Paris</button></li>
            <li><button onClick={() => window.openCity && window.openCity('marseille')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Rencontre Marseille</button></li>
            <li><button onClick={() => window.openCity && window.openCity('montreal')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Rencontre Montréal</button></li>
            <li><button onClick={() => window.openCity && window.openCity('newyork')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Rencontre New York</button></li>
            <li><button onClick={() => window.openCity && window.openCity('londres')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Rencontre Londres</button></li>
            <li><button onClick={() => window.openCity && window.openCity('milan')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Rencontre Milan</button></li>
            <li><button onClick={() => window.openCity && window.openCity('bruxelles')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Rencontre Bruxelles</button></li>
            <li className="pt-2"><button onClick={() => window.openCity && window.openCity('all')} className="text-[#D4AF37] hover:text-white font-medium transition-colors text-xs uppercase tracking-wide text-left w-full">Toutes les villes →</button></li>
          </ul>
        </div>

        {/* COL 4 */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Légal</h4>
          <ul className="space-y-3 text-sm">
            <li><button onClick={() => window.openLegal && window.openLegal('rules')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Règlement</button></li>
            <li><button onClick={() => window.openLegal && window.openLegal('privacy')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Confidentialité</button></li>
            <li><button onClick={() => window.openLegal && window.openLegal('terms')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Mentions légales</button></li>
            <li><button onClick={() => window.openLegal && window.openLegal('cgv')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">CGV</button></li>
            <li><button onClick={() => window.openLegal && window.openLegal('dpa')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Accord de traitement (DPA)</button></li>
          </ul>
        </div>

        {/* COL 5 */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#D4AF37] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <a href="mailto:contact@wetali.app" className="hover:text-[#D4AF37] transition-colors">contact@wetali.app</a>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#D4AF37] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span className="text-gray-400">Dakar, Sénégal</span>
            </li>
          </ul>
        </div>
        
      </div>

      <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <div>© 2026 Wétali. Tous droits réservés.</div>
        <div className="flex items-center gap-1">Fait avec <span className="text-red-500 text-sm">❤️</span> pour la diaspora</div>
        <div>v1.0.0</div>
      </div>
    </div>
  </footer>
);

export default function LegalLayout({ title, children, onBack }) {
  const handleBack = () => {
    if (onBack) onBack();
    else window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-slate-800 font-sans flex flex-col">
      <header className="bg-[#0F172A] border-b border-[#D4AF37] py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleBack}>
          <svg width="32" height="32" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="#0F172A" stroke="#D4AF37" strokeWidth="4"/>
            <ellipse cx="37" cy="57" rx="18" ry="18" fill="none" stroke="#D4AF37" strokeWidth="5.5"/>
            <ellipse cx="60" cy="44" rx="18" ry="18" fill="none" stroke="#D4AF37" strokeWidth="5.5" opacity="0.8"/>
            <path d="M 37 39 A 18 18 0 0 1 52 43" fill="none" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round"/>
            <polygon points="60,20 66,28 60,34 54,28" fill="#FFFBF0"/>
            <circle cx="60" cy="27" r="2.5" fill="#D4AF37"/>
          </svg>
          <span className="text-white font-serif font-bold text-xl tracking-wide">Wétali</span>
        </div>
        <button 
          onClick={handleBack}
          className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2"
        >
          <span>←</span> Retour à l'accueil
        </button>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A] mb-12 text-center">
          {title}
        </h1>
        <div className="space-y-8 text-[#334155] leading-relaxed">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
