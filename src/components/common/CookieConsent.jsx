import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsAccepted, setAnalyticsAccepted] = useState(true);

  useEffect(() => {
    // Vérifier si un choix a déjà été fait
    const consent = localStorage.getItem('wetali_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    saveConsent(true);
  };

  const handleAcceptEssentialOnly = () => {
    saveConsent(false);
  };

  const handleSavePreferences = () => {
    saveConsent(analyticsAccepted);
  };

  const saveConsent = (analytics) => {
    localStorage.setItem('wetali_cookie_consent', JSON.stringify({
      essential: true,
      analytics: analytics,
      timestamp: new Date().toISOString()
    }));
    
    setIsVisible(false);
    
    // Logique d'activation des analytics si nécessaire plus tard
    if (analytics) {
      console.log('Analytics autorisés');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border border-wetaliGold/20 p-5 md:p-8 pointer-events-auto">
        
        {!showDetails ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-wetaliBlue/10 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-wetaliBlue" />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-wetaliBlack">
                  Vos préférences de cookies
                </h3>
              </div>
              <p className="text-slate-600 text-sm md:text-base">
                Wétali utilise des cookies pour assurer le bon fonctionnement de l'application (cookies essentiels) et pour analyser notre trafic afin d'améliorer votre expérience (cookies analytiques). <button onClick={() => window.dispatchEvent(new CustomEvent('show-privacy'))} className="underline font-medium text-wetaliBlue hover:text-wetaliGold transition-colors">En savoir plus dans notre politique de confidentialité.</button>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center w-full md:w-auto gap-3">
              <button
                onClick={() => setShowDetails(true)}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-wetaliBlue hover:bg-wetaliBlue/5 rounded-xl transition-colors"
              >
                Personnaliser
              </button>
              <button
                onClick={handleAcceptEssentialOnly}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium border border-wetaliBlue text-wetaliBlue hover:bg-wetaliBlue hover:text-white rounded-xl transition-all"
              >
                Essentiels uniquement
              </button>
              <button
                onClick={handleAcceptAll}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold bg-wetaliGold text-white hover:bg-yellow-500 rounded-xl transition-all shadow-md shadow-wetaliGold/30"
              >
                Tout accepter
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-serif font-bold text-wetaliBlack flex items-center gap-2">
                <Cookie className="w-6 h-6 text-wetaliGold" />
                Personnaliser vos choix
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* Cookies Essentiels */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-wetaliBlack">Cookies essentiels</h4>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">Toujours actifs</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Ces cookies sont nécessaires au fonctionnement de l'application (connexion, sécurité) et ne peuvent pas être désactivés.
                  </p>
                </div>
              </div>

              {/* Cookies Analytiques */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-wetaliBlack">Cookies analytiques</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={analyticsAccepted}
                        onChange={() => setAnalyticsAccepted(!analyticsAccepted)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wetaliBlue"></div>
                    </label>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Ils nous permettent de mesurer l'audience et d'améliorer nos services de manière anonyme.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-6 py-2.5 text-sm font-bold bg-wetaliBlue text-white hover:bg-blue-900 rounded-xl transition-all shadow-md"
              >
                Enregistrer mes choix
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
