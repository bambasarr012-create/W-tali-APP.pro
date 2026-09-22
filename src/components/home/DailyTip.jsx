import React, { useState, useEffect } from 'react';
import { Lightbulb, Star, X } from 'lucide-react';
import { getReceivedRequests } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';

const STATIC_TIPS = [
  "Un profil avec une bio complète reçoit bien plus de demandes.",
  "Ajoute au moins une photo claire et récente pour inspirer confiance.",
  "Prends le temps de lire un profil avant d'envoyer une demande.",
  "La sincérité dans ta présentation attire des profils plus sérieux.",
  "Réponds rapidement aux demandes pour montrer ton implication.",
  "Garde l'esprit ouvert : parfois l'évidence ne saute pas aux yeux tout de suite.",
  "Un profil détaillé facilite grandement les premiers échanges.",
  "N'hésite pas à préciser ta vision du mariage dans ta bio.",
  "La courtoisie et le respect sont la clé de toute belle rencontre.",
  "Mets en avant tes passions, cela crée des points communs.",
  "Sois authentique : la vraie connexion naît de la transparence.",
  "Prends l'initiative d'engager la conversation après un match.",
  "Un petit mot personnalisé avec ta demande fait toute la différence.",
  "Fais vérifier ton profil pour augmenter ton taux de réponse.",
  "La patience est essentielle dans la recherche du bon partenaire."
];

export default function DailyTip() {
  const { userProfile } = useAuth();
  const [tipData, setTipData] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if dismissed today in this session
    const dismissedDate = sessionStorage.getItem('wetali_tip_dismissed');
    if (dismissedDate === new Date().toDateString()) {
      setIsVisible(false);
      return;
    }

    const determineTip = async () => {
      if (!userProfile) return;

      // 1. Check pending requests
      try {
        const received = await getReceivedRequests(userProfile.id);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const oldRequestsCount = received.filter(req => {
          // Compatibility for Firestore Timestamps or ISO strings
          const reqDate = req.createdAt?.toDate ? req.createdAt.toDate() : new Date(req.createdAt);
          return reqDate < threeDaysAgo;
        }).length;

        if (oldRequestsCount > 0) {
          setTipData({
            type: 'reminder',
            text: `Tu as ${oldRequestsCount} demande(s) en attente depuis plusieurs jours, pense à y répondre.`,
            icon: <Star className="w-5 h-5 text-wetaliGold" />
          });
          return;
        }
      } catch (e) {
        console.error("Failed to load requests for daily tip:", e);
      }

      // 2. Check incomplete profile
      if (!userProfile.photos || userProfile.photos.length === 0 || !userProfile.bio) {
        setTipData({
          type: 'reminder',
          text: "Ton profil est incomplet, ajoute une photo ou remplis ta bio pour tripler tes chances de match.",
          icon: <Star className="w-5 h-5 text-wetaliGold" />
        });
        return;
      }

      // 3. Static Tip of the day based on user ID and date
      const dateString = new Date().toDateString();
      const hashString = userProfile.id + dateString;
      let hash = 0;
      for (let i = 0; i < hashString.length; i++) {
        hash = hashString.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % STATIC_TIPS.length;
      
      setTipData({
        type: 'tip',
        text: STATIC_TIPS[index],
        icon: <Lightbulb className="w-5 h-5 text-wetaliBlue" />
      });
    };

    determineTip();
  }, [userProfile]);

  if (!isVisible || !tipData) return null;

  const handleClose = () => {
    sessionStorage.setItem('wetali_tip_dismissed', new Date().toDateString());
    setIsVisible(false);
  };

  return (
    <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-100 flex items-start gap-4 relative overflow-hidden transition-all duration-300">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tipData.type === 'reminder' ? 'bg-wetaliGold/10' : 'bg-wetaliBlue/10'}`}>
        {tipData.icon}
      </div>
      
      <div className="flex-1 pr-8">
        <h3 className="text-sm font-bold text-slate-800 mb-1">
          {tipData.type === 'reminder' ? 'Rappel' : 'Conseil du jour'}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {tipData.text}
        </p>
      </div>

      <button 
        onClick={handleClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Masquer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Decorative accent */}
      <div className={`absolute top-0 left-0 w-1 h-full ${tipData.type === 'reminder' ? 'bg-wetaliGold' : 'bg-wetaliBlue'}`}></div>
    </div>
  );
}
