'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Terminal, Sparkles, MessageSquare, Users, Rocket, Heart, Share2, Download, Globe } from 'lucide-react'

interface WelcomeModalProps {
  trigger?: 'auto' | 'manual' | 'post-demo'
  isOpen?: boolean
  onClose?: () => void
}

export default function WelcomeModal({ trigger = 'auto', isOpen: externalIsOpen, onClose }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // If controlled externally, use that state
    if (trigger === 'manual' || trigger === 'post-demo') {
      setIsOpen(externalIsOpen ?? false)
      return
    }
    
    // Auto trigger for first-time users (disabled - now triggered post-demo)
    // const hasSeenWelcome = localStorage.getItem('hatch_v1_welcome_seen')
    // if (!hasSeenWelcome) {
    //   const timer = setTimeout(() => setIsOpen(true), 1500)
    //   return () => clearTimeout(timer)
    // }
  }, [trigger, externalIsOpen])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    localStorage.setItem('hatch_v1_welcome_seen', 'true')
    onClose?.()
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-zinc-900 border border-emerald-500/30 rounded-2xl shadow-[0_0_80px_rgba(16,185,129,0.2)] overflow-hidden"
          >
            {/* Header gradient bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
            
            {/* Close button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Welcome Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Terminal className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to HatchIt 🎉</h2>
                <p className="text-sm text-zinc-400">You just built your first site. That was fast, right?</p>
              </div>

              {/* Mission Statement */}
              <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl mb-5">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <span className="text-emerald-400 font-semibold">Our mission:</span> Make professional web development accessible to everyone. 
                  You describe it, The Architect builds it. Real code you own forever.
                </p>
              </div>

              {/* What You Can Do */}
              <div className="space-y-3 mb-6">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">What you can do now</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-3 bg-zinc-800/50 rounded-lg">
                    <Share2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-zinc-300">Share with friends</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-zinc-800/50 rounded-lg">
                    <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span className="text-xs text-zinc-300">Refine sections</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-zinc-800/50 rounded-lg">
                    <Download className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-xs text-zinc-300">Download code</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-zinc-800/50 rounded-lg">
                    <Globe className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span className="text-xs text-zinc-300">Deploy live</span>
                  </div>
                </div>
              </div>

              {/* V1 Notice */}
              <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-5">
                <Heart className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-200/90 font-medium">We're in V1 — your feedback shapes the future</p>
                  <p className="text-xs text-amber-200/60 mt-1">Found a bug? Want a feature? We're listening. Drop by our Reddit.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <a 
                  href="https://www.reddit.com/r/HatchIt/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors text-sm border border-zinc-700"
                >
                  <Users className="w-4 h-4" />
                  <span>Join Community</span>
                </a>
                <button 
                  onClick={handleClose}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 flex items-center justify-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Keep Building</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Hook to trigger welcome modal after first build
export function useFirstTimeWelcome() {
  const [showWelcome, setShowWelcome] = useState(false)

  const triggerWelcome = useCallback(() => {
    const hasSeenWelcome = localStorage.getItem('hatch_v1_welcome_seen')
    if (!hasSeenWelcome) {
      // Small delay for impact after build completes
      setTimeout(() => setShowWelcome(true), 800)
    }
  }, [])

  const closeWelcome = useCallback(() => {
    setShowWelcome(false)
    localStorage.setItem('hatch_v1_welcome_seen', 'true')
  }, [])

  return { showWelcome, triggerWelcome, closeWelcome }
}
