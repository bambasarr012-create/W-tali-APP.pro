import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Check, ShieldCheck, Lock, Smartphone, CreditCard, Sparkles, ChevronRight, Zap, Heart, Eye, Crown } from 'lucide-react';
import WeddingRingLogo from '../common/WeddingRingLogo';

export default function SubscriptionPage() {
  const { userProfile, updateSubscription, isPremium } = useAuth();
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

  const premiumFeatures = [
    {
      icon: <Eye className="w-6 h-6 text-[#D4AF37]" />,
      title: "Voir qui t'a visité",
      desc: "Découvre qui s'intéresse à ton profil et prends l'initiative.",
      badge: "Inclus"
    },
    {
      icon: <Zap className="w-6 h-6 text-[#D4AF37]" />,
      title: "Le Message Flash",
      desc: "Présente-toi avec un message personnalisé avant même l'acceptation.",
      badge: "Inclus"
    },
    {
      icon: <Heart className="w-6 h-6 text-[#D4AF37]" />,
      title: "Demandes illimitées",
      desc: "Ne sois plus limité à 3 demandes par jour. Contacte qui tu veux.",
      badge: "Inclus"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />,
      title: "Profil vérifié prioritaire",
      desc: "Ton profil apparaît en haut des recherches pour les autres membres.",
      badge: "Inclus"
    },
    {
      icon: <Crown className="w-6 h-6 text-[#D4AF37]" />,
      title: "Badge Premium",
      desc: "Affiche ton sérieux avec le badge doré sur ton profil.",
      badge: "Inclus"
    }
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

  if (isPremium) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center animate-fadeIn">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#0A2F4A] mb-4">
            Vous êtes membre Premium !
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Profitez de tous vos avantages Wétali en illimité : messages, découverte de profils sans restriction et badge de confiance.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl mb-8 border border-slate-100 text-sm font-medium text-slate-700">
            Abonnement Actif jusqu'au : <br/>
            <span className="text-[#2D8659] text-lg font-bold">
              {userProfile?.subscriptionEnd ? new Date(userProfile.subscriptionEnd).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Illimité'}
            </span>
          </div>
          <button 
            onClick={() => setCurrentView('home')}
            className="w-full py-4 rounded-2xl bg-[#0A2F4A] hover:bg-[#062033] text-white font-bold text-base shadow-lg transition-all"
          >
            Retourner aux profils
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 font-sans animate-fadeIn">
      
      {/* Header / Hero */}
      <div className="bg-[#0A2F4A] pt-12 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D4AF37]/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="mb-6 bg-white/10 p-3 rounded-2xl backdrop-blur-md">
            <WeddingRingLogo size="lg" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
            {userProfile?.prenom ? `${userProfile.prenom}, ta` : 'Ta'} future moitié t'attend. <br className="hidden md:block"/>
            <span className="text-[#D4AF37]">Ne la rate pas.</span>
          </h1>
          <p className="text-[#A0C0D6] text-sm md:text-base max-w-lg mx-auto">
            Passe Premium et débloque toutes les fonctionnalités pour multiplier tes chances de rencontre dès aujourd'hui.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#0A2F4A]/5 border border-slate-100 p-5 md:p-6 grid grid-cols-3 gap-2 md:gap-4 divide-x divide-slate-100">
          <div className="text-center px-2">
            <div className="text-xl md:text-3xl font-bold text-[#D4AF37]">3x</div>
            <div className="text-[9px] md:text-xs font-bold text-slate-500 uppercase mt-1">Plus de succès</div>
          </div>
          <div className="text-center px-2">
            <div className="text-xl md:text-3xl font-bold text-[#D4AF37]">100%</div>
            <div className="text-[9px] md:text-xs font-bold text-slate-500 uppercase mt-1">Profils vérifiés</div>
          </div>
          <div className="text-center px-2">
            <div className="text-xl md:text-3xl font-bold text-[#D4AF37]">illimité</div>
            <div className="text-[9px] md:text-xs font-bold text-slate-500 uppercase mt-1">Interactions</div>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="max-w-2xl mx-auto px-4 mt-16 mb-16">
        <div className="text-center mb-10">
          <div className="inline-block bg-[#FFFBF0] text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 border border-[#D4AF37]/30">
            Avantages Exclusifs
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0A2F4A]">Ce que Premium débloque pour toi</h2>
        </div>
        
        <div className="space-y-4">
          {premiumFeatures.map((feat, idx) => (
            <div key={idx} className="bg-[#F8FAFC] border border-slate-200 rounded-3xl p-5 md:p-6 flex items-start gap-4 hover:border-[#D4AF37]/50 hover:bg-[#FFFBF0]/50 transition-colors shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                {feat.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="font-bold text-[#0A2F4A] text-base">{feat.title}</h3>
                  <span className="text-[9px] md:text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded-md uppercase">
                    {feat.badge}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-[#FFFBF0] border-2 border-[#D4AF37]/30 rounded-[2.5rem] p-6 md:p-10 shadow-lg shadow-[#D4AF37]/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="text-center mb-8 relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A2F4A] flex items-center justify-center gap-3">
              Choisis ton forfait <Crown className="w-6 h-6 text-[#D4AF37]" />
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-medium">Investis dans ta recherche, annule quand tu veux.</p>
          </div>

          <div className="space-y-4 mb-8 relative z-10">
            {tiers.map((tier) => (
              <label 
                key={tier.id}
                className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedTier === tier.id 
                    ? 'border-[#D4AF37] bg-white shadow-md'
                    : 'border-white bg-white/50 hover:bg-white'
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {/* Radio Circle */}
                <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-4 transition-colors ${
                  selectedTier === tier.id 
                    ? 'border-[#D4AF37]' 
                    : 'border-slate-300'
                }`}>
                  {selectedTier === tier.id && (
                    <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-base md:text-lg">{tier.title}</span>
                    {tier.highlight && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500 text-white ml-2 uppercase tracking-wider">
                        Recommandé
                      </span>
                    )}
                  </div>
                  
                  {tier.promo ? (
                    <div className="text-sm text-slate-500 mt-1">
                      <span className="line-through mr-2 text-slate-400">{tier.price}</span> 
                      <span className="text-[#D4AF37] font-bold">{tier.promo}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 mt-1 font-medium">{tier.monthlyPrice}</div>
                  )}
                </div>

                {/* Price Display */}
                <div className="text-right ml-4">
                  <span className={`text-xl md:text-2xl font-bold ${selectedTier === tier.id ? 'text-[#0A2F4A]' : 'text-slate-600'}`}>
                    {tier.price}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div className="mb-8 relative z-10">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-4">Mode de paiement sécurisé</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${
                  paymentMethod === 'card' ? 'border-[#0A2F4A] bg-white shadow-sm ring-1 ring-[#0A2F4A]' : 'border-white bg-white/50 hover:bg-white text-slate-500'
                }`}
              >
                <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-[#0A2F4A]' : ''}`} />
                <span className={`text-xs font-bold ${paymentMethod === 'card' ? 'text-[#0A2F4A]' : ''}`}>Carte Bancaire</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_google')}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${
                  paymentMethod === 'apple_google' ? 'border-[#0A2F4A] bg-white shadow-sm ring-1 ring-[#0A2F4A]' : 'border-white bg-white/50 hover:bg-white text-slate-500'
                }`}
              >
                <Smartphone className={`w-6 h-6 ${paymentMethod === 'apple_google' ? 'text-[#0A2F4A]' : ''}`} />
                <span className={`text-xs font-bold ${paymentMethod === 'apple_google' ? 'text-[#0A2F4A]' : ''}`}>Apple/Google Pay</span>
              </button>
              
              {isSenegal && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mobile_money')}
                  className={`col-span-2 p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all ${
                    paymentMethod === 'mobile_money' ? 'border-[#ff7900] bg-white shadow-sm ring-1 ring-[#ff7900]' : 'border-white bg-white/50 hover:bg-white text-slate-500'
                  }`}
                >
                  <Smartphone className={`w-6 h-6 ${paymentMethod === 'mobile_money' ? 'text-[#ff7900]' : ''}`} />
                  <span className={`text-sm font-bold ${paymentMethod === 'mobile_money' ? 'text-[#ff7900]' : ''}`}>Mobile Money (Orange/Wave)</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 relative z-10">
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full py-4 md:py-5 rounded-2xl bg-[#D4AF37] hover:bg-[#c4a133] text-white font-bold text-lg md:text-xl shadow-xl shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Traitement sécurisé...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Payer de manière sécurisée
                </>
              )}
            </button>
            <div className="mt-5 space-y-2 text-center">
              <p className="text-xs md:text-sm text-slate-600 font-bold flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2D8659]" /> 100% sécurisé, annulation garantie
              </p>
              <p className="text-[10px] md:text-xs text-slate-400 max-w-sm mx-auto">
                Sans engagement, tu gardes tes avantages jusqu'à la fin de la période payée. Renouvellement automatique désactivable en 1 clic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
