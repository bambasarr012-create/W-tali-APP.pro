import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function VerifiedBadge({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 p-0.5',
    md: 'w-5 h-5 p-1',
    lg: 'w-6 h-6 p-1.5'
  };

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div 
      title="Profil Vérifié"
      className={`bg-[#2D8659] text-white rounded-full flex items-center justify-center shadow-sm border border-white ${sizeClasses[size]} ${className}`}
    >
      <ShieldCheck className={iconSizes[size]} />
    </div>
  );
}
