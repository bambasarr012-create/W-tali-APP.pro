import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Check, ShieldCheck, Lock, Smartphone, CreditCard, Sparkles, ChevronRight } from 'lucide-react';
import WeddingRingLogo from '../common/WeddingRingLogo';

export default function SubscriptionPage() {
  const { userProfile, updateSubscription } = useAuth();
  const { setCurrentView, showToast } = useApp();
  
  const [selectedTier, setSelectedTier] = useState('6_months');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'apple_google', 'mobile_money'

  const tiers = [
    {
      id: '1_month',
      months: 1,
      title: '1 Mois',
      price: '14,99€',
      monthlyPrice: '14,99€/mois',
      promo: '9,99€ le 1er mois',
      badge: null,
      highlight: false
    },
    {
      id: '3_months',
      months: 3,
      title: '3 Mois',
      price: '34,99€',
      monthlyPrice: '11,66€/mois',
      promo: null,
      badge: '-22%',
      highlight: false
    },
    {
      id: '6_months',
      months: 6,
      title: '6 Mois',
      price: '59,99€',
      monthlyPrice: '10,00€/mois',
      promo: null,
      badge: '-33%',
      highlight: true
    }
  ];

  const benefits = [
    "Messages et interactions illimités",
    "Découverte de tous les profils vérifiés",
    "Filtres de recherche avancés",
    "Badge premium sur ton profil",
    "Accès au Coach IA Wétali"
  ];

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    // Simulation d'un délai de traitement de paiement
    setTimeout(async () => {
      const tier = tiers.find(t => t.id === selectedTier);
      if (tier) {
        await updateSubscription(tier.id, tier.months);
        showToast("Paiement validé ! Bienvenue sur Wétali Premium.", "success");
        setIsProcessing(false);
        setCurrentView('home');
      }
    }, 2000);
  };

  const isSenegal = userProfile?.pays === 'Sénégal';

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center py-10 px-4 sm:px-6">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-center mb-8">
        <WeddingRingLogo size="lg" />
      </div>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Presentation */}
        <div className="w-full md:w-5/12 bg-[#0A2F4A] text-white p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Trouve ta moitié dans le respect de nos valeurs.
            </h1>
            <p className="text-[#A0C0D6] text-sm sm:text-base mb-8">
              Active ton abonnement pour débloquer l'accès complet à la communauté Wétali et interagir avec des profils sérieux.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#2D8659]/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#2D8659]" />
                  </div>
                  <span className="text-sm font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 flex items-start gap-3 mt-4">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
            <p className="text-xs text-[#A0C0D6] leading-relaxed">
              Nous demandons un abonnement pour garantir une communauté sérieuse, engagée et filtrer les faux profils.
            </p>
          </div>
        </div>

        {/* Right Side: Selection & Payment */}
        <div className="w-full md:w-7/12 p-8 sm:p-10 flex flex-col">
          
          <h2 className="text-xl font-bold text-[#0A2F4A] mb-6 flex items-center gap-2">
            Choisis ton forfait
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          </h2>

          {/* Pricing Cards */}
          <div className="space-y-4 mb-8">
            {tiers.map((tier) => (
              <label 
                key={tier.id}
                className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedTier === tier.id 
                    ? tier.highlight 
                      ? 'border-[#D4AF37] bg-[#FFFBF0]' 
                      : 'border-[#2D8659] bg-[#EAF5EF]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {/* Radio Circle */}
                <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mr-4 ${
                  selectedTier === tier.id 
                    ? tier.highlight ? 'border-[#D4AF37]' : 'border-[#2D8659]' 
                    : 'border-slate-300'
                }`}>
                  {selectedTier === tier.id && (
                    <div className={`w-2.5 h-2.5 rounded-full ${tier.highlight ? 'bg-[#D4AF37]' : 'bg-[#2D8659]'}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{tier.title}</span>
                    {tier.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tier.highlight ? 'bg-[#D4AF37] text-white' : 'bg-[#2D8659]/10 text-[#2D8659]'
                      }`}>
                        {tier.badge}
                      </span>
                    )}
                    {tier.highlight && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white ml-auto">
                        Recommandé
                      </span>
                    )}
                  </div>
                  
                  {tier.promo ? (
                    <div className="text-sm text-slate-500 mt-0.5">
                      <span className="line-through mr-1.5">{tier.price}</span> 
                      <span className="text-[#2D8659] font-bold">{tier.promo}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 mt-0.5">{tier.monthlyPrice}</div>
                  )}
                </div>

                {/* Price Display */}
                <div className="text-right ml-4">
                  <span className="text-lg font-bold text-[#0A2F4A]">{tier.price}</span>
                </div>
              </label>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Moyen de paiement</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'card' ? 'border-[#0A2F4A] bg-slate-50 ring-1 ring-[#0A2F4A]' : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                }`}
              >
                <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-[#0A2F4A]' : ''}`} />
                <span className={`text-xs font-semibold ${paymentMethod === 'card' ? 'text-[#0A2F4A]' : ''}`}>Carte Bancaire</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_google')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'apple_google' ? 'border-[#0A2F4A] bg-slate-50 ring-1 ring-[#0A2F4A]' : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                }`}
              >
                <Smartphone className={`w-6 h-6 ${paymentMethod === 'apple_google' ? 'text-[#0A2F4A]' : ''}`} />
                <span className={`text-xs font-semibold ${paymentMethod === 'apple_google' ? 'text-[#0A2F4A]' : ''}`}>Apple/Google Pay</span>
              </button>
              
              {isSenegal && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mobile_money')}
                  className={`col-span-2 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'mobile_money' ? 'border-[#ff7900] bg-[#fff5ec] ring-1 ring-[#ff7900]' : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <Smartphone className={`w-5 h-5 ${paymentMethod === 'mobile_money' ? 'text-[#ff7900]' : ''}`} />
                  <span className={`text-xs font-semibold ${paymentMethod === 'mobile_money' ? 'text-[#ff7900]' : ''}`}>Mobile Money (Orange/Wave)</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#c4a133] text-white font-bold text-lg shadow-lg shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Payer de manière sécurisée
                </>
              )}
            </button>
            <div className="mt-4 space-y-1 text-center">
              <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#2D8659]" /> Annulable à tout moment
              </p>
              <p className="text-[10px] text-slate-400">
                Sans engagement, tu gardes tes avantages jusqu'à la fin de la période payée. Renouvellement automatique.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
