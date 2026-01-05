'use client'

import { motion } from 'framer-motion'

interface SingularityLoaderProps {
  text?: string
  fullScreen?: boolean
}

export default function SingularityLoader({ text = "INITIALIZING", fullScreen = true }: SingularityLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center relative z-10">
      {/* Hexagon/Logo Loader */}
      <div className="relative w-24 h-24 mb-8">
        {/* Outer Ring */}
        <motion.div 
          className="absolute inset-0 border border-emerald-500/20 rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Spinning Segments */}
        <motion.div 
          className="absolute inset-2 border-t-2 border-r-2 border-emerald-500/50 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-4 border-b-2 border-l-2 border-teal-500/50 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Core Pulse */}
        <motion.div 
          className="absolute inset-0 m-auto w-4 h-4 bg-emerald-500 rounded-full blur-sm"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>

      {/* Text Glitch Effect */}
      <div className="relative">
        <motion.div 
          className="text-emerald-500 font-mono text-sm tracking-[0.2em] font-bold"
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
        >
          {text}
        </motion.div>
        <motion.div 
          className="absolute top-0 left-0 text-teal-400 font-mono text-sm tracking-[0.2em] font-bold mix-blend-screen opacity-50"
          animate={{ x: [-2, 2, -2], opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.2, repeat: Infinity }}
        >
          {text}
        </motion.div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-48 h-0.5 bg-zinc-800 mt-6 overflow-hidden rounded-full">
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  )

  if (!fullScreen) return content

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay" />
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
      
      {content}
    </div>
  )
}
