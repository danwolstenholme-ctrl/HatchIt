'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, Code2, Palette, Rocket, Shield, Clock, Check } from 'lucide-react'

// =============================================================================
// GENERATING MODAL - Keeps users engaged during the 60-90s generation wait
// Pops up when generation starts, shows progress + selling points
// =============================================================================

interface GeneratingModalProps {
  isOpen: boolean
  stage: string // Current loading stage text
  stageIndex: number // 0-3 for progress
}

const SELLING_POINTS = [
  {
    icon: Code2,
    title: "Your Code, Forever",
    desc: "Export clean React + Tailwind. No lock-in. Deploy anywhere.",
  },
  {
    icon: Zap,
    title: "2.5x Faster Than Templates",
    desc: "Skip the customization nightmare. Get exactly what you described.",
  },
  {
    icon: Palette,
    title: "Production-Ready Output",
    desc: "Responsive, accessible, and optimized. Ready to ship.",
  },
  {
    icon: Shield,
    title: "Built by Claude Sonnet",
    desc: "Anthropic's most capable coding model. Not a template mashup.",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    desc: "Go live in 30 seconds with our Pro plan. Your own domain.",
  },
  {
    icon: Clock,
    title: "Iterate Instantly",
    desc: 'After this, say "make it darker" and watch it update live.',
  },
]

const PROGRESS_STAGES = [
  { label: 'Analyzing prompt', icon: Sparkles },
  { label: 'Designing structure', icon: Palette },
  { label: 'Writing code', icon: Code2 },
  { label: 'Adding polish', icon: Check },
]

export default function GeneratingModal({ isOpen, stage, stageIndex }: GeneratingModalProps) {
  const [factIndex, setFactIndex] = useState(0)
  
  // Rotate through selling points
  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % SELLING_POINTS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isOpen])
  
  // Reset fact index when modal opens
  useEffect(() => {
    if (isOpen) setFactIndex(0)
  }, [isOpen])

    const currentPoint = SELLING_POINTS[factIndex] || SELLING_POINTS[0]
    const InsightIcon = currentPoint.icon
  const progressPercent = Math.min(100, ((stageIndex + 1) / PROGRESS_STAGES.length) * 100)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10"
        >
          {/* Layered backdrop for premium depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#010705] via-[#03100b] to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(2,24,17,0.9),transparent_70%)] opacity-70" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:120px_120px] opacity-20" />

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.25 }}
            className="relative w-full max-w-5xl"
          >
            <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-emerald-500/25 via-emerald-500/5 to-transparent blur-2xl opacity-70" />

            <div className="relative grid gap-6 rounded-[32px] border border-white/5 bg-black/70 p-6 shadow-[0_40px_160px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:grid-cols-[1.1fr_0.9fr] md:p-10">
              {/* Left: progress + status */}
              <div className="rounded-[28px] border border-white/5 bg-zinc-950/80 p-6 md:p-8">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">Live build</p>
                      <h2 className="mt-3 text-3xl font-semibold text-white">Build mode engaged</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-semibold text-white">{Math.round(progressPercent)}%</span>
                      <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-500">progress</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 max-w-lg">
                    Claude Sonnet 4.5 is translating your prompt into clean React and Tailwind. Keep this window open while the build compiles.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-500">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    {stage || 'Initializing'}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.35em] text-zinc-500">
                    <span>Timeline</span>
                    <span>{stageIndex + 1} / {PROGRESS_STAGES.length}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-900">
                    <motion.div
                      key={stageIndex}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
                    />
                  </div>
                </div>

                {/* Stage timeline */}
                <div className="mt-8 space-y-3">
                  {PROGRESS_STAGES.map((s, i) => {
                    const isComplete = i < stageIndex
                    const isCurrent = i === stageIndex
                    const Icon = s.icon

                    return (
                      <div
                        key={s.label}
                        className={`relative flex items-center gap-4 rounded-2xl border px-4 py-3 transition-all ${
                          isCurrent
                            ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_15px_45px_rgba(16,185,129,0.2)]'
                            : isComplete
                            ? 'border-white/10 bg-zinc-900'
                            : 'border-white/5 bg-zinc-900/30'
                        }`}
                      >
                        <div className="relative">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                            isCurrent
                              ? 'border-emerald-400/70 bg-emerald-500/10'
                              : 'border-white/10 bg-zinc-900'
                          }`}>
                            {isComplete ? (
                              <Check className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Icon
                                className={`h-4 w-4 ${isCurrent ? 'text-emerald-300' : 'text-zinc-500'}`}
                              />
                            )}
                          </div>
                          {i < PROGRESS_STAGES.length - 1 && (
                            <div className="absolute left-1/2 top-10 h-6 w-px -translate-x-1/2 bg-zinc-800" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white">{s.label}</span>
                          <span className="text-xs text-zinc-500">
                              {isCurrent ? 'Claude Sonnet is on it.' : isComplete ? 'Locked.' : 'Up next.'}
                          </span>
                        </div>
                        {isCurrent && (
                          <motion.span
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                            className="ml-auto text-xs font-mono text-emerald-300"
                          >
                              Processing...
                          </motion.span>
                        )}
                      </div>
                    )
                  })}
                </div>

                <p className="mt-8 text-xs text-zinc-500">
                  Keep this tab open. The finished React section will drop straight into your canvas.
                </p>
              </div>

              {/* Right: rotating proof & CTA */}
              <div className="relative rounded-[28px] border border-white/5 bg-gradient-to-br from-[#03140d] via-[#02110a] to-black p-6 md:p-8 shadow-inner shadow-black/50 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.35),transparent_70%)]" />
                <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:140px_140px]" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                    Live build quality
                  </div>
                  <h3 className="mt-4 text-3xl font-semibold text-white">Ship faster. Build mode engaged.</h3>
                  <p className="mt-3 text-base text-zinc-300">
                    Transform ideas into production React in minutes. Real components you own, deploy, and keep forever.
                  </p>

                  <div className="mt-8 space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={factIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                        className="rounded-2xl border border-white/10 bg-black/40 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                            <InsightIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{currentPoint.title}</p>
                            <p className="text-xs text-zinc-400">{currentPoint.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    <div className="grid gap-3 text-sm text-zinc-300">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <p className="font-semibold text-white">Production-ready output</p>
                        <p className="text-sm text-zinc-400">Accessible, responsive React with Tailwind already tuned for dark/light. Drop it straight into your repo.</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <p className="font-semibold text-white">2.5x faster than templates</p>
                        <p className="text-sm text-zinc-400">Skip the customization spiral. Get the layout you described without editing blocks for hours.</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <p className="font-semibold text-white">Live DNA sync</p>
                        <p className="text-sm text-zinc-400">Every build tunes the Chronosphere to your taste. The more you iterate, the sharper it gets.</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <p className="font-semibold text-white">No template repeaters</p>
                        <p className="text-sm text-zinc-400">Each section compiles from scratch. Motion, copy, and layout stay bespoke.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Claude is writing code. You will preview it in under a minute.
                    </div>
                    <div className="flex items-center gap-2 font-mono uppercase tracking-[0.3em] text-[10px] text-zinc-500">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-white/60" />
                      Live
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
