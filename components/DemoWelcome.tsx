'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2, Lightbulb } from 'lucide-react'
import Image from 'next/image'
import Button from './singularity/Button'

// =============================================================================
// DEMO WELCOME - First-time orientation for demo/guest users
// Clean, helpful, brand-aligned. Shows what's possible, tips for success.
// =============================================================================

interface DemoWelcomeProps {
  onClose: () => void
}

export default function DemoWelcome({ onClose }: DemoWelcomeProps) {
  const [isVisible, setIsVisible] = useState(false)
  const SEEN_KEY = 'hatch_demo_welcome_seen'

  useEffect(() => {
    const hasSeen = localStorage.getItem(SEEN_KEY)
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 300)
      return () => clearTimeout(timer)
    } else {
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  const handleDismiss = () => {
    localStorage.setItem(SEEN_KEY, 'true')
    setIsVisible(false)
    setTimeout(onClose, 200)
  }

  if (!isVisible) return null

  const features = [
    'Live preview as you build',
    'Refine with natural language',
    'Production-ready React code',
  ]

  const tips = [
    { bad: 'A hero section', good: 'A hero for a pet grooming SaaS with booking CTA' },
    { bad: 'Make it look nice', good: 'Dark theme, purple gradients, modern and minimal' },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80" 
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md"
          >
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Top accent line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
              
              <div className="p-6 sm:p-8">
                {/* Header */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center mb-6"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <Image src="/icon.svg" alt="HatchIt" width={28} height={28} />
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Welcome to HatchIt
                  </h1>
                  <p className="text-sm text-zinc-400">
                    Describe what you want. Watch it build.
                  </p>
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2 mb-6"
                >
                  {features.map((feature, i) => (
                    <div 
                      key={feature}
                      className="flex items-center gap-3 text-sm text-zinc-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </motion.div>

                {/* Tips section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-white">Better prompts = better results</span>
                  </div>
                  <div className="space-y-3">
                    {tips.map((tip, i) => (
                      <div key={i} className="text-xs">
                        <div className="text-zinc-500 mb-1">
                          <span className="text-red-400/70">✗</span> {tip.bad}
                        </div>
                        <div className="text-zinc-300">
                          <span className="text-emerald-400">✓</span> {tip.good}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon={<ArrowRight className="w-4 h-4" />}
                    onClick={handleDismiss}
                  >
                    Start Building
                  </Button>
                </motion.div>

                {/* Demo note */}
                <p className="text-center text-[11px] text-zinc-500 mt-4">
                  This is sandbox mode. <span className="text-zinc-400">Sign up free</span> to save your work.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
