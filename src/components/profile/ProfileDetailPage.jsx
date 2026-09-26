import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { calculatePointsCommuns, checkRelationshipStatus, acceptRequest, rejectRequest } from '../../services/firestoreService';
import VerifiedBadge from '../common/VerifiedBadge';
import ReportModal from '../common/ReportModal';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  CalendarCheck, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Tag,
  Flag,
  MessageCircle,
  Clock,
  Check,
  X
} from 'lucide-react';

export default function ProfileDetailPage() {
  const { selectedProfile, setCurrentView, openSendRequestModal, openChatWithMatch, showToast, refreshCounts } = useApp();
  const { userProfile } = useAuth();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isReporting, setIsReporting] = useState(false);
  const [relStatus, setRelStatus] = useState({ status: 'loading', data: null });

  React.useEffect(() => {
    if (userProfile && selectedProfile) {
      setRelStatus({ status: 'loading', data: null });
      checkRelationshipStatus(userProfile.id, selectedProfile.id).then(res => {
        setRelStatus({ status: res.status, data: res });
      });
    }
  }, [userProfile, selectedProfile]);

  const handleAcceptRequest = async () => {
    if (!relStatus.data?.request?.id) return;
    try {
      const newMatch = await acceptRequest(relStatus.data.request.id, userProfile);
      showToast("Félicitations ! Demande acceptée.", "success");
      refreshCounts();
      openChatWithMatch(newMatch);
    } catch (e) {
      showToast("Erreur lors de l'acceptation.", "error");
    }
  };

  const handleRejectRequest = async () => {
    if (!relStatus.data?.request?.id) return;
    try {
      await rejectRequest(relStatus.data.request.id);
      showToast("Demande déclinée avec respect.", "info");
      refreshCounts();
      setCurrentView('requests');
    } catch (e) {
      showToast("Erreur lors du refus.", "error");
    }
  };

  const renderActionButton = (baseClassName) => {
    const defaultClasses = "px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 " + baseClassName;
    
    if (relStatus.status === 'loading') {
      return (
        <button disabled className={`${defaultClasses} bg-slate-100 text-slate-500 cursor-not-allowed`}>
          <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
          <span>Chargement...</span>
        </button>
      );
    }
    if (relStatus.status === 'matched') {
      return (
        <button onClick={() => openChatWithMatch(relStatus.data.match)} className={`${defaultClasses} bg-[#0A2F4A] hover:bg-[#062033] text-white shadow-md`}>
          <MessageCircle className="w-4 h-4" />
          <span>Envoyer un message</span>
        </button>
      );
    }
    if (relStatus.status === 'request_sent') {
      return (
        <button disabled className={`${defaultClasses} bg-amber-100 text-amber-800 cursor-not-allowed`}>
          <Clock className="w-4 h-4" />
          <span>Demande en attente</span>
        </button>
      );
    }
    if (relStatus.status === 'request_received') {
      return (
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={handleRejectRequest} className="flex-1 sm:flex-none px-4 py-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all flex justify-center items-center gap-1.5">
            <X className="w-4 h-4" />
            <span>Refuser</span>
          </button>
          <button onClick={handleAcceptRequest} className={`${defaultClasses.replace('w-full', 'flex-1 sm:flex-none')} bg-[#2D8659] hover:bg-[#236c47] text-white shadow-md`}>
            <Check className="w-4 h-4" />
            <span>Accepter</span>
          </button>
        </div>
      );
    }
    return (
      <button onClick={() => openSendRequestModal(selectedProfile)} className={`${defaultClasses} bg-[#2D8659] hover:bg-[#236c47] text-white shadow-md`}>
        <Heart className="w-4 h-4 fill-white" />
        <span>Envoyer une demande</span>
      </button>
    );
  };


  if (!selectedProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">Aucun profil sélectionné.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-4 py-2 bg-[#2D8659] text-white rounded-xl font-bold text-xs"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const photos = selectedProfile.photos && selectedProfile.photos.length > 0 
    ? selectedProfile.photos 
    : ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"];

  const affinity = calculatePointsCommuns(userProfile, selectedProfile);

  const nextPhoto = () => {
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6">
      
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('home')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#0A2F4A] hover:text-[#2D8659] bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux profils</span>
      </button>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md">
        
        {/* Photos Carousel */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full bg-slate-900 overflow-hidden">
          <img
            src={photos[photoIndex]}
            alt={`${selectedProfile.prenom} - Photo ${photoIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Carousel Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-sm transition-all"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-sm transition-all"
                aria-label="Photo suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Bottom Dots Indicator */}
          {photos.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPhotoIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    photoIndex === idx ? 'w-6 bg-[#2D8659]' : 'w-2 bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-4 inset-x-4 flex justify-between items-center">
            <span className="inline-flex items-center gap-1.5 bg-[#0A2F4A]/85 backdrop-blur-md text-[#D4AF37] text-xs font-bold px-3 py-1.5 rounded-full border border-[#D4AF37]/40 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Profil Vérifié KYC</span>
            </span>

            <span className="inline-flex items-center gap-1.5 bg-[#2D8659] text-white text-xs font-mono font-bold px-3 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{affinity.score}% Affinité</span>
            </span>
          </div>
        </div>

        {/* Thumbnails Row (Farata style diaporama) */}
        <div className="px-5 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xs font-bold text-[#0A2F4A]">Photos ({photos.length})</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setPhotoIndex(idx)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  photoIndex === idx ? 'border-[#D4AF37] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={photo} alt={`Miniature ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
            {/* Empty placeholders to match Farata's look */}
            {[...Array(Math.max(0, 5 - photos.length))].map((_, i) => (
              <div key={`empty-${i}`} className="flex-shrink-0 w-16 h-16 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                <span className="text-slate-300 text-xs">vide</span>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Title & Location */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#0A2F4A] flex items-center gap-3">
                  <span>{selectedProfile.prenom}, {selectedProfile.age} ans</span>
                  {selectedProfile.profileStatus === 'verified' && <VerifiedBadge size="lg" />}
                </h1>
                <button 
                  onClick={() => setIsReporting(true)}
                  className="sm:hidden p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                  title="Signaler ce profil"
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium mt-1">
                <span className="flex items-center gap-1 text-[#2D8659] font-semibold">
                  <MapPin className="w-4 h-4" />
                  {selectedProfile.ville} {selectedProfile.pays ? `(${selectedProfile.pays})` : ''}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                  {selectedProfile.profession}
                </span>
              </div>
            </div>

            {/* Quick Action Button & Desktop Report */}
            <div className="flex items-center gap-2">
              {renderActionButton("flex-1 sm:flex-none")}
              <button 
                onClick={() => setIsReporting(true)}
                className="hidden sm:flex p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-2xl transition-colors shadow-sm"
                title="Signaler ce profil"
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION POINTS COMMUNS (Ce qui match)                         */}
          {/* ============================================================ */}
          <div className="bg-gradient-to-br from-[#EAF5EF] to-[#F4F9F6] border-2 border-[#2D8659]/30 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#2D8659] font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>POINTS COMMUNS AVEC VOTRE PROFIL</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#0A2F4A] bg-white px-2.5 py-1 rounded-full border border-[#2D8659]/30">
                Score : {affinity.score}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {affinity.points.map((pt, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-[#2D8659]/20 text-xs text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#2D8659] flex-shrink-0" />
                  <span>{pt.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Ma vision du mariage */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]"></div>
            <h3 className="font-bold text-[#0A2F4A] flex items-center gap-2">
              <span className="text-xl">💍</span>
              Ma vision du mariage
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {selectedProfile.bio ? selectedProfile.bio : `Je recherche un mariage basé sur le respect mutuel, la complicité et nos valeurs communes. Je souhaite fonder un foyer stable, où la communication et le soutien sont au centre de la relation. (${selectedProfile.visionMariageLabel || 'Court terme'})`}
            </p>
          </div>

          {/* Card: Ce que je recherche */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#2D8659]"></div>
            <h3 className="font-bold text-[#0A2F4A] flex items-center gap-2">
              <span className="text-xl">👤</span>
              Ce que je recherche
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {selectedProfile.criteres && selectedProfile.criteres.length > 0 
                ? `Une personne sincère et bienveillante, qui partage mes critères : ${selectedProfile.criteres.join(', ')}.`
                : "Une personne sincère, pratiquante et bienveillante, avec qui construire un équilibre dans la foi. Quelqu'un d'ambitieux dans sa vie comme dans son dîn, qui valorise la communication et avec qui je pourrai évoluer pas à pas."}
            </p>
          </div>

          {/* Card: Projet de vie */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#0A2F4A]"></div>
            <h3 className="font-bold text-[#0A2F4A] flex items-center gap-2 mb-2">
              <span className="text-xl">🏠</span>
              Projet de vie
            </h3>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dahira / Repère</span>
                <span className="text-sm font-semibold text-slate-800">{selectedProfile.dahira || 'Non spécifié'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Finance dans le couple</span>
                <span className="text-sm font-semibold text-slate-800">{selectedProfile.financeCouple || 'À discuter'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Polygamie</span>
                <span className="text-sm font-semibold text-slate-800">{selectedProfile.polygamie || 'Non'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Déménagement</span>
                <span className="text-sm font-semibold text-slate-800">Ouvert(e)</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Niveau d'études</span>
                <span className="text-sm font-semibold text-slate-800">{selectedProfile.etudes || 'Non spécifié'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Centres d'intérêt</span>
                <span className="text-sm font-semibold text-slate-800">
                  {selectedProfile.interets && selectedProfile.interets.length > 0 
                    ? selectedProfile.interets.slice(0, 2).join(', ') 
                    : 'Divers'}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Critères rédhibitoires */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
            <h3 className="font-bold text-[#0A2F4A] flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              Critères rédhibitoires
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              Le manque de respect, le manque d'honnêteté et l'incapacité à communiquer de manière constructive. La violence physique ou verbale est totalement exclue.
            </p>
          </div>

          {/* Bottom Call to Action Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-medium">
              {relStatus.status === 'none' && "Envoyez une salutation respectueuse pour entamer le dialogue."}
              {relStatus.status === 'request_sent' && "Votre demande est en attente de réponse."}
              {relStatus.status === 'request_received' && "Cette personne souhaite faire votre connaissance."}
              {relStatus.status === 'matched' && "Vous pouvez discuter avec cette personne."}
            </div>
            {renderActionButton("w-full sm:w-auto px-8 py-3.5")}
          </div>

        </div>

      </div>

      {isReporting && (
        <ReportModal 
          reportedUserId={selectedProfile.id}
          contentType="profile"
          onClose={() => setIsReporting(false)}
        />
      )}

    </div>
  );
}
