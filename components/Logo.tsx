'use client';

import Link from 'next/link';

export const LogoMark = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative w-8 h-8 ${className}`}>
      {/* Hatching egg icon */}
      <svg viewBox="0 0 512 512" className="w-full h-full">
        <defs>
          <linearGradient id="logo-emerald" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="logo-shell" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="100%" stopColor="#27272a" />
          </linearGradient>
        </defs>
        
        {/* Background */}
        <circle cx="256" cy="256" r="240" fill="#09090b" />
        <circle cx="256" cy="256" r="240" fill="none" stroke="#27272a" strokeWidth="8" />
        
        {/* Bottom shell */}
        <path 
          d="M 160 280 Q 160 380, 256 400 Q 352 380, 352 280 L 340 260 L 300 275 L 256 255 L 212 275 L 172 260 Z" 
          fill="url(#logo-shell)" 
          stroke="#3f3f46" 
          strokeWidth="6"
        />
        
        {/* Emerging glow */}
        <ellipse cx="256" cy="220" rx="50" ry="60" fill="url(#logo-emerald)" opacity="0.9" />
        <ellipse cx="256" cy="215" rx="25" ry="30" fill="white" opacity="0.7" />
        
        {/* Shell pieces */}
        <path 
          d="M 165 180 Q 165 110, 205 100 L 220 125 L 200 145 L 225 160 L 195 170 Z" 
          fill="url(#logo-shell)" 
          stroke="#3f3f46" 
          strokeWidth="6"
          transform="rotate(-12, 195, 140)"
        />
        <path 
          d="M 347 180 Q 347 110, 307 100 L 292 125 L 312 145 L 287 160 L 317 170 Z" 
          fill="url(#logo-shell)" 
          stroke="#3f3f46" 
          strokeWidth="6"
          transform="rotate(12, 317, 140)"
        />
      </svg>
    </div>
  );
};

export const Logo = ({ href = "/" }: { href?: string }) => {
  return (
    <Link href={href} className="flex items-center gap-2 group">
      <LogoMark />
      <span className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
        HatchIt
      </span>
    </Link>
  );
};
