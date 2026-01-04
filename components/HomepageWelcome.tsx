'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
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
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-emerald-400"
        >
          _
        </motion.span>
      )}
    </span>
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

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 w-full max-w-lg text-center"
          >
            {/* Logo with breathing animation */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 mx-auto mb-8"
            >
              <Image 
                src="/assets/hatchit_definitive.svg" 
                alt="HatchIt" 
                width={80} 
                height={80}
                className="w-full h-full"
              />
            </motion.div>
            
            {/* Terminal-style header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 tracking-widest">SYSTEM INITIALIZED</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                <TypewriterText text="Text → React" delay={200} />
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'ready' ? 1 : 0 }}
                className="text-zinc-400 text-lg leading-relaxed max-w-md mx-auto"
              >
                Describe what you want.
                <br />
                <span className="text-emerald-400">Watch it build in real-time.</span>
              </motion.p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase === 'ready' ? 1 : 0, y: phase === 'ready' ? 0 : 20 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <motion.button
                onClick={handleStart}
                className="group relative w-full py-5 px-8 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg rounded-2xl transition-all overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                <span className="relative flex items-center justify-center gap-3">
                  TRY IT FREE
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              
              {/* Skip link */}
              <motion.button
                onClick={handleSkip}
                className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                or explore the homepage first
              </motion.button>
            </motion.div>

            {/* Tech badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'ready' ? 1 : 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-3 mt-8"
            >
              {['React', 'Tailwind', 'TypeScript'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs text-zinc-500 border border-zinc-800 rounded-full bg-zinc-900/50"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
            
            {/* Social proof hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'ready' ? 1 : 0 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-zinc-600 mt-6"
            >
              No account needed • Get a shareable link • Export anytime
            </motion.p>
            
            {/* Share teaser */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'ready' ? 1 : 0 }}
              transition={{ delay: 0.7 }}
              className="mt-4 px-4 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 inline-flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-zinc-500 font-mono">yoursite.hatchitsites.dev</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
