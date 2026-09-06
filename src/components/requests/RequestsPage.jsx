import React, { useState, useEffect } from 'react';
import { getReceivedRequests, getSentRequests, acceptRequest, rejectRequest, subscribeToCollection } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserCheck, Check, X, MessageCircle, Clock, Heart, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function RequestsPage() {
  const { userProfile } = useAuth();
  const { showToast, openChatWithMatch, viewProfileDetail, refreshCounts } = useApp();

  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [received, sent] = await Promise.all([
        getReceivedRequests(userProfile?.id),
        getSentRequests(userProfile?.id)
      ]);
      setReceivedRequests(received);
      setSentRequests(sent);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToCollection('requests', loadData);
    return () => unsub();
  }, [userProfile]);

  const handleAccept = async (request) => {
    setProcessingId(request.id);
    try {
      const newMatch = await acceptRequest(request.id, userProfile);
      showToast(`Félicitations ! Vous êtes désormais en contact avec ${request.fromUser.prenom}.`, "success");
      await refreshCounts();
      await loadData();
      // Propose d'ouvrir le chat
      openChatWithMatch(newMatch);
    } catch (err) {
      showToast(err.message || "Erreur lors de l'acceptation.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessingId(requestId);
    try {
      await rejectRequest(requestId);
      showToast("Demande déclinée avec respect.", "info");
      await refreshCounts();
      await loadData();
    } catch (err) {
      showToast(err.message || "Erreur lors du refus.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0A2F4A] flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-[#2D8659]" />
            <span>Demandes de Contact</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les sollicitations et invitations à faire connaissance.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F0F4F2] p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'received'
                ? 'bg-white text-[#2D8659] shadow-sm'
                : 'text-slate-600 hover:text-[#0A2F4A]'
            }`}
          >
            <span>Demandes Reçues</span>
            {receivedRequests.length > 0 && (
              <span className="bg-[#2D8659] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {receivedRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sent'
                ? 'bg-white text-[#0A2F4A] shadow-sm'
                : 'text-slate-600 hover:text-[#0A2F4A]'
            }`}
          >
            <span>Demandes Envoyées ({sentRequests.length})</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-[#2D8659] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Chargement des demandes...</p>
        </div>
      ) : activeTab === 'received' ? (
        /* ========================================== */
        /* DEMANDES REÇUES                            */
        /* ========================================== */
        receivedRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#EAF5EF] text-[#2D8659] mx-auto flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#0A2F4A]">Aucune demande en attente</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Lorsque d'autres membres de la diaspora souhaiteront faire votre connaissance, leurs messages apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map(req => {
              const sender = req.fromUser || {};
              const senderPhoto = sender.photos && sender.photos[0]
                ? sender.photos[0]
                : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* User Identity */}
                    <div 
                      onClick={() => sender.id && viewProfileDetail(sender)}
                      className="flex items-center gap-4 cursor-pointer group"
                    >
                      <img
                        src={senderPhoto}
                        alt={sender.prenom}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 group-hover:border-[#2D8659] shadow-sm transition-colors"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-lg text-[#0A2F4A] group-hover:text-[#2D8659] transition-colors">
                            {sender.prenom}, {sender.age} ans
                          </h3>
                          <span className="text-[10px] font-bold bg-[#EAF5EF] text-[#2D8659] px-2 py-0.5 rounded-full">
                            {sender.ville}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          {sender.profession}
                        </p>
                        {sender.dahira && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {sender.dahira}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Accepter / Refuser */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        disabled={processingId === req.id}
                        onClick={() => handleReject(req.id)}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>REFUSER</span>
                      </button>
                      <button
                        type="button"
                        disabled={processingId === req.id}
                        onClick={() => handleAccept(req)}
                        className="px-5 py-2.5 rounded-xl bg-[#2D8659] hover:bg-[#236c47] text-white text-xs font-bold shadow-md shadow-[#2D8659]/20 transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>{processingId === req.id ? "Validation..." : "ACCEPTER"}</span>
                      </button>
                    </div>

                  </div>

                  {/* Message Bubble */}
                  <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed space-y-1">
                    <div className="text-[10px] font-bold text-[#2D8659] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Message d'introduction</span>
                    </div>
                    <p className="italic">"{req.message}"</p>
                  </div>

                  {/* Timestamp */}
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Reçue le {new Date(req.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                </div>
              );
            })}
          </div>
        )
      ) : (
        /* ========================================== */
        /* DEMANDES ENVOYÉES                          */
        /* ========================================== */
        sentRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-base text-[#0A2F4A]">Aucune demande envoyée</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Parcourez les profils dans l'onglet Découvrir et envoyez une demande aux personnes qui vous correspondent.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sentRequests.map(req => {
              const target = req.toUser || {};
              const targetPhoto = target.photos && target.photos[0]
                ? target.photos[0]
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={targetPhoto}
                        alt={target.prenom || "Profil"}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-[#0A2F4A]">
                          Demande envoyée à {target.prenom || "Membre Wétali"}
                        </h4>
                        <div className="text-xs text-slate-500">
                          {target.ville} • {target.profession}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      req.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status === 'accepted' ? '✓ Acceptée' : req.status === 'rejected' ? 'Déclinée' : 'En attente...'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl italic">
                    "{req.message}"
                  </p>
                </div>
              );
            })}
          </div>
        )
      )}

    </div>
  );
}
