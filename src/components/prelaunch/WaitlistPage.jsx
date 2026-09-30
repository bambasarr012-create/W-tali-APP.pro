import React, { useState } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import WeddingRingLogo from '../common/WeddingRingLogo';

export default function WaitlistPage({ onBack, onTesterLogin, isBlockedTester, logout }) {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    country: '',
    city: '',
    consent: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) {
      setError("Vous devez accepter d'être contacté(e) au lancement.");
      return;
    }

    if (formData.firstName.length > 50 || formData.country.length > 100 || formData.city.length > 100) {
      setError("Les champs saisis sont trop longs.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if email already exists
      const q = query(collection(db, 'waitlist'), where('email', '==', formData.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setSuccess(true); // Treat as success to not leak info, or just say they are already registered
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'waitlist'), {
        firstName: formData.firstName.trim(),
        email: formData.email.trim().toLowerCase(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        consent: formData.consent,
        createdAt: new Date().toISOString()
      });

      setSuccess(true);
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
      console.error("Waitlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-full bg-[#EAF5EF] text-[#2D8659] flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#0F172A] mb-4">Vous êtes sur la liste !</h2>
        <p className="text-slate-600 max-w-md mx-auto mb-8">
          Merci {formData.firstName}. Nous vous contacterons à l'adresse <strong>{formData.email}</strong> dès que Wétali sera disponible dans votre région.
        </p>
        <button onClick={onBack} className="text-[#D4AF37] font-bold hover:underline">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex flex-col font-sans relative">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="flex justify-center mb-6" onClick={onBack} style={{ cursor: 'pointer' }}>
            <WeddingRingLogo size="md" />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-[#0F172A] mb-2">Bientôt disponible</h1>
            <p className="text-sm text-slate-600">
              {isBlockedTester 
                ? "Ce compte n'est pas autorisé pour la phase de test. Inscrivez-vous sur la liste d'attente."
                : "Wétali est en cours de préparation. Inscrivez-vous pour être prévenu(e) en avant-première lors du lancement officiel."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input 
                type="text" name="firstName" required placeholder="Prénom" 
                maxLength="50"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] outline-none"
                value={formData.firstName} onChange={handleChange} 
              />
            </div>
            <div>
              <input 
                type="email" name="email" required placeholder="Adresse e-mail" 
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] outline-none"
                value={formData.email} onChange={handleChange} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" name="country" required placeholder="Pays de résidence" 
                maxLength="100"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] outline-none"
                value={formData.country} onChange={handleChange} 
              />
              <input 
                type="text" name="city" required placeholder="Ville" 
                maxLength="100"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] outline-none"
                value={formData.city} onChange={handleChange} 
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" name="consent" required
                  checked={formData.consent} onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0F172A] focus:ring-[#0F172A] cursor-pointer"
                />
                <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-800">
                  J'accepte que Wétali me contacte par email au lancement. <br />
                  <a href="/privacy" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('show-privacy')); }} className="text-[#D4AF37] hover:underline">Politique de confidentialité</a>
                </span>
              </label>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-3.5 mt-4 rounded-xl font-bold text-sm text-white bg-[#0F172A] hover:bg-[#1E3A8A] transition-colors shadow-lg shadow-[#0F172A]/20"
            >
              {loading ? 'Inscription...' : 'Rejoindre la liste d\'attente'}
            </button>
          </form>

          {isBlockedTester && (
            <div className="mt-6 text-center">
              <button onClick={logout} className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors">
                Me déconnecter
              </button>
            </div>
          )}

          {!isBlockedTester && onTesterLogin && (
            <div className="mt-8 text-center text-xs">
              <button onClick={onTesterLogin} className="text-slate-500 font-medium hover:text-[#D4AF37] transition-colors">
                Testeur ? Se connecter
              </button>
            </div>
          )}
        </div>
      </div>
      
      {!isBlockedTester && (
        <button 
          onClick={onBack}
          className="absolute top-6 right-6 lg:top-8 lg:right-12 text-sm font-medium text-slate-400 hover:text-[#0F172A] transition-colors flex items-center gap-2"
        >
          <span>←</span> Retour
        </button>
      )}
    </div>
  );
}
