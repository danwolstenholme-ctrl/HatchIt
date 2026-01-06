'use client'

import { motion } from 'framer-motion'

interface SingularityLoaderProps {
  text?: string
  fullScreen?: boolean
}

export default function SingularityLoader({ text = "INITIALIZING", fullScreen = true }: SingularityLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center relative z-10">
      {/* Geometric H mark - matches transition */}
      <motion.div 
        className="relative w-16 h-16 mb-8"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Outer ring */}
        <motion.div 
          className="absolute inset-0 border border-zinc-800 rounded-full"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Spinning accent */}
        <motion.div 
          className="absolute inset-1 border-t border-emerald-500/50 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner H mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500 rounded-full" />
            <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-emerald-500 rounded-full" />
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500 rounded-full" />
          </div>
        </div>
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
