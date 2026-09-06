import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { calculatePointsCommuns } from '../../services/firestoreService';
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
  Tag 
} from 'lucide-react';

export default function ProfileDetailPage() {
  const { selectedProfile, setCurrentView, openSendRequestModal } = useApp();
  const { userProfile } = useAuth();
  const [photoIndex, setPhotoIndex] = useState(0);

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

        {/* Profile Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Title & Location */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#0A2F4A]">
                {selectedProfile.prenom}, {selectedProfile.age} ans
              </h1>
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

            {/* Quick Action Button */}
            <button
              onClick={() => openSendRequestModal(selectedProfile)}
              className="px-6 py-3 rounded-2xl bg-[#2D8659] hover:bg-[#236c47] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Envoyer une demande</span>
            </button>
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

          {/* Bio Section */}
          {selectedProfile.bio && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#0A2F4A] uppercase tracking-wider">
                Démarche & Présentation
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-normal">
                "{selectedProfile.bio}"
              </p>
            </div>
          )}

          {/* Repères Clés Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Vision Mariage */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A2F4A]">
                <CalendarCheck className="w-4 h-4 text-[#2D8659]" />
                <span>Vision du Mariage</span>
              </div>
              <div className="text-sm font-semibold text-slate-800">
                {selectedProfile.visionMariageLabel || selectedProfile.visionMariage || 'Court terme (< 6 mois)'}
              </div>
            </div>

            {/* Dahira / Confrérie */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A2F4A]">
                <Heart className="w-4 h-4 text-[#2D8659]" />
                <span>Dahira / Repère Spirituel</span>
              </div>
              <div className="text-sm font-semibold text-slate-800">
                {selectedProfile.dahira || 'Non spécifié'}
              </div>
            </div>

            {/* Études */}
            {selectedProfile.etudes && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A2F4A]">
                  <GraduationCap className="w-4 h-4 text-[#2D8659]" />
                  <span>Niveau d'études</span>
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  {selectedProfile.etudes}
                </div>
              </div>
            )}

            {/* École / Université */}
            {selectedProfile.ecole && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A2F4A]">
                  <Briefcase className="w-4 h-4 text-[#2D8659]" />
                  <span>École / Université</span>
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  {selectedProfile.ecole}
                </div>
              </div>
            )}

          </div>

          {/* Centres d'Intérêt */}
          {selectedProfile.interets && selectedProfile.interets.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#0A2F4A] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#2D8659]" />
                <span>Centres d'intérêt</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedProfile.interets.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F0F4F2] text-[#0A2F4A] border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Call to Action Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-medium">
              Envoyez une salutation respectueuse pour entamer le dialogue.
            </div>
            <button
              onClick={() => openSendRequestModal(selectedProfile)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#2D8659] hover:bg-[#236c47] text-white font-bold text-sm shadow-lg shadow-[#2D8659]/25 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Envoyer une demande</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
