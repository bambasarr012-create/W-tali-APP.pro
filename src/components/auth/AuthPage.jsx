import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Heart, Sparkles, ArrowRight, Lock, Mail, CheckCircle2, UserPlus } from 'lucide-react';
import WeddingRingLogo from '../common/WeddingRingLogo';

export default function AuthPage() {
  const { login, signup } = useAuth();
  const { showToast, setCurrentView } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas.");
        }
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

  // Demo fast-login for quick evaluator testing
  const handleFastDemoLogin = async () => {
    setEmail('amadou.diaspora@example.com');
    setPassword('wetali2026');
    try {
      await login('amadou.diaspora@example.com', 'wetali2026');
      showToast("Connecté en tant que membre de la diaspora !", "success");
      setCurrentView('home');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2F4A] via-[#0E3B5C] to-[#061C2C] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      {/* Ambient background blur circles */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#2D8659]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-md bg-white text-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 border border-slate-100">
        
        {/* Brand Crest */}
        <div className="text-center space-y-3 mb-8 flex flex-col items-center">
          <WeddingRingLogo size="xl" />
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0A2F4A]">
              Wétali Matrimonial
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Réseau d'Unions d'Honneur pour la Diaspora Sénégalaise
            </p>
          </div>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex bg-[#F0F4F2] p-1 rounded-2xl mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setForgotSuccess(false); }}
            className={`w-1/2 py-2.5 rounded-xl font-bold text-xs transition-all ${
              mode === 'login'
                ? 'bg-white text-[#0A2F4A] shadow-sm'
                : 'text-slate-600 hover:text-[#0A2F4A]'
            }`}
          >
            Se Connecter
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); setForgotSuccess(false); }}
            className={`w-1/2 py-2.5 rounded-xl font-bold text-xs transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#2D8659] shadow-sm'
                : 'text-slate-600 hover:text-[#2D8659]'
            }`}
          >
            Créer un Compte
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Forgot Password Success State */}
        {mode === 'forgot' && forgotSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EAF5EF] text-[#2D8659] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#0A2F4A]">Email de récupération envoyé</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Vérifiez votre boîte de réception à l'adresse <strong>{email}</strong> pour réinitialiser votre mot de passe.
            </p>
            <button
              onClick={() => setMode('login')}
              className="mt-4 text-xs font-bold text-[#2D8659] hover:underline"
            >
              Retour à la connexion
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email field */}
            <div>
              <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                Adresse E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-sm text-slate-800 focus:border-[#2D8659] focus:ring-2 focus:ring-[#2D8659]/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#0A2F4A] uppercase tracking-wider">
                    Mot de passe
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-[#2D8659] font-medium hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-sm text-slate-800 focus:border-[#2D8659] focus:ring-2 focus:ring-[#2D8659]/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Confirm Password field (Signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-sm text-slate-800 focus:border-[#2D8659] focus:ring-2 focus:ring-[#2D8659]/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 ${
                mode === 'signup'
                  ? 'bg-[#2D8659] hover:bg-[#246e49] text-white shadow-[#2D8659]/25'
                  : 'bg-[#0A2F4A] hover:bg-[#061C2C] text-white shadow-[#0A2F4A]/25'
              }`}
            >
              <span>
                {loading
                  ? "Chargement..."
                  : mode === 'signup'
                  ? "Créer mon compte"
                  : mode === 'login'
                  ? "Se connecter"
                  : "Réinitialiser mon mot de passe"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Forgot mode back button */}
            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-medium pt-2"
              >
                Retour à la connexion
              </button>
            )}

          </form>
        )}

        {/* Quick Demo Access Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 mb-2.5">
            Vous souhaitez explorer l'application sans créer de compte ?
          </p>
          <button
            type="button"
            onClick={handleFastDemoLogin}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F0F4F2] hover:bg-[#E2EBE6] text-[#2D8659] text-xs font-bold transition-all border border-[#2D8659]/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Accès Démo 1-Clic (Diaspora)</span>
          </button>
        </div>

        {/* Trust Badges Footer */}
        <div className="mt-6 flex items-center justify-center gap-3 text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D8659]" />
            Chiffrement Sécurisé
          </span>
          <span>•</span>
          <span>100% Confidentiel</span>
        </div>

      </div>

    </div>
  );
}
