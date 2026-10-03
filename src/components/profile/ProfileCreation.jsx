import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { uploadProfilePhoto } from '../../services/storageService';
import { 
  POPULAR_INTERESTS, 
  VISION_MARIAGE_OPTIONS,
  VALEURS_OPTIONS,
  CRITERES_OPTIONS,
  DEALBREAKERS_OPTIONS
} from '../../data/mockProfiles';
import { calculateAge, isAdult } from '../../utils/age';
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
  ChevronRight,
  ChevronLeft,
  Wand2,
  ShieldAlert
} from 'lucide-react';

export default function ProfileCreation({ isEditing = false, initialStep = 1, onComplete }) {
  const { user, userProfile, updateProfile } = useAuth();
  const { showToast, setCurrentView } = useApp();

  const [step, setStep] = useState(initialStep);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bioGeneratedAuto, setBioGeneratedAuto] = useState(false);
  const totalSteps = 7;

  const [formData, setFormData] = useState({
    prenom: userProfile?.prenom || (user?.displayName ? user.displayName.split(' ')[0] : ''),
    nom: userProfile?.nom || (user?.displayName ? user.displayName.split(' ').slice(1).join(' ') : ''),
    birthDate: userProfile?.birthDate || '',
    genre: userProfile?.genre || 'H',
    etatCivil: userProfile?.etatCivil || '',
    ville: userProfile?.ville || '',
    pays: userProfile?.pays || 'France',
    email: userProfile?.email || user?.email || '',
    telephone: userProfile?.telephone || '',
    profession: userProfile?.profession || '',
    taille: userProfile?.taille || '',
    visionMariage: userProfile?.visionMariage || 'court_terme',
    etudes: userProfile?.etudes || '',
    ecole: userProfile?.ecole || '',
    bio: userProfile?.bio || '',
    rechercheText: userProfile?.rechercheText || '',
    redhibitoireText: userProfile?.redhibitoireText || '',
    interets: userProfile?.interets || [],
    valeurs: userProfile?.valeurs || [],
    criteres: userProfile?.criteres || [],
    dealbreakers: userProfile?.dealbreakers || [],
    financeCouple: userProfile?.financeCouple || 'À discuter',
    polygamie: userProfile?.polygamie || 'Non',
    photos: userProfile?.photos || (user?.photoURL ? [user.photoURL] : []),
    certifieMajeur: false
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customInterest, setCustomInterest] = useState('');
  const [wasValidated, setWasValidated] = useState(false);

  // Initialisation par défaut si photos vide
  useEffect(() => {
    if (formData.photos.length === 0 && !isEditing) {
      setFormData(prev => ({
        ...prev,
        photos: user?.photoURL ? [user.photoURL] : ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80']
      }));
    }
  }, [formData.photos.length, isEditing, user?.photoURL]);

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (formData.photos.length + files.length > 5) {
      showToast("Vous pouvez ajouter jusqu'à 5 photos maximum.", "error");
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadProfilePhoto(file, userProfile?.id || user?.uid || 'current_user'));
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

  // Toggle Tags
  const toggleTag = (field, tag, max) => {
    setFormData(prev => {
      const currentList = prev[field];
      if (currentList.includes(tag)) {
        return { ...prev, [field]: currentList.filter(t => t !== tag) };
      } else {
        if (currentList.length >= max) {
          showToast(`Maximum ${max} sélections autorisées.`, "error");
          return prev;
        }
        return { ...prev, [field]: [...currentList, tag] };
      }
    });
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

  const handleGenerateText = (type) => {
    if (type === 'vision') {
      if (formData.valeurs.length === 0) {
        showToast("Sélectionnez d'abord quelques thèmes !", "error");
        return;
      }
      setFormData(prev => ({
        ...prev,
        bio: `Je rêve d'avoir quelqu'un avec qui construire une vie solide, basée sur : ${prev.valeurs.join(', ')}.`
      }));
      showToast("Texte généré magiquement ✨", "success");
    } else if (type === 'recherche') {
      if (formData.criteres.length === 0) {
        showToast("Sélectionnez d'abord quelques thèmes !", "error");
        return;
      }
      setFormData(prev => ({
        ...prev,
        rechercheText: `Je sais que la clé, c'est une personne qui incarne : ${prev.criteres.join(', ')}.`
      }));
      showToast("Texte généré magiquement ✨", "success");
    } else if (type === 'redhibitoire') {
      setFormData(prev => ({
        ...prev,
        redhibitoireText: `Je n'accepte sous aucun prétexte l'infidélité, le manque de respect ou la violence.`
      }));
      showToast("Texte généré magiquement ✨", "success");
    }
  };

  // Validation
  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (!formData.photos || formData.photos.length === 0) {
          showToast("Veuillez ajouter au moins une photo.", "error");
          return false;
        }
        return true;
      case 2:
        if (!formData.prenom || !formData.birthDate || !formData.pays || !formData.ville || !formData.telephone || !formData.email) {
          showToast("Veuillez remplir tous les champs obligatoires (Étape 2).", "error");
          return false;
        }
        if (!isAdult(formData.birthDate)) {
          showToast("Wétali est réservé aux personnes majeures (18 ans et plus).", "error");
          return false;
        }
        return true;
      case 3:
        if (!formData.profession || !formData.visionMariage) {
          showToast("Veuillez remplir tous les champs obligatoires (Étape 3).", "error");
          return false;
        }
        return true;
      case 4:
        return true; // Optionnel
      case 5:
        // Optionnel, ou on pourrait exiger au moins 1 valeur. On laisse libre.
        return true; 
      case 6:
        return true;
      case 7:
        if (!formData.certifieMajeur) {
          showToast("Vous devez certifier être majeur pour continuer.", "error");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const generateBio = () => {
    const { ville, profession, valeurs, criteres } = formData;
    const selectedVision = VISION_MARIAGE_OPTIONS.find(v => v.value === formData.visionMariage);
    const visionTxt = selectedVision ? selectedVision.label.toLowerCase() : 'fonder un foyer';
    
    let text = `Je suis à ${ville} et je travaille en tant que ${profession}. `;
    text += `Je recherche avant tout à ${visionTxt}. `;
    
    if (valeurs.length > 0) {
      text += `Mes valeurs principales sont : ${valeurs.join(', ')}. `;
    }
    if (criteres.length > 0) {
      text += `Je souhaiterais rencontrer quelqu'un qui est ${criteres.join(', ')}.`;
    }
    return text.trim();
  };

  const nextStep = () => {
    setWasValidated(true);
    if (validateStep(step)) {
      setWasValidated(false);
      if (step === 5 && !formData.bio) {
        setFormData(prev => ({ ...prev, bio: generateBio() }));
        setBioGeneratedAuto(true);
      }
      setStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setWasValidated(false);
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setWasValidated(true);
    if (!validateStep(step)) return;

    setSubmitting(true);
    try {
      const selectedVision = VISION_MARIAGE_OPTIONS.find(v => v.value === formData.visionMariage);
      const profileToSave = {
        ...formData,
        id: userProfile?.id || user?.uid || 'current_user',
        birthDate: new Date(formData.birthDate), // Enregistre en tant que Date JS -> Firestore Timestamp
        visionMariageLabel: selectedVision ? selectedVision.label : formData.visionMariage,
        profileStatus: 'pending',
        updatedAt: new Date().toISOString()
      };
      
      delete profileToSave.certifieMajeur; // Ne pas sauvegarder la case à cocher elle-même

      await updateProfile(profileToSave);
      setShowConfirmation(true);

    } catch (err) {
      showToast(err.message || "Erreur lors de l'enregistrement", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-[#EAF5EF] rounded-full flex items-center justify-center mb-6 shadow-inner animate-bounce">
          <ShieldCheck className="w-10 h-10 text-[#2D8659]" />
        </div>
        <h2 className="font-serif font-bold text-3xl text-[#0A2F4A] mb-4">Profil envoyé ✓</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Vos informations sont en cours de vérification par notre équipe. 
          Ce processus prend généralement entre 12 et 24 heures pour garantir la qualité de la communauté Wétali.
        </p>
        <button
          onClick={() => {
            if (onComplete) onComplete();
            else setCurrentView('home');
          }}
          className="py-3 px-8 rounded-xl bg-[#0A2F4A] text-[#D4AF37] font-bold shadow-lg shadow-[#0A2F4A]/20 transition-all hover:bg-[#061C2C]"
        >
          Accéder à la plateforme
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32 relative min-h-screen">
      
      {/* ProgressBar & Header */}
      <div className="bg-white sticky top-0 z-40 pt-4 pb-4 border-b border-slate-100 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-serif font-bold text-xl text-[#0A2F4A]">
            {isEditing ? "Mise à jour du profil" : "Création de profil"}
          </h1>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Étape {step}/{totalSteps}
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div 
            className="bg-[#D4AF37] h-2 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${wasValidated ? 'was-validated' : ''}`}>
        
        {/* ÉTAPE 1 : PHOTOS */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-[#0A2F4A] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#D4AF37]" />
                <span>Vos Photos (1 à 5)</span>
                <span className="text-rose-500">*</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                La première photo sera votre photo principale. Téléchargez des photos nettes.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {formData.photos.map((photoUrl, index) => (
                <div key={index} className="relative group rounded-2xl overflow-hidden aspect-square border-2 border-slate-200 shadow-sm">
                  <img src={photoUrl} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  {index === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 bg-[#D4AF37] text-[#0A2F4A] text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
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
                <label className="border-2 border-dashed border-slate-300 hover:border-[#D4AF37] rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-slate-50 transition-colors aspect-square text-center">
                  <Plus className="w-6 h-6 text-[#D4AF37] mb-1" />
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
        )}

        {/* ÉTAPE 2 : INFOS PRINCIPALES */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-[#0A2F4A] flex items-center gap-2">
                <User className="w-5 h-5 text-[#D4AF37]" />
                <span>Informations Principales</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                  Date de naissance <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                  Genre <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, genre: 'H' })}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                      formData.genre === 'H' ? 'bg-[#0A2F4A] text-white border-[#0A2F4A]' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Homme
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, genre: 'F' })}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                      formData.genre === 'F' ? 'bg-[#0A2F4A] text-white border-[#0A2F4A]' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Femme
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                  État civil <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Célibataire', 'Marié (polygamie)', 'Divorcé', 'Veuf'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, etatCivil: status })}
                      className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                        formData.etatCivil === status ? 'bg-[#0A2F4A] text-white border-[#0A2F4A]' : 'bg-white text-slate-700 border-slate-300 hover:border-[#D4AF37]'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                  Pays de résidence <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.pays}
                  onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none bg-white"
                >
                  <option value="France">France</option>
                  <option value="Canada">Canada</option>
                  <option value="USA">USA</option>
                  <option value="Royaume-Uni">Royaume-Uni</option>
                  <option value="Italie">Italie</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Sénégal">Sénégal</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                  Ville <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    list="villes-suggestions"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    placeholder="Ex: Paris, Montréal..."
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none"
                  />
                  <datalist id="villes-suggestions">
                    <option value="Paris" />
                    <option value="Marseille" />
                    <option value="Montréal" />
                    <option value="New York" />
                    <option value="Londres" />
                    <option value="Milan" />
                    <option value="Bruxelles" />
                    <option value="Dakar" />
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                  Téléphone <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    placeholder="Ex: +33 6..."
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : PROFESSION & VISION */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-[#0A2F4A] flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#D4AF37]" />
                <span>Profession & Style de vie</span>
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
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
                    placeholder="Ex: Ingénieur Logiciel, Médecin..."
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                  Intention de mariage <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.visionMariage}
                  onChange={(e) => setFormData({ ...formData, visionMariage: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none bg-white font-medium mb-4"
                >
                  {VISION_MARIAGE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} — {opt.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                    Finance dans le couple
                  </label>
                  <select
                    value={formData.financeCouple}
                    onChange={(e) => setFormData({ ...formData, financeCouple: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none bg-white"
                  >
                    <option value="L'homme gère à 100%">L'homme gère à 100%</option>
                    <option value="50/50">50/50</option>
                    <option value="Participation selon revenus">Participation selon revenus</option>
                    <option value="À discuter">À discuter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                    Polygamie
                  </label>
                  <select
                    value={formData.polygamie}
                    onChange={(e) => setFormData({ ...formData, polygamie: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none bg-white"
                  >
                    <option value="Non">Non</option>
                    <option value="Oui">Oui</option>
                    <option value="À discuter">À discuter</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : PARCOURS */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-[#0A2F4A] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
                <span>Parcours (Optionnel)</span>
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                  Niveau d'études
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Bac', 'Bac+2', 'Bac+3', 'Bac+5', 'Doctorat', 'Autre'].map(niv => (
                    <button
                      key={niv}
                      type="button"
                      onClick={() => setFormData({ ...formData, etudes: niv })}
                      className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                        formData.etudes === niv ? 'bg-[#0A2F4A] text-white border-[#0A2F4A]' : 'bg-white text-slate-700 border-slate-300 hover:border-[#D4AF37]'
                      }`}
                    >
                      {niv}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                  Taille en cm
                </label>
                <input
                  type="number"
                  value={formData.taille}
                  onChange={(e) => setFormData({ ...formData, taille: e.target.value })}
                  placeholder="Ex: 170"
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-1.5">
                  École / Université
                </label>
                <input
                  type="text"
                  value={formData.ecole}
                  onChange={(e) => setFormData({ ...formData, ecole: e.target.value })}
                  placeholder="Ex: HEC Paris, UCAD Dakar..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : VISION DU MARIAGE & ATTENTES */}
        {step === 5 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-[#0A2F4A] flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#D4AF37]" />
                <span>Vision du mariage & Attentes</span>
              </h2>
            </div>
            
            <div className="space-y-8">
              {/* BLOCK 1: VISION */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-2">
                    Ta vision du mariage
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Comment envisages-tu le mariage ?"
                      className="w-full p-3.5 pb-10 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateText('vision')}
                      className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-[#F0F4F2] text-[#2D8659] hover:bg-[#EAF5EF] transition-colors shadow-sm border border-[#2D8659]/20"
                      title="Générer avec l'IA"
                    >
                      <Wand2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <label className="text-xs font-bold text-[#0A2F4A]">
                      Thèmes (Vos valeurs) <span className="text-[#D4AF37] ml-2">{formData.valeurs.length}/3 max</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {VALEURS_OPTIONS.map(tag => {
                      const isSelected = formData.valeurs.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag('valeurs', tag, 3)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-[#0A2F4A] text-[#D4AF37] border-[#0A2F4A]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* BLOCK 2: RECHERCHE */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-2">
                    Ce que tu recherches
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={formData.rechercheText}
                      onChange={(e) => setFormData({ ...formData, rechercheText: e.target.value })}
                      placeholder="Les qualités importantes pour toi..."
                      className="w-full p-3.5 pb-10 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateText('recherche')}
                      className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-[#F0F4F2] text-[#2D8659] hover:bg-[#EAF5EF] transition-colors shadow-sm border border-[#2D8659]/20"
                      title="Générer avec l'IA"
                    >
                      <Wand2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <label className="text-xs font-bold text-[#0A2F4A]">
                      Thèmes (Critères) <span className="text-[#D4AF37] ml-2">{formData.criteres.length}/3 max</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CRITERES_OPTIONS.map(tag => {
                      const isSelected = formData.criteres.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag('criteres', tag, 3)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-[#0A2F4A] text-[#D4AF37] border-[#0A2F4A]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* BLOCK 3: LIGNES ROUGES */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider mb-2">
                    Ce que tu n'acceptes pas
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={formData.redhibitoireText}
                      onChange={(e) => setFormData({ ...formData, redhibitoireText: e.target.value })}
                      placeholder="Tes limites et lignes rouges..."
                      className="w-full p-3.5 pb-10 rounded-xl border border-slate-300 text-sm focus:border-[#D4AF37] outline-none resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateText('redhibitoire')}
                      className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-[#F0F4F2] text-[#2D8659] hover:bg-[#EAF5EF] transition-colors shadow-sm border border-[#2D8659]/20"
                      title="Générer avec l'IA"
                    >
                      <Wand2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <label className="text-xs font-bold text-rose-700">
                      Sélection rapide <span className="text-rose-400 ml-2">{formData.dealbreakers?.length || 0}/3 max</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DEALBREAKERS_OPTIONS.map(tag => {
                      const isSelected = formData.dealbreakers?.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag('dealbreakers', tag, 3)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : 'bg-white text-rose-700 border-rose-200 hover:border-rose-300'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 6 : DAHIRA, BIO & INTÉRÊTS */}
        {step === 6 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-[#0A2F4A] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <span>Détails & Centres d'intérêt</span>
              </h2>
            </div>
            
            <div className="space-y-4">




              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#0A2F4A] uppercase tracking-wider">
                    Centres d'intérêt (Max 5)
                  </label>
                  <span className="text-xs font-mono text-[#D4AF37] font-bold">
                    {formData.interets.length}/5
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_INTERESTS.map(tag => {
                    const isSelected = formData.interets.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag('interets', tag, 5)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
                
                <div className="flex gap-2 pt-2 mt-2">
                  <input
                    type="text"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    placeholder="Ajouter un autre intérêt..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#D4AF37] outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCustomInterest}
                    className="px-4 py-2.5 rounded-xl bg-[#0A2F4A] text-[#D4AF37] text-xs font-bold hover:bg-[#061C2C]"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 7 : RÉCAPITULATIF */}
        {step === 7 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 text-center">
              <h2 className="font-serif font-bold text-2xl text-[#0A2F4A]">
                Récapitulatif de votre profil
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Vérifiez vos informations avant de soumettre votre profil.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {formData.photos[0] ? (
                <img 
                  src={formData.photos[0]} 
                  alt="Principale" 
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-md mx-auto sm:mx-0"
                />
              ) : (
                <div className="w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <User className="w-10 h-10 text-slate-300" />
                </div>
              )}
              
              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div>
                    <span className="block text-xs text-slate-500 font-bold uppercase">Prénom & Âge</span>
                    <span className="font-semibold text-slate-800">{formData.prenom}, {calculateAge(formData.birthDate)} ans</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 font-bold uppercase">Ville</span>
                    <span className="font-semibold text-slate-800">{formData.ville}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 font-bold uppercase">Profession</span>
                    <span className="font-semibold text-slate-800">{formData.profession}</span>
                  </div>

                </div>

                {formData.valeurs.length > 0 && (
                  <div>
                    <span className="block text-xs text-slate-500 font-bold uppercase mb-1">Valeurs</span>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.valeurs.map(v => (
                        <span key={v} className="bg-[#EAF5EF] text-[#2D8659] text-[10px] font-bold px-2 py-0.5 rounded">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.certifieMajeur}
                  onChange={(e) => setFormData({...formData, certifieMajeur: e.target.checked})}
                  className="mt-1 w-4 h-4 text-[#2D8659] rounded border-slate-300 focus:ring-[#2D8659]"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Je certifie avoir 18 ans ou plus.
                </span>
              </label>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER ACTIONS (NAVIGATION) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50">
        <div className="max-w-3xl mx-auto flex justify-between gap-4">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1 || submitting}
            className={`flex-1 sm:flex-none py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              step === 1 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Précédent</span>
          </button>
          
          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 sm:flex-none py-3 px-8 rounded-xl bg-[#0A2F4A] text-[#D4AF37] font-bold flex items-center justify-center gap-2 hover:bg-[#061C2C] shadow-lg shadow-[#0A2F4A]/20 transition-all"
            >
              <span>Suivant</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 sm:flex-none py-3 px-8 rounded-xl bg-[#2D8659] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#236c47] shadow-lg shadow-[#2D8659]/20 transition-all"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Check className="w-5 h-5" />
              )}
              <span>Créer mon profil</span>
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
}
