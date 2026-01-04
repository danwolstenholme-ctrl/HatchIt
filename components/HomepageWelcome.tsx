'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// =============================================================================
// HOMEPAGE WELCOME - First Contact
// The first thing new users see. Make it count.
// Routes directly to builder - skip the homepage tour.
// =============================================================================

// Matrix rain characters
const CODE_CHARS = '01</>{}[];=>アイウエオカキクケコ'

function MatrixRain() {
  const [columns, setColumns] = useState<number[]>([])
  
  useEffect(() => {
    setColumns(Array.from({ length: 15 }, (_, i) => i * 7))
  }, [])
  
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
      {columns.map((col, i) => (
        <motion.div
          key={col}
          className="absolute top-0 flex flex-col items-center font-mono text-[8px] text-emerald-500/60"
          style={{ left: `${col}%` }}
          initial={{ y: '-100%' }}
          animate={{ y: '100%' }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.3,
          }}
        >
          {Array.from({ length: 15 }, (_, j) => (
            <span key={j} style={{ opacity: 1 - j * 0.06 }}>
              {CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimer)
  }, [delay])
  
  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [text, started])
  
  return (
    <motion.span 
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative inline-block cursor-default"
    >
      <span className={isHovered ? "opacity-0" : "opacity-100"}>
        {displayed}
      </span>
      
      {/* Glitch Overlay on Hover */}
      {isHovered && (
        <span className="absolute inset-0 text-emerald-400 animate-pulse">
          {displayed}
        </span>
      )}
      
      {started && displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-emerald-400"
        >
          _
        </motion.span>
      )}
    </motion.span>
  )
}

export default function HomepageWelcome({ onStart }: { onStart?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [phase, setPhase] = useState<'init' | 'ready'>('init')
  const router = useRouter()
  const SEEN_KEY = 'hatch_homepage_welcome_seen'

  useEffect(() => {
    const hasSeen = localStorage.getItem(SEEN_KEY)
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        // Progress to ready phase after typing animation
        setTimeout(() => setPhase('ready'), 1200)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleStart = () => {
    localStorage.setItem(SEEN_KEY, 'true')
    setIsOpen(false)
    
    // Track the click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'welcome_cta_click', {
        event_category: 'engagement',
        event_label: 'first_contact_modal',
      })
    }
    
    if (onStart) {
      onStart()
    } else {
      // Go straight to builder in guest mode
      router.push('/builder?mode=guest')
    }
  }

  const handleSkip = () => {
    localStorage.setItem(SEEN_KEY, 'true')
    setIsOpen(false)
    
    // Track skip
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'welcome_skip', {
        event_category: 'engagement',
        event_label: 'first_contact_modal',
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          {/* Full black backdrop with subtle glow */}
          <div className="absolute inset-0 bg-black" />
          
          {/* Radial glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Matrix rain background */}
          <MatrixRain />

          {/* Main content - Glass Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 w-full max-w-2xl bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
          >
            {/* Top Bar (Browser/Terminal style) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/50 border border-zinc-800">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">System Online</span>
              </div>
            </div>

            <div className="p-8 md:p-12 text-center">
              {/* Logo with breathing animation */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 mx-auto mb-8 relative"
              >
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                <Image 
                  src="/assets/hatchit_definitive.svg" 
                  alt="HatchIt" 
                  width={64} 
                  height={64}
                  className="w-full h-full relative z-10"
                />
              </motion.div>
              
              {/* Hero Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                  <span className="inline-block bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                    Text
                  </span>
                  <span className="mx-4 text-zinc-700 font-light">→</span>
                  <span className="inline-block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    <TypewriterText text="React" delay={400} />
                  </span>
                </h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: phase === 'ready' ? 1 : 0, y: phase === 'ready' ? 0 : 10 }}
                  className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-md mx-auto font-light"
                >
                  Describe your vision.
                  <br />
                  <span className="text-white font-medium">We build the code.</span>
                </motion.p>
              </motion.div>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: phase === 'ready' ? 1 : 0, y: phase === 'ready' ? 0 : 20 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <motion.button
                  onClick={handleStart}
                  className="group relative w-full max-w-sm mx-auto py-4 px-8 bg-white hover:bg-zinc-100 text-black font-bold text-lg rounded-xl transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative flex items-center justify-center gap-3">
                    Start Building Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
                
                <motion.button
                  onClick={handleSkip}
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors border-b border-transparent hover:border-zinc-700 pb-0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  or explore the homepage first
                </motion.button>
              </motion.div>

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'ready' ? 1 : 0 }}
                transition={{ delay: 0.7 }}
                className="mt-10 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
              >
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px]">TS</div>
                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px]">R</div>
                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px]">TW</div>
                  </div>
                  <span>Stack Included</span>
                </div>

                <div className="hidden md:block w-px h-4 bg-zinc-800" />

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900/50 border border-zinc-800/50">
                  <Globe className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-zinc-500 font-mono">yoursite.hatchitsites.dev</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
