import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { formatRelativeTime } from '../../services/firestoreService';

const ADMIN_EMAILS = ['bambasarr012@gmail.com', 'wetalidiaspora@gmail.com'];

export default function AdminReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Vérification stricte admin
  useEffect(() => {
    if (user && !ADMIN_EMAILS.includes(user.email)) {
      window.location.href = '/';
    }
  }, [user]);

  useEffect(() => {
    if (!user || !ADMIN_EMAILS.includes(user.email)) return;

    const db = getFirestore();
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setReports(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleResolve = async (reportId) => {
    if (!window.confirm("Marquer ce signalement comme traité ?")) return;
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'reports', reportId), { status: 'resolved' });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleSuspend = async (reportId, reportedUserId) => {
    if (!window.confirm("ATTENTION: Voulez-vous vraiment SUSPENDRE ce compte ? L'utilisateur sera déconnecté et ne pourra plus accéder à l'application.")) return;
    try {
      const db = getFirestore();
      // Suspendre l'utilisateur
      await updateDoc(doc(db, 'users', reportedUserId), { suspended: true });
      // Marquer le rapport comme traité
      await updateDoc(doc(db, 'reports', reportId), { status: 'resolved' });
      alert("Utilisateur suspendu avec succès.");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suspension");
    }
  };

  if (!user || !ADMIN_EMAILS.includes(user.email)) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Administration Wétali</h1>
            <p className="text-sm text-slate-500">Gestion des signalements & modération</p>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500 font-medium">Chargement des signalements...</p>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">Aucun signalement</p>
            <p className="text-sm text-slate-500">La communauté est saine.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div 
                key={report.id} 
                className={`bg-white p-5 rounded-2xl border transition-all ${
                  report.status === 'resolved' ? 'border-emerald-200 opacity-60' : 'border-rose-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md ${
                        report.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {report.status === 'resolved' ? 'TRAITÉ' : 'EN ATTENTE'}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {formatRelativeTime(report.createdAt)}
                      </span>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Type: {report.contentType}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      {report.reason}
                    </h3>
                    
                    {report.description && (
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        "{report.description}"
                      </p>
                    )}

                    <div className="text-xs text-slate-500 font-mono mt-2">
                      Signalé par: {report.reporterId} <br/>
                      Contre: <span className="font-bold text-slate-700">{report.reportedUserId}</span>
                    </div>
                  </div>

                  {report.status !== 'resolved' && (
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <button 
                        onClick={() => handleResolve(report.id)}
                        className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                      >
                        Marquer comme traité
                      </button>
                      <button 
                        onClick={() => handleSuspend(report.id, report.reportedUserId)}
                        className="w-full px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Suspendre l'utilisateur
                      </button>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
