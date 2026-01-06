'use client';

import Link from 'next/link';

// SVG wordmark for "HatchIt" - clean, modern typography
export const LogoWordmark = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 140 32" 
      className={`h-7 ${className}`}
      aria-label="HatchIt"
    >
      <defs>
        <linearGradient id="wordmark-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <text 
        x="0" 
        y="24" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontWeight="700" 
        fontSize="26"
        letterSpacing="-0.02em"
      >
        <tspan fill="white">Hatch</tspan>
        <tspan fill="url(#wordmark-gradient)">It</tspan>
      </text>
    </svg>
  );
};

export const Logo = ({ href = "/" }: { href?: string }) => {
  return (
    <Link href={href} className="flex items-center group">
      <LogoWordmark className="group-hover:opacity-80 transition-opacity" />
    </Link>
  );
};

