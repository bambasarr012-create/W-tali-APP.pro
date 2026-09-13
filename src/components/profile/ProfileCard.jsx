import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { calculatePointsCommuns } from '../../services/firestoreService';
import { MapPin, Briefcase, Heart, Sparkles, ChevronRight } from 'lucide-react';
import VerifiedBadge from '../common/VerifiedBadge';

export default function ProfileCard({ profile }) {
  const { viewProfileDetail, openSendRequestModal } = useApp();
  const { userProfile } = useAuth();

  const affinity = calculatePointsCommuns(userProfile, profile);
  const mainPhoto = profile.photos && profile.photos[0] 
    ? profile.photos[0] 
    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";

  return (
    <div 
      onClick={() => viewProfileDetail(profile)}
      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#2D8659]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
    >
      {/* Photo Container with Overlays */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
        <img
          src={mainPhoto}
          alt={profile.prenom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2F4A]/90 via-[#0A2F4A]/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          {profile.profileStatus === 'verified' ? (
            <VerifiedBadge size="md" />
          ) : (
            <div></div>
          )}

          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-[#0A2F4A] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            <MapPin className="w-3 h-3 text-[#2D8659]" />
            <span>{profile.ville}</span>
          </span>
        </div>

        {/* Bottom Card Identity Info */}
        <div className="absolute bottom-3 inset-x-3 text-white space-y-1">
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif font-bold text-xl text-white drop-shadow-sm flex items-center gap-1.5">
              <span>{profile.prenom}</span>
              <span className="font-sans font-normal text-base text-slate-200">{profile.age} ans</span>
            </h3>
            {affinity.score && (
              <span className="text-[11px] font-mono font-bold bg-[#2D8659] text-white px-2 py-0.5 rounded-full shadow">
                {affinity.score}% match
              </span>
            )}
          </div>
          <p className="text-xs text-slate-200 truncate flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
            <span>{profile.profession}</span>
          </p>
        </div>
      </div>

      {/* Card Details / Footer */}
      <div className="p-4 space-y-3">
        {/* Dahira & Vision Tags */}
        <div className="flex flex-wrap gap-1.5">
          {profile.dahira && (
            <span className="text-[10px] font-medium bg-[#F0F4F2] text-[#2D8659] px-2 py-0.5 rounded-md">
              {profile.dahira}
            </span>
          )}
          {profile.visionMariageLabel && (
            <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
              {profile.visionMariageLabel}
            </span>
          )}
        </div>

        {/* Bio snippet */}
        {profile.bio && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            "{profile.bio}"
          </p>
        )}

        {/* Action button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openSendRequestModal(profile);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-[#2D8659] hover:bg-[#236c47] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>Envoyer demande</span>
          </button>
        </div>
      </div>
    </div>
  );
}
