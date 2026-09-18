import React from 'react';

/**
 * WeddingRingLogo Component
 * Utilise le logo original de la Landing Page (fond sombre avec alliances dorées)
 */
export default function WeddingRingLogo({ size = 'md', className = '' }) {
  // Dimension mapping
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const currentSizeClass = sizeMap[size] || sizeMap.md;

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${currentSizeClass} ${className} shrink-0`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="46" fill="#0F172A" stroke="#D4AF37" strokeWidth="4"/>
      <ellipse cx="37" cy="57" rx="18" ry="18" fill="none" stroke="#D4AF37" strokeWidth="5.5"/>
      <ellipse cx="60" cy="44" rx="18" ry="18" fill="none" stroke="#D4AF37" strokeWidth="5.5" opacity="0.8"/>
      <path d="M 37 39 A 18 18 0 0 1 52 43" fill="none" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round"/>
      <polygon points="60,20 66,28 60,34 54,28" fill="#FFFBF0"/>
      <circle cx="60" cy="27" r="2.5" fill="#D4AF37"/>
    </svg>
  );
}
