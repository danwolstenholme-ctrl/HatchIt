'use client'

// =============================================================================
// VOID TRANSITION
// Unique "entering the void" animation for /demo → /builder
// Lives in /components/singularity/ for easy editing
// Usage: <VoidTransition onComplete={() => router.push('/builder')} />
// =============================================================================

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const VOID_MESSAGES = [
  "Initializing...",
  "Ready."
]

interface VoidTransitionProps {
  onComplete: () => void
  prompt?: string // Optional: show what they're building
}

export default function VoidTransition({ onComplete, prompt }: VoidTransitionProps) {
  const [phase, setPhase] = useState<'expand' | 'messages' | 'collapse'>('expand')
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    // Phase 1: Expand (0.4s)
    const expandTimer = setTimeout(() => {
      setPhase('messages')
    }, 400)

    return () => clearTimeout(expandTimer)
  }, [])

  useEffect(() => {
    if (phase !== 'messages') return

    // Cycle through messages faster
    const messageTimer = setInterval(() => {
      setMessageIndex(prev => {
        if (prev >= VOID_MESSAGES.length - 1) {
          clearInterval(messageTimer)
          // Phase 3: Collapse and complete
          setTimeout(() => {
            setPhase('collapse')
            setTimeout(onComplete, 300)
          }, 400)
          return prev
        }
        return prev + 1
      })
    }, 500)

    return () => clearInterval(messageTimer)
  }, [phase, onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* The Void - Expanding black circle */}
      <motion.div
        className="absolute bg-black rounded-full"
        initial={{ width: 0, height: 0 }}
        animate={
          phase === 'expand' || phase === 'messages'
            ? { width: '200vmax', height: '200vmax' }
            : { width: '200vmax', height: '200vmax' }
        }
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Content inside the void */}
      <AnimatePresence mode="wait">
        {(phase === 'messages' || phase === 'collapse') && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex flex-col items-center text-center px-6"
          >
            {/* Simple spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mb-6"
            />

            {/* Message */}
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-zinc-400 text-sm font-mono"
              >
                {VOID_MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
