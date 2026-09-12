import React, { useEffect, useState } from 'react';
import WeddingRingLogo from '../common/WeddingRingLogo';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import TermsPage from '../legal/TermsPage';
import PrivacyPage from '../legal/PrivacyPage';
import CGVPage from '../legal/CGVPage';
import DPAPage from '../legal/DPAPage';
import RulesPage from '../legal/RulesPage';

const CITIES = {
  paris: { name: 'Paris', stats: '1 200+' },
  marseille: { name: 'Marseille', stats: '450+' },
  montreal: { name: 'Montréal', stats: '800+' },
  newyork: { name: 'New York', stats: '650+' },
  londres: { name: 'Londres', stats: '500+' },
  milan: { name: 'Milan', stats: '300+' },
  bruxelles: { name: 'Bruxelles', stats: '400+' },
};

export default function CityLandingPage({ ville, onBack, onSignup, onNavCity }) {
  const cityData = CITIES[ville] || { name: ville, stats: '500+' };
  const cityName = cityData.name;
  
  const [legalPage, setLegalPage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ville]);

  if (legalPage === 'terms') return <TermsPage onBack={() => setLegalPage(null)} />;
  if (legalPage === 'privacy') return <PrivacyPage onBack={() => setLegalPage(null)} />;
  if (legalPage === 'cgv') return <CGVPage onBack={() => setLegalPage(null)} />;
  if (legalPage === 'dpa') return <DPAPage onBack={() => setLegalPage(null)} />;
  if (legalPage === 'rules') return <RulesPage onBack={() => setLegalPage(null)} />;

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

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0F172A] to-[#1E3A8A] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37] bg-white/10 text-xs font-bold text-[#D4AF37] shadow-sm mb-6">
            📍 {cityName}
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Rencontre matrimoniale à <span className="text-[#D4AF37]">{cityName}</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 font-light">
            Trouve ta moitié dans la communauté sénégalaise de {cityName}.
          </p>
          <p className="text-sm text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Wétali connecte les Sénégalais sérieux de {cityName} qui cherchent un mariage dans le respect et la confiance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onSignup}
              className="bg-[#D4AF37] hover:bg-[#b5952f] text-[#0F172A] px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
            >
              Créer mon profil gratuitement
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              <span>{cityData.stats} membres à {cityName}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi Wétali */}
      <section className="py-20 px-6 bg-[#FFFBF0]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center text-[#0F172A] mb-12">
            Pourquoi choisir Wétali à {cityName} ?
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="w-12 h-12 bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg mb-3">Profils vérifiés</h3>
              <p className="text-sm text-slate-600">
                Chaque profil de {cityName} est vérifié manuellement pour garantir une communauté sérieuse et authentique.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="w-12 h-12 bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg mb-3">Respect des valeurs</h3>
              <p className="text-sm text-slate-600">
                Conçu spécifiquement pour la diaspora sénégalaise, dans le respect strict de nos valeurs traditionnelles.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="w-12 h-12 bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg mb-3">Gratuit pour commencer</h3>
              <p className="text-sm text-slate-600">
                Créez votre profil, explorez la communauté de {cityName} et recevez vos premières suggestions sans frais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche (Réutilisé de la landing) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center text-[#0F172A] mb-16">
            Comment ça marche ?
          </h2>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2"></div>
            <div className="space-y-12">
              {[
                { step: "1", title: "Création du profil", desc: "Renseignez vos critères, valeurs et attentes matrimoniales avec sincérité." },
                { step: "2", title: "Vérification", desc: "Notre équipe valide votre profil pour rejoindre le cercle Wétali." },
                { step: "3", title: "Découverte", desc: `Parcourez les profils sérieux recommandés, particulièrement à ${cityName}.` },
                { step: "4", title: "Rencontre", desc: "Échangez en toute discrétion et préparez votre union d'honneur." }
              ].map((item, index) => (
                <div key={index} className="relative flex flex-col md:flex-row items-center md:justify-between gap-6 md:gap-0">
                  <div className={`w-full md:w-[45%] ${index % 2 === 0 ? 'md:text-right' : 'md:order-3'}`}>
                    <h3 className="font-bold text-lg text-[#0F172A] mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                  <div className={`absolute left-4 md:left-1/2 top-0 md:top-1/2 w-8 h-8 rounded-full bg-[#D4AF37] text-[#0F172A] font-bold flex items-center justify-center -translate-x-1/2 md:-translate-y-1/2 shadow-md border-4 border-white ${index % 2 === 0 ? 'md:order-2' : 'md:order-2'}`}>
                    {item.step}
                  </div>
                  <div className={`w-full md:w-[45%] hidden md:block ${index % 2 === 0 ? 'order-3' : 'order-1'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Courte */}
      <section className="py-20 px-6 bg-[#FFFBF0]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center text-[#0F172A] mb-12">
            Questions Fréquentes
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-[#0F172A] mb-2">Combien y a-t-il de membres Wétali à {cityName} ?</h3>
              <p className="text-sm text-slate-600">Nous comptons actuellement {cityData.stats} membres actifs et vérifiés dans la région de {cityName}. La communauté grandit chaque jour avec de nouvelles personnes sérieuses.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-[#0F172A] mb-2">Wétali est-il gratuit à {cityName} ?</h3>
              <p className="text-sm text-slate-600">Oui, la création de compte, la vérification de profil et la découverte des recommandations sont 100% gratuites.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Découvrez Aussi */}
      <section className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Découvrez aussi</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(CITIES).filter(([k]) => k !== ville).map(([k, v]) => (
              <button 
                key={k} 
                onClick={() => onNavCity(k)}
                className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
              >
                Rencontre {v.name}
              </button>
            ))}
            <button onClick={() => onNavCity('all')} className="px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 hover:bg-slate-100 transition-colors">
              Toutes les villes →
            </button>
          </div>
        </div>
      </section>

      {/* Footer identique au reste du site */}
      <footer className="bg-[#0F172A] text-gray-300 py-16 font-sans border-t-4 border-[#D4AF37] mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
            {/* COL 1 */}
            <div className="lg:col-span-1 flex flex-col items-start">
              <a className="flex items-center gap-2 mb-4 cursor-pointer" onClick={onBack}>
                <WeddingRingLogo size="sm" />
                <span className="text-white font-serif font-bold text-2xl tracking-wide">Wétali</span>
              </a>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Ta moitié, par confiance et respect. La plateforme matrimoniale sérieuse pour la diaspora sénégalaise.
              </p>
              <div className="flex items-center gap-2 border border-[#D4AF37]/50 rounded-lg py-2 px-3 bg-transparent">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
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
                <li><button onClick={onBack} className="hover:text-[#D4AF37] transition-colors">Accueil</button></li>
                <li><button onClick={onBack} className="hover:text-[#D4AF37] transition-colors">Comment ça marche</button></li>
              </ul>
            </div>

            {/* COL 3 */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Rencontre</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => onNavCity('paris')} className="text-gray-400 hover:text-[#D4AF37] transition-colors">Rencontre Paris</button></li>
                <li><button onClick={() => onNavCity('marseille')} className="text-gray-400 hover:text-[#D4AF37] transition-colors">Rencontre Marseille</button></li>
                <li><button onClick={() => onNavCity('montreal')} className="text-gray-400 hover:text-[#D4AF37] transition-colors">Rencontre Montréal</button></li>
                <li><button onClick={() => onNavCity('newyork')} className="text-gray-400 hover:text-[#D4AF37] transition-colors">Rencontre New York</button></li>
                <li><button onClick={() => onNavCity('londres')} className="text-gray-400 hover:text-[#D4AF37] transition-colors">Rencontre Londres</button></li>
                <li><button onClick={() => onNavCity('milan')} className="text-gray-400 hover:text-[#D4AF37] transition-colors">Rencontre Milan</button></li>
                <li><button onClick={() => onNavCity('bruxelles')} className="text-gray-400 hover:text-[#D4AF37] transition-colors">Rencontre Bruxelles</button></li>
                <li><button onClick={() => onNavCity('all')} className="text-gray-400 hover:text-[#D4AF37] transition-colors font-medium">Toutes les villes</button></li>
              </ul>
            </div>

            {/* COL 4 */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Légal</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => setLegalPage('rules')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Règlement</button></li>
                <li><button onClick={() => setLegalPage('privacy')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Confidentialité</button></li>
                <li><button onClick={() => setLegalPage('terms')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Mentions légales</button></li>
                <li><button onClick={() => setLegalPage('cgv')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">CGV</button></li>
                <li><button onClick={() => setLegalPage('dpa')} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-left w-full">Accord de traitement (DPA)</button></li>
              </ul>
            </div>

            {/* COL 5 */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-0.5 shrink-0">✉️</span>
                  <a href="mailto:contact@wetali.app" className="hover:text-[#D4AF37] transition-colors">contact@wetali.app</a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-0.5 shrink-0">📍</span>
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
    </div>
  );
}
