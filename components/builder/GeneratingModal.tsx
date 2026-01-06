'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Palette, Code2, Check } from 'lucide-react'

// =============================================================================
// GENERATING MODAL - Minimal, centered loading state during generation
// =============================================================================

interface GeneratingModalProps {
  isOpen: boolean
  stage: string
  stageIndex: number
}

const PROGRESS_STAGES = [
  { label: 'Analyzing', icon: Sparkles },
  { label: 'Designing', icon: Palette },
  { label: 'Coding', icon: Code2 },
  { label: 'Polishing', icon: Check },
]

export default function GeneratingModal({ isOpen, stage, stageIndex }: GeneratingModalProps) {
  const progressPercent = Math.min(100, ((stageIndex + 1) / PROGRESS_STAGES.length) * 100)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="flex flex-col items-center text-center px-6 max-w-sm"
          >
            {/* Pulsing icon */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6"
            >
              <Code2 className="w-7 h-7 text-emerald-400" />
            </motion.div>

            {/* Status */}
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2">
              Building
            </p>
            <h2 className="text-xl font-semibold text-white mb-1">
              {stage || 'Generating code...'}
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Claude Sonnet 4.5 is writing your component
            </p>

            {/* Progress bar */}
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-zinc-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>

            {/* Stage dots */}
            <div className="flex items-center gap-3 mt-6">
              {PROGRESS_STAGES.map((s, i) => (
                <div
                  key={s.label}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i <= stageIndex ? 'bg-emerald-400' : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
