import React, { useState, useEffect } from 'react';
import { getAllProfiles } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';
import ProfileCard from '../profile/ProfileCard';
import { Search, RotateCcw, SlidersHorizontal, MapPin, Users, Heart, Sparkles, Filter } from 'lucide-react';

export default function HomePage() {
  const { userProfile } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(55);
  const [cityFilter, setCityFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL'); // 'ALL' | 'H' | 'F'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await getAllProfiles(userProfile?.id);
        setProfiles(list);
        setFilteredProfiles(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userProfile]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();

    let result = profiles.filter(p => {
      // Filter by Age
      const age = p.age || 25;
      if (age < minAge || age > maxAge) return false;

      // Filter by City
      if (cityFilter.trim()) {
        const cityMatch = (p.ville || '').toLowerCase().includes(cityFilter.trim().toLowerCase());
        const paysMatch = (p.pays || '').toLowerCase().includes(cityFilter.trim().toLowerCase());
        if (!cityMatch && !paysMatch) return false;
      }

      // Filter by Gender
      if (genderFilter !== 'ALL') {
        if (p.genre !== genderFilter) return false;
      }

      return true;
    });

    setFilteredProfiles(result);
  };

  const handleReset = () => {
    setMinAge(18);
    setMaxAge(55);
    setCityFilter('');
    setGenderFilter('ALL');
    setFilteredProfiles(profiles);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0A2F4A] via-[#134B73] to-[#0A2F4A] text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-[#1E5680]">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D8659] text-white text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Réseau Matrimonial Privé • Diaspora Sénégalaise</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-4xl text-white leading-tight">
            {userProfile?.prenom ? `Bienvenue, ${userProfile.prenom}` : "Trouvez l'union d'honneur qui vous correspond"}
          </h1>
          <p className="text-xs sm:text-sm text-[#A0C0D6] leading-relaxed">
            Parcourez des profils vérifiés à Paris, Dakar, Montréal, New York et d'autres métropoles, guidés par les valeurs et la foi.
          </p>
        </div>

        {/* Ambient Decorative Lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2D8659]/25 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* ============================================================ */}
      {/* BARRE DE FILTRES EN HAUT                                     */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        
        {/* Filter Title / Mobile Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0A2F4A]">
            <SlidersHorizontal className="w-4 h-4 text-[#2D8659]" />
            <span>Filtres de recherche</span>
            <span className="text-xs font-normal text-slate-500 font-mono">
              ({filteredProfiles.length} profil{filteredProfiles.length > 1 ? 's' : ''} disponible{filteredProfiles.length > 1 ? 's' : ''})
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{showMobileFilters ? "Masquer" : "Affiner"}</span>
          </button>
        </div>

        {/* Filter Form Controls */}
        <form onSubmit={handleSearch} className={`space-y-4 sm:space-y-0 sm:grid sm:grid-cols-4 sm:gap-4 items-end ${showMobileFilters ? 'block' : 'hidden sm:grid'}`}>
          
          {/* Filtre Âge (Min - Max) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider">
              Âge : {minAge} - {maxAge} ans
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="18"
                max={maxAge}
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                className="w-1/2 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium text-center focus:border-[#2D8659] outline-none"
                placeholder="Min"
              />
              <span className="text-slate-400 font-bold text-xs">-</span>
              <input
                type="number"
                min={minAge}
                max="85"
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="w-1/2 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium text-center focus:border-[#2D8659] outline-none"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Filtre Ville (Text input) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider">
              Ville / Pôle
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="Paris, Dakar, MTL..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:border-[#2D8659] outline-none"
              />
            </div>
          </div>

          {/* Filtre Genre (Dropdown / Buttons) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0A2F4A] uppercase tracking-wider">
              Genre recherché
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#F0F4F2] p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setGenderFilter('ALL')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  genderFilter === 'ALL'
                    ? 'bg-white text-[#0A2F4A] shadow-sm'
                    : 'text-slate-600 hover:text-[#0A2F4A]'
                }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter('F')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  genderFilter === 'F'
                    ? 'bg-white text-[#2D8659] shadow-sm'
                    : 'text-slate-600 hover:text-[#2D8659]'
                }`}
              >
                Femmes
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter('H')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  genderFilter === 'H'
                    ? 'bg-white text-[#0A2F4A] shadow-sm'
                    : 'text-slate-600 hover:text-[#0A2F4A]'
                }`}
              >
                Hommes
              </button>
            </div>
          </div>

          {/* Action Buttons: Search & Reset */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#2D8659] hover:bg-[#236c47] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>RECHERCHER</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Réinitialiser"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>

      </div>

      {/* ============================================================ */}
      {/* GRID DE PROFILS                                              */}
      {/* ============================================================ */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#2D8659] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Chargement des profils d'élite...</p>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#F0F4F2] text-[#2D8659] mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-[#0A2F4A]">Aucun profil ne correspond à vos critères</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Essayez d'élargir la tranche d'âge ou de réinitialiser la ville pour découvrir plus de membres.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-[#2D8659] text-white text-xs font-bold hover:bg-[#236c47]"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProfiles.map(profile => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}

    </div>
  );
}
