import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';
import { ShieldCheck, ShieldAlert, AlertTriangle, LayoutDashboard, Users, Flag, Settings, Activity, TrendingUp, Ban } from 'lucide-react';
import { formatRelativeTime } from '../../services/firestoreService';

const ADMIN_EMAILS = ['bambasarr012@gmail.com', 'wetalidiaspora@gmail.com'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Security check
  useEffect(() => {
    if (user && !ADMIN_EMAILS.includes(user.email)) {
      window.location.href = '/';
    }
  }, [user]);

  // Fetch Data
  useEffect(() => {
    if (!user || !ADMIN_EMAILS.includes(user.email)) return;

    const db = getFirestore();
    
    // Fetch Reports
    const qReports = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    const unsubscribeReports = onSnapshot(qReports, (snapshot) => {
      const data = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setReports(data);
    });

    // Fetch Users
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = [];
        usersSnapshot.forEach(doc => usersData.push({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (err) {
        console.error("Erreur chargement utilisateurs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      unsubscribeReports();
    };
  }, [user]);

  // Actions
  const handleResolveReport = async (reportId) => {
    if (!window.confirm("Marquer ce signalement comme traité ?")) return;
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'reports', reportId), { status: 'resolved' });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleSuspendUser = async (userId, reportId = null) => {
    if (!window.confirm("ATTENTION: Voulez-vous vraiment SUSPENDRE ce compte ? L'utilisateur ne pourra plus accéder à l'application.")) return;
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'users', userId), { suspended: true });
      if (reportId) {
        await updateDoc(doc(db, 'reports', reportId), { status: 'resolved' });
      }
      // Update local state for immediate feedback
      setUsers(users.map(u => u.id === userId ? { ...u, suspended: true } : u));
      alert("Utilisateur suspendu avec succès.");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suspension");
    }
  };

  const handleUnsuspendUser = async (userId) => {
    if (!window.confirm("Voulez-vous réactiver ce compte ?")) return;
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'users', userId), { suspended: false });
      setUsers(users.map(u => u.id === userId ? { ...u, suspended: false } : u));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la réactivation");
    }
  };

  if (!user || !ADMIN_EMAILS.includes(user.email)) return null;

  // Derived stats
  const pendingReports = reports.filter(r => r.status !== 'resolved').length;
  const activeUsers = users.filter(u => !u.suspended).length;
  const suspendedUsers = users.filter(u => u.suspended).length;

  return (
    <div className="min-h-screen bg-[#F4F7F6] font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <ShieldCheck className="w-6 h-6 text-[#D4AF37] mr-2" />
          <span className="font-bold text-slate-800 tracking-tight">Wétali Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <NavItem 
            icon={<LayoutDashboard />} label="Vue d'ensemble" 
            active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} 
          />
          <NavItem 
            icon={<Users />} label="Utilisateurs" 
            active={activeTab === 'users'} onClick={() => setActiveTab('users')} 
          />
          <NavItem 
            icon={<Flag />} label="Signalements" 
            badge={pendingReports > 0 ? pendingReports : null}
            active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-slate-600 font-bold text-xs">{user.email.charAt(0).toUpperCase()}</span>
            </div>
            <div className="text-xs truncate">
              <p className="font-semibold text-slate-700">Admin</p>
              <p className="text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between">
          <div className="flex items-center">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37] mr-2" />
            <span className="font-bold text-slate-800">Admin</span>
          </div>
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value)}
            className="bg-slate-100 border-none text-sm font-semibold rounded-lg focus:ring-0"
          >
            <option value="overview">Vue d'ensemble</option>
            <option value="users">Utilisateurs</option>
            <option value="reports">Signalements</option>
          </select>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {activeTab === 'overview' && "Vue d'ensemble"}
                {activeTab === 'users' && "Gestion des Utilisateurs"}
                {activeTab === 'reports' && "Modération & Signalements"}
              </h1>
              <p className="text-slate-500">
                {activeTab === 'overview' && "Statistiques et état global de la plateforme."}
                {activeTab === 'users' && "Consultez, recherchez et modérez les comptes utilisateurs."}
                {activeTab === 'reports' && "Traitez les signalements de la communauté."}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <OverviewTab 
                    totalUsers={users.length} 
                    activeUsers={activeUsers} 
                    suspendedUsers={suspendedUsers}
                    totalReports={reports.length}
                    pendingReports={pendingReports}
                  />
                )}
                {activeTab === 'users' && (
                  <UsersTab 
                    users={users} 
                    onSuspend={handleSuspendUser} 
                    onUnsuspend={handleUnsuspendUser} 
                  />
                )}
                {activeTab === 'reports' && (
                  <ReportsTab 
                    reports={reports} 
                    onResolve={handleResolveReport} 
                    onSuspend={handleSuspendUser} 
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-[#0A2F4A] text-white shadow-md shadow-[#0A2F4A]/20' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
        <span className="font-semibold text-sm">{label}</span>
      </div>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          active ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function OverviewTab({ totalUsers, activeUsers, suspendedUsers, totalReports, pendingReports }) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Utilisateurs Inscrits" 
          value={totalUsers} 
          icon={<Users className="w-6 h-6 text-blue-600" />}
          trend="+12% ce mois"
          bg="bg-blue-50"
        />
        <StatCard 
          title="Signalements en attente" 
          value={pendingReports} 
          icon={<Flag className="w-6 h-6 text-rose-600" />}
          trend={`${totalReports} au total`}
          bg="bg-rose-50"
          alert={pendingReports > 0}
        />
        <StatCard 
          title="Comptes Suspendus" 
          value={suspendedUsers} 
          icon={<Ban className="w-6 h-6 text-slate-600" />}
          trend="Modération active"
          bg="bg-slate-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            État du Système
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-slate-500">Base de données (Firestore)</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md font-semibold">Connecté</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-slate-500">Stockage Images (Storage)</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md font-semibold">Actif</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-slate-500">Authentification</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md font-semibold">Opérationnel</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, bg, alert }) {
  return (
    <div className={`p-6 rounded-3xl border transition-all ${alert ? 'border-rose-200 shadow-rose-100' : 'border-slate-200'} bg-white shadow-sm hover:shadow-md relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 p-4 rounded-bl-3xl ${bg}`}>
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-slate-500 mb-2">{title}</h3>
      <div className="text-4xl font-black text-slate-800 mb-2">{value}</div>
      <div className="text-xs font-semibold text-slate-400">{trend}</div>
    </div>
  );
}

function UsersTab({ users, onSuspend, onUnsuspend }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Utilisateur</th>
              <th className="px-6 py-4">Âge / Ville</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {u.photos && u.photos[0] ? (
                      <img src={u.photos[0]} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                        {u.firstName ? u.firstName.charAt(0) : '?'}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-slate-800">{u.firstName} {u.lastName}</div>
                      <div className="text-xs text-slate-500">{u.email || u.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {u.age ? `${u.age} ans` : '-'} <br/>
                  <span className="text-xs text-slate-400">{u.city || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  {u.suspended ? (
                    <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold uppercase rounded-md flex items-center gap-1 w-max">
                      <Ban className="w-3 h-3" /> Suspendu
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase rounded-md w-max">
                      Actif
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {u.suspended ? (
                    <button 
                      onClick={() => onUnsuspend(u.id)}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Réactiver
                    </button>
                  ) : (
                    <button 
                      onClick={() => onSuspend(u.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Suspendre
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsTab({ reports, onResolve, onSuspend }) {
  if (reports.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">Tout est calme</h3>
        <p className="text-slate-500">Aucun signalement n'a été fait par la communauté.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map(report => (
        <div 
          key={report.id} 
          className={`bg-white p-6 rounded-3xl border transition-all ${
            report.status === 'resolved' ? 'border-emerald-200 opacity-60' : 'border-rose-200 shadow-sm shadow-rose-100/50'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md ${
                  report.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {report.status === 'resolved' ? 'TRAITÉ' : 'EN ATTENTE'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {formatRelativeTime(report.createdAt)}
                </span>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Type: {report.contentType}
                </span>
              </div>

              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                {report.reason}
              </h3>
              
              {report.description && (
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                  "{report.description}"
                </p>
              )}

              <div className="text-xs text-slate-500 font-mono flex items-center gap-4 bg-slate-50 p-3 rounded-xl inline-flex border border-slate-100 mt-2">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Signalé par</span>
                  <span className="font-medium text-slate-600">{report.reporterId}</span>
                </div>
                <div className="w-px h-6 bg-slate-200"></div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Contre (Accusé)</span>
                  <span className="font-bold text-rose-600">{report.reportedUserId}</span>
                </div>
              </div>
            </div>

            {report.status !== 'resolved' && (
              <div className="flex flex-col gap-3 min-w-[220px]">
                <button 
                  onClick={() => onResolve(report.id)}
                  className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Marquer comme traité
                </button>
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold">OU SÉVÈRE</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>
                <button 
                  onClick={() => onSuspend(report.reportedUserId, report.id)}
                  className="w-full px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  Suspendre l'utilisateur
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
