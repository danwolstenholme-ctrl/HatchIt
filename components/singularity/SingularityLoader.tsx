'use client'

import { motion } from 'framer-motion'

interface SingularityLoaderProps {
  text?: string
  fullScreen?: boolean
}

export default function SingularityLoader({ text = "INITIALIZING", fullScreen = true }: SingularityLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center relative z-10">
      {/* Hatching egg icon */}
      <motion.div 
        className="relative w-16 h-16 mb-8"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 512 512" className="w-full h-full">
          <defs>
            <linearGradient id="loader-emerald" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="loader-shell" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3f3f46" />
              <stop offset="100%" stopColor="#27272a" />
            </linearGradient>
            <filter id="loader-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Background */}
          <circle cx="256" cy="256" r="240" fill="#09090b" />
          <circle cx="256" cy="256" r="240" fill="none" stroke="#27272a" strokeWidth="8" />
          
          {/* Bottom shell */}
          <path 
            d="M 160 280 Q 160 380, 256 400 Q 352 380, 352 280 L 340 260 L 300 275 L 256 255 L 212 275 L 172 260 Z" 
            fill="url(#loader-shell)" 
            stroke="#3f3f46" 
            strokeWidth="6"
          />
          
          {/* Emerging glow - animated */}
          <motion.ellipse 
            cx="256" 
            cy="220" 
            rx="50" 
            ry="60" 
            fill="url(#loader-emerald)" 
            filter="url(#loader-glow)"
            animate={{ opacity: [0.7, 1, 0.7], ry: [58, 62, 58] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <ellipse cx="256" cy="215" rx="25" ry="30" fill="white" opacity="0.7" />
          
          {/* Shell pieces - floating animation */}
          <motion.g
            animate={{ y: [0, -5, 0], rotate: [-12, -15, -12] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "195px", originY: "140px" }}
          >
            <path 
              d="M 165 180 Q 165 110, 205 100 L 220 125 L 200 145 L 225 160 L 195 170 Z" 
              fill="url(#loader-shell)" 
              stroke="#3f3f46" 
              strokeWidth="6"
              transform="rotate(-12, 195, 140)"
            />
          </motion.g>
          <motion.g
            animate={{ y: [0, -5, 0], rotate: [12, 15, 12] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{ originX: "317px", originY: "140px" }}
          >
            <path 
              d="M 347 180 Q 347 110, 307 100 L 292 125 L 312 145 L 287 160 L 317 170 Z" 
              fill="url(#loader-shell)" 
              stroke="#3f3f46" 
              strokeWidth="6"
              transform="rotate(12, 317, 140)"
            />
          </motion.g>
        </svg>
      </motion.div>

      {/* Status Text - mono, uppercase, tracked */}
      <div className="text-zinc-500 font-mono text-xs tracking-[0.2em] uppercase">
        {text}
      </div>
      
      {/* Progress Line - indeterminate */}
      <div className="w-32 h-px bg-zinc-800 mt-6 overflow-hidden">
        <motion.div 
          className="h-full w-8 bg-emerald-500"
          animate={{ x: ["-100%", "400%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  )

  if (!fullScreen) return content

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      {content}
    </div>
  )
}
