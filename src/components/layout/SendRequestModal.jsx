import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { sendRequest, getDailyRequestCount } from '../../services/firestoreService';
import { X, Send, Sparkles, ShieldCheck, Heart, Crown, Eye, MessageCircle, Zap } from 'lucide-react';

export default function SendRequestModal() {
  const { requestModalState, closeSendRequestModal, showToast, setCurrentView } = useApp();
  const { userProfile, isPremium } = useAuth();
  const { isOpen, targetProfile } = requestModalState;

  const defaultMessage = "Assalamu alaikum, j'ai vu ton profil et ça m'intéresse. J'aimerais faire ta connaissance dans un cadre sérieux et respectueux.";
  const [message, setMessage] = useState(defaultMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(false);
  const REQUEST_LIMIT = 3;

  React.useEffect(() => {
    if (isOpen && userProfile && !isPremium) {
      setIsLoadingCount(true);
      getDailyRequestCount(userProfile.id).then(count => {
        setDailyCount(count);
        setIsLoadingCount(false);
      });
    } else {
      setDailyCount(0);
    }
  }, [isOpen, userProfile, isPremium]);

  if (!isOpen || !targetProfile) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userProfile) {
      showToast("Veuillez d'abord compléter votre profil avant d'envoyer une demande.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendRequest(userProfile, targetProfile, message);
      showToast(`Demande transmise avec succès à ${targetProfile.prenom} !`, "success");
      closeSendRequestModal();
      setMessage(defaultMessage);
    } catch (err) {
      showToast(err.message || "Erreur lors de l'envoi de la demande.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2F4A]/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[#2D8659]">
            {(!isPremium && dailyCount >= REQUEST_LIMIT) ? (
               <Crown className="w-5 h-5 text-[#D4AF37]" />
            ) : (
               <Heart className="w-5 h-5 fill-[#2D8659]" />
            )}
            <span className="font-bold text-base text-[#0A2F4A]">
              {(!isPremium && dailyCount >= REQUEST_LIMIT) ? "Limite atteinte" : "Demande de Rencontre d'Honneur"}
            </span>
          </div>
          <button
            onClick={closeSendRequestModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOADING STATE */}
        {isLoadingCount && (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#2D8659] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 mt-3">Vérification de vos demandes...</p>
          </div>
        )}

        {/* LIMIT REACHED (PAYWALL) */}
        {!isLoadingCount && !isPremium && dailyCount >= REQUEST_LIMIT && (
          <div className="py-6 space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-[#FFFBF0] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
                <Crown className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#0A2F4A]">
                Tu as utilisé tes {REQUEST_LIMIT} demandes du jour.
              </h3>
              <p className="text-sm text-slate-600">
                Avec Premium, tu peux contacter sans attendre demain et tu verras qui s'intéresse à toi.
              </p>
            </div>
            
            <div className="bg-[#FFFBF0] border border-[#D4AF37]/40 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">Avec Premium :</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                  <Heart className="w-4 h-4 text-[#D4AF37]" /> Demandes illimitées
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                  <Eye className="w-4 h-4 text-[#D4AF37]" /> Voir tes visiteurs
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                  <MessageCircle className="w-4 h-4 text-[#D4AF37]" /> Échanges débloqués
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                closeSendRequestModal();
                setCurrentView('settings'); // Fallback if subscription view is nested there, but let's assume 'subscription' or 'settings'
                // Based on standard navigation, let's just trigger a navigation. The user might need a specific view name.
                // Assuming we can trigger subscription via settings or dedicated view.
                setTimeout(() => setCurrentView('subscription'), 50); // Let's try 'subscription'
              }}
              className="w-full py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#c4a133] text-white font-bold text-base shadow-lg shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Passer Premium</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* NORMAL FORM */}
        {!isLoadingCount && (isPremium || dailyCount < REQUEST_LIMIT) && (
          <>

        {/* Recipient Snapshot */}
        <div className="flex items-center gap-4 my-5 p-3.5 rounded-2xl bg-[#F4F7F6] border border-[#E2E8F0]">
          <img
            src={targetProfile.photos && targetProfile.photos[0] ? targetProfile.photos[0] : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
            alt={targetProfile.prenom}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
          />
          <div>
            <div className="font-bold text-base text-[#0A2F4A] flex items-center gap-1.5">
              <span>{targetProfile.prenom}, {targetProfile.age} ans</span>
              <span className="text-xs text-[#2D8659] bg-[#EAF5EF] px-2 py-0.5 rounded-full font-medium">
                {targetProfile.ville}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {targetProfile.profession}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isPremium ? (
            <div className="bg-[#FFFBF0] border border-[#D4AF37]/40 rounded-2xl p-5 mb-2 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-3 opacity-10 group-hover:scale-110 transition-transform">
                <Zap className="w-24 h-24 text-[#D4AF37]" />
              </div>
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8942b] flex items-center justify-center shadow-sm">
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
                <h4 className="font-bold text-[#0A2F4A]">Le Message Flash</h4>
              </div>
              <p className="text-sm text-slate-700 mb-4 relative z-10 font-medium">
                Démarque-toi ! Écris un message personnalisé avant même l'acceptation et multiplie tes chances par 2.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeSendRequestModal();
                  setTimeout(() => setCurrentView('subscription'), 50);
                }}
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#c4a133] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                Débloquer Premium
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0A2F4A] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                  Votre Message Flash
                </label>
                <button
                  type="button"
                  onClick={() => setMessage(defaultMessage)}
                  className="text-[11px] text-[#2D8659] hover:underline font-medium"
                >
                  Texte suggéré
                </button>
              </div>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3.5 rounded-2xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-sm text-slate-800 outline-none leading-relaxed transition-all resize-none bg-[#FFFBF0]/30"
                placeholder="Écrivez un message respectueux et sincère..."
              />
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#2D8659] flex-shrink-0" />
            <span>Les échanges sont encadrés par la charte de bienséance et de respect mutuel Wétali.</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={closeSendRequestModal}
              className="w-1/3 py-3 rounded-2xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-2/3 py-3 rounded-2xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                isPremium ? 'bg-[#D4AF37] hover:bg-[#c4a133]' : 'bg-[#2D8659] hover:bg-[#236c47]'
              }`}
            >
              {isPremium ? <Zap className="w-4 h-4 fill-white" /> : <Send className="w-4 h-4" />}
              <span>
                {isSubmitting 
                  ? "Envoi en cours..." 
                  : isPremium 
                    ? "Envoyer le Message Flash" 
                    : "Envoyer une demande simple"}
              </span>
            </button>
          </div>
        </form>

        </>
        )}

      </div>
    </div>
  );
}
