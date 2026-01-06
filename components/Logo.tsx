'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export const LogoMark = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative w-7 h-7 logo-mark-3d ${className}`}>
      {/* Layer 1: Outer glow (breathing pulse) */}
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-emerald-400/20 rounded-sm blur-md"
      />

      {/* Layer 2: Left face (skewed left, pulsing opacity) */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 to-emerald-600/60 rounded-sm logo-face-left"
      />

      {/* Layer 3: Right face (skewed right, pulsing opacity offset) */}
      <motion.div
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute inset-0 bg-gradient-to-bl from-teal-500/50 to-emerald-500/70 rounded-sm logo-face-right"
      />

      {/* Center seam */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
      </div>

      {/* Layer 4: Lifting lid (top section with clip) */}
      <motion.div
        animate={{ 
          y: [-1, -2.5, -1],
          opacity: [0.6, 0.85, 0.6]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-b from-emerald-400/70 via-emerald-500/50 to-transparent rounded-sm logo-lid"
      />

      {/* Core: Pulsing egg center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-2 h-2.5 bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.4)] logo-egg"
        />
      </div>
    </div>
  );
};

export const Logo = ({ href = "/" }: { href?: string }) => {
  return (
    <Link href={href} className="block">
      <LogoMark />
    </Link>
  );
};
