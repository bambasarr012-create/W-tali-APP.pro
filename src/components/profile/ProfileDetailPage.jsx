import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { calculatePointsCommuns, checkRelationshipStatus, acceptRequest, rejectRequest } from '../../services/firestoreService';
import VerifiedBadge from '../common/VerifiedBadge';
import ReportModal from '../common/ReportModal';
import { 
  ArrowLeft, 
  MapPin, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  User,
  MessageCircle,
  Clock,
  X,
  Camera,
  Flag,
  BookOpen,
  Info
} from 'lucide-react';

export default function ProfileDetailPage() {
  const { selectedProfile, setCurrentView, openSendRequestModal, openChatWithMatch, showToast, refreshCounts } = useApp();
  const { userProfile } = useAuth();
  const [isReporting, setIsReporting] = useState(false);
  const [relStatus, setRelStatus] = useState({ status: 'loading', data: null });
  const isOwnProfile = userProfile?.id === selectedProfile?.id;

  React.useEffect(() => {
    if (userProfile && selectedProfile && !isOwnProfile) {
      setRelStatus({ status: 'loading', data: null });
      checkRelationshipStatus(userProfile.id, selectedProfile.id).then(res => {
        setRelStatus({ status: res.status, data: res });
      });
    } else if (isOwnProfile) {
      setRelStatus({ status: 'own_profile', data: null });
    }
  }, [userProfile, selectedProfile, isOwnProfile]);

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

  if (!selectedProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">Aucun profil sélectionné.</p>
        <button onClick={() => setCurrentView('home')} className="mt-4 px-4 py-2 bg-[#2D8659] text-white rounded-xl font-bold text-xs">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const photoUrl = selectedProfile.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button onClick={() => setCurrentView('home')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-slate-600 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Main Card (Farata Style) */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative">
        
        {/* Hero Image Section */}
        <div className="relative h-[450px] w-full">
          <img src={photoUrl} alt={selectedProfile.prenom} className="w-full h-full object-cover" />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

          {/* Profile Basic Info on Image */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <h1 className="font-serif font-bold text-3xl flex items-center gap-2">
              {selectedProfile.prenom}, {selectedProfile.age}
              {selectedProfile.profileStatus === 'verified' && <VerifiedBadge size="md" />}
            </h1>
            <div className="flex items-center gap-1.5 text-sm font-medium text-white/90">
              <MapPin className="w-4 h-4" />
              {selectedProfile.ville}, {selectedProfile.pays || 'Sénégal'}
            </div>
            
            {/* Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {selectedProfile.etatCivil && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wide border border-white/30 flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {selectedProfile.etatCivil}
                </span>
              )}
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wide border border-white/30 flex items-center gap-1">
                <User className="w-3 h-3" />
                En recherche
              </span>
            </div>
          </div>
        </div>

        {/* Details Content Section */}
        <div className="p-6 sm:p-8 space-y-8 bg-white">
          
          {/* Vision du Mariage */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-[11px] font-black text-[#2D8659] uppercase tracking-widest">
              <Heart className="w-4 h-4" /> Ma vision du mariage
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {selectedProfile.bio || "Je recherche une relation sérieuse basée sur le respect mutuel, la complicité et nos valeurs communes. Je souhaite fonder un foyer stable, où la communication est au centre."}
            </p>
          </div>

          {/* Ce que je recherche */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-[11px] font-black text-[#2D8659] uppercase tracking-widest">
              <User className="w-4 h-4" /> Ce que je recherche
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {selectedProfile.rechercheText || "Une personne engagée, pratiquante et qui veut avancer de manière saine et bienveillante."}
            </p>
          </div>

          {/* Centres d'intérêt */}
          {(selectedProfile.interets?.length > 0) && (
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-[11px] font-black text-[#2D8659] uppercase tracking-widest">
                <Sparkles className="w-4 h-4" /> Centres d'intérêt
              </h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {selectedProfile.interets.join(', ')}
              </p>
            </div>
          )}

          {/* Qualités */}
          {(selectedProfile.valeurs?.length > 0) && (
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-[11px] font-black text-[#2D8659] uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" /> Mes valeurs
              </h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {selectedProfile.valeurs.join(', ')}
              </p>
            </div>
          )}

          {/* Informations (Grid style like Farata) */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-[11px] font-black text-[#2D8659] uppercase tracking-widest">
              <Info className="w-4 h-4" /> Informations
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Profession</p>
                <p className="text-xs font-semibold text-slate-700">{selectedProfile.profession || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Éducation</p>
                <p className="text-xs font-semibold text-slate-700">{selectedProfile.etudes || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Pratique religieuse</p>
                <p className="text-xs font-semibold text-slate-700">{selectedProfile.pratiqueReligieuse || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Taille</p>
                <p className="text-xs font-semibold text-slate-700">{selectedProfile.taille ? `${selectedProfile.taille} cm` : 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Finance du couple</p>
                <p className="text-xs font-semibold text-slate-700">{selectedProfile.financeCouple || 'À discuter'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Polygamie</p>
                <p className="text-xs font-semibold text-slate-700">{selectedProfile.polygamie || 'Non'}</p>
              </div>
            </div>
          </div>
          
          <div className="pb-10 pt-4 text-center">
            <button onClick={() => setIsReporting(true)} className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-rose-500 transition-colors flex items-center justify-center gap-1 mx-auto">
              <Flag className="w-3 h-3" /> Signaler ce profil
            </button>
          </div>
          
        </div>
      </div>

      {/* Floating Action Buttons (Farata style) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 z-50">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center gap-3">
          
          {relStatus.status === 'loading' && (
            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mx-4" />
          )}

          {relStatus.status === 'matched' && (
            <button onClick={() => openChatWithMatch(relStatus.data.match)} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#c39e31] text-white font-bold text-sm shadow-md transition-transform hover:scale-105">
              <MessageCircle className="w-5 h-5 fill-current" />
              Message
            </button>
          )}

          {relStatus.status === 'request_sent' && (
            <button disabled className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-100 text-amber-800 font-bold text-sm shadow-inner opacity-80">
              <Clock className="w-5 h-5" />
              En attente
            </button>
          )}

          {relStatus.status === 'request_received' && (
            <>
              <button onClick={handleRejectRequest} className="w-12 h-12 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center shadow-inner transition-transform hover:scale-105">
                <X className="w-6 h-6 stroke-[3]" />
              </button>
              <button onClick={handleAcceptRequest} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D8659] hover:bg-[#236c47] text-white font-bold text-sm shadow-[0_4px_14px_rgba(45,134,89,0.39)] transition-transform hover:scale-105">
                <Heart className="w-5 h-5 fill-current" />
                Accepter
              </button>
            </>
          )}

          {relStatus.status === 'none' && (
            <>
              <button onClick={() => setCurrentView('home')} className="w-12 h-12 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center shadow-inner transition-transform hover:scale-105">
                <X className="w-6 h-6 stroke-[3]" />
              </button>
              <button onClick={() => showToast("Bientôt disponible", "info")} className="w-12 h-12 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-500 flex items-center justify-center shadow-inner transition-transform hover:scale-105">
                <MessageCircle className="w-5 h-5 fill-current" />
              </button>
              <button onClick={() => openSendRequestModal(selectedProfile)} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D8659] hover:bg-[#236c47] text-white font-bold text-sm shadow-[0_4px_14px_rgba(45,134,89,0.39)] transition-transform hover:scale-105">
                <Heart className="w-5 h-5 fill-current" />
                Ajouter
              </button>
            </>
          )}
          
          {relStatus.status === 'own_profile' && (
            <button onClick={() => setCurrentView('settings')} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A2F4A] hover:bg-[#062033] text-white font-bold text-sm shadow-md transition-transform hover:scale-105">
              <Camera className="w-5 h-5" />
              Modifier mon profil
            </button>
          )}
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
