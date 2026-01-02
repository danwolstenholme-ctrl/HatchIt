'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Wand2, Brain, Terminal, Zap, Network } from 'lucide-react'

// Singularity Loading Sequence
function SingularityLoading({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0)
  const [thought, setThought] = useState("Initializing neural pathways...")
  
  const thoughts = [
    "Initializing neural pathways...",
    "Connecting to The Architect...",
    "Loading design systems...",
    "Calibrating visual cortex...",
    "Ready to create."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => {
        const next = prev + 1
        if (next < thoughts.length) {
          setThought(thoughts[next])
          return next
        } else {
          clearInterval(interval)
          setTimeout(onComplete, 400)
          return prev
        }
      })
    }, 600)
    return () => clearInterval(interval)
  }, [onComplete])

  const icons = [Brain, Terminal, Zap, Network, Sparkles]
  const Icon = icons[phase] || Brain

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Neural Core */}
        <div className="relative w-32 h-32 mb-8">
          {/* Outer rings */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-emerald-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-3 rounded-full border border-emerald-500/40 border-dashed"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-6 rounded-full border border-cyan-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Pulsing glow */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Core icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-16 h-16 rounded-full bg-zinc-900 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-8 h-8 text-emerald-400" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Thought stream */}
        <AnimatePresence mode="wait">
          <motion.div
            key={thought}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            className="text-center"
          >
            <p className="text-lg text-emerald-400 font-mono">{thought}</p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex gap-2 mt-8">
          {thoughts.map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${i <= phase ? 'bg-emerald-500' : 'bg-zinc-700'}`}
              animate={i === phase ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.5, repeat: i === phase ? Infinity : 0 }}
            />
          ))}
        </div>

        {/* Console log */}
        <motion.div 
          className="mt-8 px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-lg font-mono text-xs text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-emerald-500">▸</span> kernel.singularity.init()
        </motion.div>
      </div>
    </div>
  )
}

// Ready to Build Screen
function ReadyToBuild() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isSignedIn } = useUser()
  const prompt = searchParams.get('prompt') || ''
  const upgrade = searchParams.get('upgrade') || ''

  const startBuilder = () => {
    const params = new URLSearchParams()
    if (prompt) params.set('prompt', prompt)
    if (!isSignedIn) params.set('mode', 'guest')
    if (upgrade) params.set('upgrade', upgrade)
    const path = params.toString() ? `/builder?${params.toString()}` : '/builder'
    router.push(path)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-zinc-950 text-white relative overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.08),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.08),transparent_40%)]" />

      <div className="relative z-10 max-w-xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            System ready
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Ready to build.
          </h1>

          <p className="text-lg text-zinc-400 mb-8 max-w-md mx-auto">
            {prompt 
              ? `Your prompt is locked. Hit start and watch it manifest.`
              : `The Architect is standing by. Describe your vision.`
            }
          </p>

          <motion.button
            onClick={startBuilder}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 text-black rounded-lg font-semibold text-lg shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:bg-emerald-400 transition"
          >
            <Wand2 className="w-5 h-5" />
            Start building
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <p className="text-sm text-zinc-500 mt-6">
            Free to try • Sign up when you're ready to save
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

function LaunchContent() {
  const [showLoading, setShowLoading] = useState(true)

  return (
    <AnimatePresence mode="wait">
      {showLoading ? (
        <motion.div key="loading" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <SingularityLoading onComplete={() => setShowLoading(false)} />
        </motion.div>
      ) : (
        <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ReadyToBuild />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function LaunchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}> 
      <LaunchContent />
    </Suspense>
  )
}
