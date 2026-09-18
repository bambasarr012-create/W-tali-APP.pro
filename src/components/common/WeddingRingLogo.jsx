import React from 'react';

/**
 * WeddingRingLogo Component
 * Logo iconique représentant l'alliance matrimoniale (anneaux d'alliances en or entrelacés avec diamant / éclat).
 */
export default function WeddingRingLogo({ size = 'md', className = '', badge = true }) {
  // Dimension mapping
  const sizeMap = {
    xs: { box: 'w-7 h-7', svg: 'w-4 h-4', stroke: 2.2 },
    sm: { box: 'w-9 h-9', svg: 'w-5 h-5', stroke: 2.5 },
    md: { box: 'w-10 h-10', svg: 'w-6 h-6', stroke: 2.5 },
    lg: { box: 'w-14 h-14', svg: 'w-8 h-8', stroke: 2.8 },
    xl: { box: 'w-16 h-16', svg: 'w-10 h-10', stroke: 3 }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const SvgContent = (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${currentSize.svg} ${!badge ? className : ''}`}
    >
      <defs>
        {/* Gradient Or Royal */}
        <linearGradient id="wetaliGoldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="30%" stopColor="#E5C07B" />
          <stop offset="70%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#997514" />
        </linearGradient>
        
        {/* Gradient Or Brillant 2 */}
        <linearGradient id="wetaliGoldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#F5D77F" />
          <stop offset="60%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#805C06" />
        </linearGradient>

        {/* Éclat Diamant */}
        <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#D8F3FF" />
          <stop offset="100%" stopColor="#A5D8F3" />
        </linearGradient>

        <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Anneau 1 (Gauche - Alliance principale) */}
      <ellipse
        cx="14"
        cy="20"
        rx="8"
        ry="8"
        stroke="url(#wetaliGoldGrad1)"
        strokeWidth={currentSize.stroke}
        fill="none"
      />

      {/* Anneau 2 (Droite - Alliance avec solitaire/diamant) */}
      <ellipse
        cx="22"
        cy="16"
        rx="8"
        ry="8"
        stroke="url(#wetaliGoldGrad2)"
        strokeWidth={currentSize.stroke}
        fill="none"
      />

      {/* Entrelacement d'alliances : arc supérieur de l'anneau 1 au-dessus de l'anneau 2 */}
      <path
        d="M 14 12 A 8 8 0 0 1 20 14.8"
        stroke="url(#wetaliGoldGrad1)"
        strokeWidth={currentSize.stroke + 0.3}
        strokeLinecap="round"
        fill="none"
      />

      {/* Solitaire / Diamant monté sur l'alliance de droite */}
      <g transform="translate(22, 8)">
        {/* Support de pierre */}
        <path
          d="M -2.5 0 L 0 -2 L 2.5 0 L 1.5 2.5 L -1.5 2.5 Z"
          fill="url(#diamondGrad)"
          stroke="#FFFFFF"
          strokeWidth="0.5"
          filter="url(#ringGlow)"
        />
        {/* Étoile de brillance scintillante */}
        <path
          d="M 0 -4.5 L 0.8 -1.2 L 4 -0.5 L 0.8 0.2 L 0 3.5 L -0.8 0.2 L -4 -0.5 L -0.8 -1.2 Z"
          fill="#FFFFFF"
        />
        <circle cx="0" cy="-0.5" r="0.8" fill="#FFF9D2" />
      </g>
    </svg>
  );

  if (!badge) {
    return SvgContent;
  }

  return (
    <div className={`${currentSize.box} rounded-full bg-gradient-to-tr from-[#2D8659] via-[#38A169] to-[#D4AF37] p-[2px] shadow-md flex-shrink-0 ${className}`}>
      <div className="w-full h-full rounded-full bg-[#0A2F4A] flex items-center justify-center relative overflow-hidden">
        {/* Reflet subtil de fond */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-full" />
        {SvgContent}
      </div>
    </div>
  );
}
