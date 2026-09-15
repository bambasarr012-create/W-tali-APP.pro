import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Heart, ArrowRight, Lock, Mail, CheckCircle2, UserPlus, Eye, EyeOff } from 'lucide-react';
import WeddingRingLogo from '../common/WeddingRingLogo';
import RulesPage from '../legal/RulesPage';
import PrivacyPage from '../legal/PrivacyPage';

export default function AuthPage({ onBack }) {
  const { login, signup, loginGoogle } = useAuth();
  const { showToast, setCurrentView } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [legalView, setLegalView] = useState(null); // 'rules' | 'privacy' | null

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'signup' && !acceptTerms) return;

    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password.length < 6) {
          throw new Error("Le mot de passe doit comporter au moins 6 caractères.");
        }
        await signup(email, password);
        showToast("Compte créé avec succès ! Veuillez maintenant configurer votre profil.", "success");
        setCurrentView('profile-create');
      } else if (mode === 'login') {
        const user = await login(email, password);
        showToast("Connexion réussie ! Bienvenue sur Wétali.", "success");
        if (!user.hasCompletedProfile) {
          setCurrentView('profile-create');
        } else {
          setCurrentView('home');
        }
      } else if (mode === 'forgot') {
        setForgotSuccess(true);
        showToast(`Instructions envoyées à ${email}`, "success");
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (mode === 'signup' && !acceptTerms) return;
    
    setError('');
    setLoading(true);
    
    try {
      const user = await loginGoogle();
      showToast("Connexion avec Google réussie ! Bienvenue sur Wétali.", "success");
      if (!user.hasCompletedProfile) {
        setCurrentView('profile-create');
      } else {
        setCurrentView('home');
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la connexion Google.");
    } finally {
      setLoading(false);
    }
  };

  if (legalView === 'rules') {
    return <RulesPage onBack={() => setLegalView(null)} />;
  }
  if (legalView === 'privacy') {
    return <PrivacyPage onBack={() => setLegalView(null)} />;
  }

  return (
    <div className="flex min-h-screen bg-[#FFFBF0] font-sans antialiased">
      {/* Colonne GAUCHE (40%) */}
      <div className="hidden lg:flex lg:w-[40%] flex-col justify-between bg-gradient-to-b from-[#0F172A] to-[#1E3A8A] p-12 relative overflow-hidden text-white">
        {/* Motif discret (cercles estompés) */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Logo en haut */}
        <div className="relative z-10 flex items-center gap-3 cursor-pointer" onClick={onBack}>
          <WeddingRingLogo size="sm" />
          <span className="font-serif font-bold text-3xl text-white">Wétali</span>
        </div>

        {/* Contenu central */}
        <div className="relative z-10">
          {mode === 'login' || mode === 'forgot' ? (
            <p className="font-serif italic text-3xl leading-snug text-white opacity-95 max-w-sm">
              "La distance ne brise pas les liens du cœur, elle les rend plus précieux."
            </p>
          ) : (
            <div className="space-y-8">
              <p className="font-serif italic text-3xl leading-snug text-white opacity-95 max-w-sm">
                "Construire un foyer, même à des milliers de kilomètres du pays natal."
              </p>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-sm">
                <h3 className="font-serif font-bold text-xl text-[#D4AF37] mb-5">Pourquoi Wétali ?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium opacity-90">Communauté sérieuse et vérifiée</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium opacity-90">Respect des valeurs et traditions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium opacity-90">Discrétion totale garantie</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Badge en bas */}
        <div className="relative z-10 flex items-center gap-2 text-white/70 text-sm font-medium">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
          <span>Plateforme sécurisée</span>
        </div>
      </div>

      {/* Colonne DROITE (60%) */}
      <div className="w-full lg:w-[60%] flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Bouton Retour (Desktop & Mobile) */}
        <button 
          onClick={onBack}
          className="absolute top-6 right-6 lg:top-8 lg:right-12 text-sm font-medium text-slate-400 hover:text-[#0F172A] transition-colors flex items-center gap-2 z-20"
        >
          <span>←</span> Retour à l'accueil
        </button>

        <div className="w-full max-w-md mt-6 lg:mt-0">
          {/* Logo Mobile */}
          <div className="lg:hidden flex justify-center mb-8 cursor-pointer" onClick={onBack}>
            <WeddingRingLogo size="lg" />
          </div>

          {/* En-tête formulaire */}
          <div className="text-center mb-8">
            <div className="hidden lg:flex justify-center mb-6 cursor-pointer" onClick={onBack}>
              <WeddingRingLogo size="md" />
            </div>
            <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-3">
              MATRIMONIAL PREMIUM · DIASPORA · CONFIANCE
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F172A] mb-3">
              {mode === 'login' ? 'Bon retour parmi nous' : mode === 'forgot' ? 'Mot de passe oublié' : 'Bienvenue'}
            </h2>
            <p className="text-sm text-slate-600">
              {mode === 'login' 
                ? 'Heureux de te revoir ! Connecte-toi pour continuer ta recherche.' 
                : mode === 'forgot'
                ? 'Renseigne ton adresse email pour recevoir les instructions.'
                : 'Crée ton compte pour commencer ta recherche sérieuse.'}
            </p>
            
            {mode !== 'forgot' && (
              <div className="flex justify-center mt-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-white text-xs font-bold text-[#0F172A] shadow-sm">
                  <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                  {mode === 'login' ? '2 500+ membres actifs' : '+150 inscrits ce mois'}
                </div>
              </div>
            )}
          </div>

          {/* Alertes et Succès */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {mode === 'forgot' && forgotSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EAF5EF] text-[#2D8659] mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#0F172A]">Email de récupération envoyé</h3>
              <p className="text-sm text-slate-600">
                Vérifiez votre boîte de réception à l'adresse <strong>{email}</strong> pour réinitialiser votre mot de passe.
              </p>
              <button onClick={() => {setMode('login'); setForgotSuccess(false);}} className="mt-4 text-sm font-bold text-[#D4AF37] hover:underline">
                Retour à la connexion
              </button>
            </div>
          ) : (
            <>
              {/* Encadré Important (Signup) */}
              {mode === 'signup' && (
                <div className="bg-[#E0F2FE]/40 border border-[#D4AF37] rounded-2xl p-5 mb-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-[#D4AF37]" fill="#D4AF37" fillOpacity="0.2" />
                    <h4 className="font-bold text-[#0F172A] text-sm">Avant de commencer</h4>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={acceptTerms} 
                      onChange={(e) => setAcceptTerms(e.target.checked)} 
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0F172A] focus:ring-[#0F172A] focus:ring-offset-0 cursor-pointer transition-colors"
                    />
                    <span className="text-xs text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                      J'accepte le <button type="button" onClick={(e) => { e.preventDefault(); setLegalView('rules'); }} className="text-[#D4AF37] hover:underline font-semibold">règlement</button>, la <button type="button" onClick={(e) => { e.preventDefault(); setLegalView('privacy'); }} className="text-[#D4AF37] hover:underline font-semibold">politique de confidentialité</button> et je m'engage sincèrement dans cette démarche de recherche matrimoniale.
                    </span>
                  </label>
                </div>
              )}

              {/* Formulaire Principal */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {mode !== 'forgot' && (
                  <>
                    {/* Bouton Google */}
                    <button 
                      type="button" 
                      onClick={handleGoogleSignIn}
                      disabled={mode === 'signup' && !acceptTerms}
                      className={`w-full py-3.5 rounded-2xl font-bold text-sm bg-white border border-slate-300 text-slate-700 shadow-sm transition-all flex items-center justify-center gap-3 ${mode === 'signup' && !acceptTerms ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                    >
                      {/* Google Icon */}
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        <path fill="none" d="M1 1h22v22H1z"/>
                      </svg>
                      {mode === 'signup' ? 'Inscription rapide avec Google' : 'Continuer avec Google'}
                    </button>

                    {/* Séparateur */}
                    <div className="flex items-center gap-4 my-6">
                      <div className="h-px bg-slate-200 flex-1"></div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        ou {mode === 'login' ? 'par email' : ''}
                      </span>
                      <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                  </>
                )}

                {/* Champ Email */}
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    required 
                    placeholder="Adresse e-mail" 
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 text-sm focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/20 outline-none transition-all" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                  />
                </div>

                {/* Champ Mot de Passe */}
                {mode !== 'forgot' && (
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      placeholder="Mot de passe" 
                      className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-300 text-sm focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/20 outline-none transition-all" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F172A] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                )}

                {/* Options Login */}
                {mode === 'login' && (
                  <div className="flex justify-between items-center text-xs">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="rounded border-gray-300 text-[#0F172A] focus:ring-[#0F172A] cursor-pointer" />
                      <span className="text-slate-600 group-hover:text-slate-800 transition-colors">Se souvenir de moi</span>
                    </label>
                    <button type="button" onClick={() => {setMode('forgot'); setError('');}} className="text-[#D4AF37] hover:underline font-semibold">
                      Oublié ?
                    </button>
                  </div>
                )}

                {/* Bouton Soumettre */}
                <button 
                  type="submit" 
                  disabled={loading || (mode === 'signup' && !acceptTerms)}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-2
                    ${mode === 'signup' && !acceptTerms 
                      ? 'bg-slate-300 shadow-none opacity-50 cursor-not-allowed' 
                      : 'bg-[#0F172A] hover:bg-[#1E3A8A] shadow-[#0F172A]/25'
                    }`}
                >
                  {loading 
                    ? 'Chargement...' 
                    : mode === 'login' 
                      ? 'Se connecter' 
                      : mode === 'forgot'
                        ? 'Réinitialiser mon mot de passe'
                        : 'Continuer avec Email'
                  }
                  {!loading && mode === 'login' && <ArrowRight className="w-4 h-4" />}
                  {!loading && mode === 'signup' && <Mail className="w-4 h-4" />}
                </button>

                {mode === 'forgot' && (
                  <button type="button" onClick={() => setMode('login')} className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 pt-2">
                    Retour à la connexion
                  </button>
                )}
              </form>

              {/* Liens de bas de page */}
              {mode !== 'forgot' && (
                <div className="text-center mt-8 text-sm">
                  {mode === 'login' ? (
                    <p className="text-slate-600">Pas encore de compte ? <button onClick={() => {setMode('signup'); setError('');}} className="text-[#D4AF37] font-bold hover:underline">Créer un compte</button></p>
                  ) : (
                    <p className="text-slate-600">Déjà un compte ? <button onClick={() => {setMode('login'); setError('');}} className="text-[#D4AF37] font-bold hover:underline">Se connecter</button></p>
                  )}
                </div>
              )}

              {/* Texte de sécurité final */}
              {mode === 'login' && (
                <div className="mt-8 flex justify-center gap-2 items-center text-[11px] font-medium text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Connexion sécurisée · Données chiffrées</span>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

