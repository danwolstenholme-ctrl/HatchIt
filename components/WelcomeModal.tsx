'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Heart, Bug, Mail, ArrowRight } from 'lucide-react'

// =============================================================================
// WELCOME MODAL
// A simple thank-you modal for guest users when they land on the builder
// Dismissible, no branding, just gratitude + community links
// =============================================================================

interface WelcomeModalProps {
  trigger?: 'auto' | 'manual' | 'guest' | 'post-demo'
  isOpen?: boolean
  onClose?: () => void
}

export default function WelcomeModal({ trigger = 'auto', isOpen: externalIsOpen, onClose }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const SEEN_KEY = 'welcome_dismissed'

  useEffect(() => {
    // If controlled externally, use that state
    if (trigger === 'manual' || trigger === 'post-demo') {
      setIsOpen(externalIsOpen ?? false)
      return
    }
    
    // Auto trigger for guests on first visit
    if (trigger === 'guest') {
      const hasSeenWelcome = sessionStorage.getItem(SEEN_KEY)
      if (!hasSeenWelcome) {
        const timer = setTimeout(() => setIsOpen(true), 600)
        return () => clearTimeout(timer)
      }
    }
  }, [trigger, externalIsOpen])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    sessionStorage.setItem(SEEN_KEY, 'true')
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-4">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  SYSTEM ONLINE
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Welcome to the Machine.
                </h2>
                <p className="text-zinc-400 leading-relaxed">
                  You are now the Architect. This is not a drag-and-drop tool. It is a conversation with an intelligence that writes code.
                </p>
              </div>

              {/* Message from Us */}
              <div className="mb-8 p-4 bg-zinc-800/30 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
                  <MessageSquare className="w-3 h-3" />
                  Transmission from HQ
                </div>
                <p className="text-sm text-zinc-300 italic">
                  "We built this because we were tired of fighting with website builders. We wanted something that felt like magic. 
                  Be bold. Ask for weird things. Break the rules. If it breaks, tell us."
                </p>
                <div className="mt-2 text-right text-xs text-zinc-500 font-mono">— The Founders</div>
              </div>

              {/* Dos and Donts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> DO
                  </h3>
                  <ul className="text-xs text-zinc-400 space-y-2">
                    <li>• Describe the "vibe" (e.g., "cyberpunk", "minimalist")</li>
                    <li>• Ask for specific sections ("hero", "pricing")</li>
                    <li>• Iterate. The first draft is just the beginning.</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-red-500">✕</span> DON'T
                  </h3>
                  <ul className="text-xs text-zinc-400 space-y-2">
                    <li>• Worry about pixel perfection immediately</li>
                    <li>• Write code yourself (unless you want to)</li>
                    <li>• Be afraid to hit "Regenerate"</li>
                  </ul>
                </div>
              </div>

              {/* Community Links */}
              <div className="space-y-3 mb-8">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Join the Resistance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://reddit.com/r/HatchIt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 bg-zinc-800/50 hover:bg-[#FF4500]/10 border border-zinc-700/50 hover:border-[#FF4500]/50 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FF4500]/10 flex items-center justify-center text-[#FF4500]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm">r/HatchIt</div>
                      <p className="text-[10px] text-zinc-500">Official Community</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-[#FF4500] transition-colors" />
                  </a>

                  <a
                    href="https://reddit.com/u/HatchIt_Dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white">
                      <span className="font-bold text-xs">u/</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm">u/HatchIt_Dev</div>
                      <p className="text-[10px] text-zinc-500">Mod Updates</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                  </a>
                </div>
              </div>

              {/* CTA */}
              <button 
                onClick={handleClose}
                className="w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              >
                Initialize Builder
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Hook to trigger welcome modal
export function useWelcomeModal() {
  const [showWelcome, setShowWelcome] = useState(false)
  const SEEN_KEY = 'welcome_dismissed'

  const triggerWelcome = useCallback(() => {
    const hasSeenWelcome = sessionStorage.getItem(SEEN_KEY)
    if (!hasSeenWelcome) {
      setTimeout(() => setShowWelcome(true), 600)
    }
  }, [])

  const closeWelcome = useCallback(() => {
    setShowWelcome(false)
    sessionStorage.setItem(SEEN_KEY, 'true')
  }, [])

  return { showWelcome, triggerWelcome, closeWelcome }
}
