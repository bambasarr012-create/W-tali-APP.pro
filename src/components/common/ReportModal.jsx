import React, { useState } from 'react';
import { ShieldAlert, X, Send } from 'lucide-react';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export default function ReportModal({ reportedUserId, contentType, onClose }) {
  const { user } = useAuth();
  const { setToast } = useApp();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    "Faux profil",
    "Harcèlement",
    "Contenu inapproprié",
    "Tentative d'arnaque ou de contournement de l'abonnement",
    "Autre"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;

    setIsSubmitting(true);
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'reports'), {
        reportedUserId,
        reporterId: user.uid,
        contentType,
        reason,
        description,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      if (setToast) {
        setToast({ message: "Signalement envoyé, merci.", type: 'success' });
      } else {
        alert("Signalement envoyé, merci.");
      }
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'envoi du signalement:", err);
      if (setToast) {
        setToast({ message: "Une erreur est survenue.", type: 'error' });
      } else {
        alert("Une erreur est survenue.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-3 text-rose-700">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Signaler</h2>
              <p className="text-xs text-rose-600/80">
                {contentType === 'message' ? 'Ce message' : 'Ce profil'} sera examiné
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-colors shadow-sm border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-800">Motif du signalement *</label>
            <div className="space-y-2">
              {reasons.map((r, idx) => (
                <label key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="reportReason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-sm text-slate-700">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">Détails supplémentaires (optionnel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Précisez le problème rencontré..."
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-sm outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!reason || isSubmitting}
            className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Envoi en cours...' : (
              <>
                <Send className="w-4 h-4" />
                Envoyer le signalement
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
