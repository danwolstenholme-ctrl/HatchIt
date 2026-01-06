'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Command } from 'lucide-react'
import Image from 'next/image'

// =============================================================================
// GUEST PROMPT MODAL
// Cinematic prompt entry for guest users.
// =============================================================================

interface GuestPromptModalProps {
  isOpen: boolean
  onSubmit: (prompt: string) => void
}

export default function GuestPromptModal({ isOpen, onSubmit }: GuestPromptModalProps) {
  const [prompt, setPrompt] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation: Minimum 10 characters
  const isValid = prompt.trim().length >= 10

  const handleSubmit = () => {
    if (!isValid) return
    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit(prompt)
    }, 800)
  }

  // Quick prompt suggestions
  const suggestions = [
    'Hero with animated gradient background',
    'Pricing table with 3 tiers',
    'Testimonial carousel with avatars',
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/80 backdrop-blur-sm"
        >
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.2 }}
            className="relative z-10 w-full max-w-xl mx-4"
          >
            <div className="relative bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 p-8 md:p-10">
              
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-12 h-12 mx-auto mb-6"
                >
                  <Image 
                    src="/icon.svg" 
                    alt="HatchIt" 
                    width={48} 
                    height={48}
                    className="w-full h-full"
                  />
                </motion.div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                  <span className="text-zinc-400">Describe it.</span>
                  <br />
                  <span className="text-emerald-400">Watch it build.</span>
                </h1>
                <p className="text-zinc-400 text-base md:text-lg max-w-sm mx-auto leading-relaxed">
                  Type what you want. Get production-ready React + Tailwind in seconds.
                </p>
              </div>

              {/* Input Area */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-colors focus-within:border-zinc-700">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && prompt.trim().length > 0) {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                  placeholder="e.g. A futuristic landing page for a space tourism agency..."
                  className="w-full h-32 bg-transparent p-4 text-base text-white placeholder-zinc-600 resize-none focus:outline-none"
                  autoFocus
                />
                
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-t border-zinc-800/50">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Command className="w-3 h-3" />
                    <span>Enter to build</span>
                    {!isValid && prompt.trim().length > 0 && (
                      <span className="text-amber-500 ml-2">
                        ({10 - prompt.trim().length} more chars)
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitting}
                    className={`
                      flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${isValid && !isSubmitting
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>Igniting...</span>
                      </>
                    ) : (
                      <>
                        <span>Build</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setPrompt(s)}
                    className="px-3 py-1 text-xs text-zinc-500 border border-zinc-800/50 rounded-full bg-zinc-900/30 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}