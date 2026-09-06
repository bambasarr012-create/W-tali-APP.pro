import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { uploadProfilePhoto } from '../../services/storageService';
import { 
  POPULAR_INTERESTS, 
  DAHIRA_OPTIONS, 
  VISION_MARIAGE_OPTIONS 
} from '../../data/mockProfiles';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  User, 
  MapPin, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Calendar 
} from 'lucide-react';

export default function ProfileCreation({ isEditing = false, onComplete }) {
  const { user, userProfile, updateProfile } = useAuth();
  const { showToast, setCurrentView } = useApp();

  const [formData, setFormData] = useState({
    prenom: userProfile?.prenom || '',
    nom: userProfile?.nom || '',
    age: userProfile?.age || '',
    genre: userProfile?.genre || 'H', // 'H' ou 'F'
    ville: userProfile?.ville || '',
    pays: userProfile?.pays || 'France',
    email: userProfile?.email || user?.email || '',
    telephone: userProfile?.telephone || '',
    profession: userProfile?.profession || '',
    visionMariage: userProfile?.visionMariage || 'court_terme',
    etudes: userProfile?.etudes || '',
    ecole: userProfile?.ecole || '',
    dahira: userProfile?.dahira || 'Touba Mouride',
    bio: userProfile?.bio || '',
    interets: userProfile?.interets || ['Spiritualité', 'Cuisine sénégalaise', 'Entrepreneuriat'],
    photos: userProfile?.photos || [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
    ]
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customInterest, setCustomInterest] = useState('');

  // Handle Photo Upload
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (formData.photos.length + files.length > 5) {
      showToast("Vous pouvez ajouter jusqu'à 5 photos maximum.", "error");
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadProfilePhoto(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...uploadedUrls]
      }));
      showToast("Photo(s) ajoutée(s) avec succès !", "success");
    } catch (err) {
      showToast(err.message || "Erreur d'upload", "error");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index) => {
    if (formData.photos.length <= 1) {
      showToast("Vous devez conserver au moins une photo de profil.", "error");
      return;
    }
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, idx) => idx !== index)
    }));
  };

  // Tag toggling
  const toggleInterest = (tag) => {
    if (formData.interets.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        interets: prev.interets.filter(t => t !== tag)
      }));
    } else {
      if (formData.interets.length >= 5) {
        showToast("Maximum 5 centres d'intérêt.", "error");
        return;
      }
      setFormData(prev => ({
        ...prev,
        interets: [...prev.interets, tag]
      }));
    }
  };

  const addCustomInterest = (e) => {
    e.preventDefault();
    if (!customInterest.trim()) return;
    if (formData.interets.length >= 5) {
      showToast("Maximum 5 centres d'intérêt.", "error");
      return;
    }
    if (!formData.interets.includes(customInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interets: [...prev.interets, customInterest.trim()]
      }));
    }
    setCustomInterest('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs obligatoires
    if (!formData.prenom || !formData.age || !formData.ville || !formData.telephone || !formData.profession || !formData.visionMariage) {
      showToast("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }

    if (!formData.photos || formData.photos.length === 0) {
      showToast("Veuillez ajouter au moins une photo de profil.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const selectedVision = VISION_MARIAGE_OPTIONS.find(v => v.value === formData.visionMariage);
      const profileToSave = {
        ...formData,
        id: userProfile?.id || user?.uid || 'current_user',
        age: parseInt(formData.age, 10),
        visionMariageLabel: selectedVision ? selectedVision.label : formData.visionMariage,
        verified: true,
        updatedAt: new Date().toISOString()
      };

      await updateProfile(profileToSave);
      showToast(isEditing ? "Profil mis à jour avec succès !" : "Profil créé avec succès ! Bienvenue dans le cercle Wétali.", "success");
      
      if (onComplete) {
        onComplete();
      } else {
        setCurrentView('home');
      }
    } catch (err) {
      showToast(err.message || "Erreur lors de l'enregistrement", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A2F4A] to-[#134B73] text-white p-6 sm:p-8 rounded-3xl shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D8659] text-white text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEditing ? "Édition du Profil" : "Création de Profil Matrimonial"}</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            {isEditing ? "Mettez à jour vos repères" : "Parlez-nous de vous et de vos aspirations"}
          </h1>
          <p className="text-xs sm:text-sm text-[#A0C0D6] max-w-xl">
            Vos informations permettent à l'algorithme Wétali d'identifier des profils partageant les mêmes repères culturels et spirituels.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* SECTION 1: PHOTOS (1 à 5 images) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-base text-[#0A2F4A] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#2D8659]" />
                <span>Vos Photos de Profil (1 à 5)</span>
                <span className="text-rose-500 text-sm">*</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                La première photo sera votre photo principale. Téléchargez des photos claires et soignées.
              </p>
            </div>
            <span className="text-xs font-bold font-mono text-[#2D8659] bg-[#EAF5EF] px-2.5 py-1 rounded-full">
              {formData.photos.length}/5
            </span>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {formData.photos.map((photoUrl, index) => (
              <div key={index} className="relative group rounded-2xl overflow-hidden aspect-square border-2 border-slate-200 shadow-sm">
                <img src={photoUrl} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                {index === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 bg-[#2D8659] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    Principale
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {formData.photos.length < 5 && (
              <label className="border-2 border-dashed border-slate-300 hover:border-[#2D8659] rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-slate-50 transition-colors aspect-square text-center">
                <Plus className="w-6 h-6 text-[#2D8659] mb-1" />
                <span className="text-[11px] font-semibold text-slate-600">
                  {uploading ? "Ajout..." : "Ajouter"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* SECTION 2: INFORMATIONS OBLIGATOIRES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-[#0A2F4A] flex items-center gap-2">
              <User className="w-5 h-5 text-[#2D8659]" />
              <span>Informations Principales</span>
              <span className="text-rose-500 text-xs font-normal">(Obligatoires *)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Prénom */}
            <div>
              <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                Prénom <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                placeholder="Ex: Amadou"
                className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-[#2D8659] focus:ring-2 focus:ring-[#2D8659]/20 outline-none"
              />
            </div>

            {/* Âge */}
            <div>
              <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                Âge <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="18"
                max="85"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Ex: 29"
                className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-[#2D8659] focus:ring-2 focus:ring-[#2D8659]/20 outline-none"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                Genre <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, genre: 'H' })}
                  className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                    formData.genre === 'H'
                      ? 'bg-[#0A2F4A] text-white border-[#0A2F4A]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Homme
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, genre: 'F' })}
                  className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                    formData.genre === 'F'
                      ? 'bg-[#2D8659] text-white border-[#2D8659]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Femme
                </button>
              </div>
            </div>

            {/* Ville (Champ libre) */}
            <div>
              <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                Ville de résidence <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.ville}
                  onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                  placeholder="Ex: Paris, Dakar, Montréal, New York..."
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-[#2D8659] focus:ring-2 focus:ring-[#2D8659]/20 outline-none"
                />
              </div>
            </div>

            {/* Email (Pre-filled) */}
            <div>
              <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                Adresse E-mail <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="amadou@example.com"
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-800 focus:border-[#2D8659] outline-none"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                Numéro de téléphone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  placeholder="Ex: +33 6 12 34 56 78"
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-[#2D8659] focus:ring-2 focus:ring-[#2D8659]/20 outline-none"
                />
              </div>
            </div>

            {/* Profession */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                Profession / Activité <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  placeholder="Ex: Ingénieur Logiciel, Médecin, Juriste, Entrepreneur..."
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-[#2D8659] focus:ring-2 focus:ring-[#2D8659]/20 outline-none"
                />
              </div>
            </div>

            {/* Vision du Mariage */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                Vision du Mariage <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.visionMariage}
                onChange={(e) => setFormData({ ...formData, visionMariage: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-[#2D8659] focus:ring-2 focus:ring-[#2D8659]/20 outline-none bg-white font-medium"
              >
                {VISION_MARIAGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} — {opt.desc}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* SECTION 3: INFORMATIONS OPTIONNELLES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-[#0A2F4A] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#2D8659]" />
              <span>Parcours & Affinités</span>
              <span className="text-slate-400 text-xs font-normal">(Optionnels mais recommandés)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Études */}
            <div>
              <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                Niveau d'études
              </label>
              <input
                type="text"
                value={formData.etudes}
                onChange={(e) => setFormData({ ...formData, etudes: e.target.value })}
                placeholder="Ex: Bac+5 (Master / Ingénieur)"
                className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-[#2D8659] outline-none"
              />
            </div>

            {/* École / Université */}
            <div>
              <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                École / Université
              </label>
              <input
                type="text"
                value={formData.ecole}
                onChange={(e) => setFormData({ ...formData, ecole: e.target.value })}
                placeholder="Ex: HEC Paris, UCAD Dakar, McGill..."
                className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-[#2D8659] outline-none"
              />
            </div>

            {/* Dahira */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                Dahira / Repère Spirituel
              </label>
              <select
                value={formData.dahira}
                onChange={(e) => setFormData({ ...formData, dahira: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-[#2D8659] outline-none bg-white font-medium"
              >
                {DAHIRA_OPTIONS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Bio (Max 200 chars) */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0A2F4A] uppercase tracking-wider">
                  Présentation personnelle / Bio
                </label>
                <span className={`text-[11px] font-mono ${formData.bio.length > 200 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                  {formData.bio.length}/200
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={200}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Quelques mots sur vos valeurs, votre personnalité et ce que vous recherchez..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-[#2D8659] focus:ring-2 focus:ring-[#2D8659]/20 outline-none resize-none"
              />
            </div>

            {/* Intérêts (Tags, max 5) */}
            <div className="sm:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0A2F4A] uppercase tracking-wider">
                  Centres d'intérêt (Sélectionnez jusqu'à 5)
                </label>
                <span className="text-xs font-mono text-[#2D8659] font-bold">
                  {formData.interets.length}/5
                </span>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-2">
                {POPULAR_INTERESTS.map(tag => {
                  const isSelected = formData.interets.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#2D8659] text-white border-[#2D8659] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom tag input */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="Ajouter un autre intérêt personnalisé..."
                  className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-[#2D8659] outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomInterest}
                  className="px-4 py-2.5 rounded-xl bg-[#0A2F4A] text-white text-xs font-bold hover:bg-[#061C2C]"
                >
                  Ajouter
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-[#2D8659] hover:bg-[#236c47] text-white font-bold text-base shadow-lg shadow-[#2D8659]/25 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>{submitting ? "Enregistrement en cours..." : isEditing ? "Sauvegarder les modifications" : "Créer mon profil"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
