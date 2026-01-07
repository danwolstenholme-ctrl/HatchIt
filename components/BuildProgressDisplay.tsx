'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Sparkles, Layers, Palette, Zap, CheckCircle2, Cpu } from 'lucide-react'
import { buildProgress, BuildStage } from '@/lib/build-progress'
import Pip from '@/components/Pip'

/**
 * BUILD PROGRESS DISPLAY
 * ----------------------
 * Stunning, engaging loading experience.
 * Pip guides users through the build process.
 * Glassmorphism + emerald accents + smooth animations.
 */

const STAGE_CONFIG: Record<BuildStage, { 
  icon: typeof Code2
  label: string
  subtext: string
  pipMood: 'thinking' | 'working' | 'excited' | 'proud'
}> = {
  idle: { 
    icon: Cpu, 
    label: 'Ready', 
    subtext: 'Preparing to build...',
    pipMood: 'thinking'
  },
  analyzing: { 
    icon: Sparkles, 
    label: 'Analyzing', 
    subtext: 'Understanding your vision...',
    pipMood: 'thinking'
  },
  structuring: { 
    icon: Layers, 
    label: 'Structuring', 
    subtext: 'Designing the architecture...',
    pipMood: 'thinking'
  },
  generating: { 
    icon: Code2, 
    label: 'Generating', 
    subtext: 'Writing production React code...',
    pipMood: 'working'
  },
  styling: { 
    icon: Palette, 
    label: 'Styling', 
    subtext: 'Applying Tailwind magic...',
    pipMood: 'working'
  },
  optimizing: { 
    icon: Zap, 
    label: 'Polishing', 
    subtext: 'Adding final touches...',
    pipMood: 'excited'
  },
  complete: { 
    icon: CheckCircle2, 
    label: 'Complete', 
    subtext: 'Your component is ready!',
    pipMood: 'proud'
  },
}

// Fun facts to show while waiting
const BUILD_FACTS = [
  "Claude analyzes thousands of design patterns to craft your component.",
  "Every line of code is production-ready React + Tailwind.",
  "Your component will be responsive across all devices.",
  "The AI considers accessibility best practices automatically.",
  "Components are optimized for performance out of the box.",
  "You can refine any section after it's built.",
  "One-click deploy gets your site live instantly.",
  "Export clean code you actually own.",
]

// Floating particles for ambient effect
function FloatingParticles() {
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    })), []
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-emerald-400/30"
          style={{ 
            width: p.size, 
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(p.id) * 30, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Progress ring with stages
function ProgressRing({ progress, stage }: { progress: number; stage: BuildStage }) {
  const stages: BuildStage[] = ['analyzing', 'structuring', 'generating', 'styling', 'optimizing', 'complete']
  const currentIndex = stages.indexOf(stage)

  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      {/* Background ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="rgba(16,185,129,0.1)"
          strokeWidth="4"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
          animate={{ 
            strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) 
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>

      {/* Stage dots */}
      <div className="absolute inset-0">
        {stages.slice(0, -1).map((s, i) => {
          const angle = (i / (stages.length - 1)) * 360 - 90
          const rad = (angle * Math.PI) / 180
          const r = 45
          const x = 50 + r * Math.cos(rad)
          const y = 50 + r * Math.sin(rad)
          const isActive = i <= currentIndex
          
          return (
            <motion.div
              key={s}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                backgroundColor: isActive ? '#10b981' : 'rgba(16,185,129,0.2)',
                scale: isActive ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
            />
          )
        })}
      </div>

      {/* Center content - Pip */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Pip size={60} animate={true} float={false} glow={true} />
        </motion.div>
      </div>
    </div>
  )
}

export default function BuildProgressDisplay() {
  const [message, setMessage] = useState<string>('Preparing build...')
  const [stage, setStage] = useState<BuildStage>('analyzing')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [currentFact, setCurrentFact] = useState(0)
  const startTimeRef = useRef(Date.now())

  // Build timer
  useEffect(() => {
    startTimeRef.current = Date.now()
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Rotate fun facts every 8 seconds
  useEffect(() => {
    const factTimer = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % BUILD_FACTS.length)
    }, 8000)
    return () => clearInterval(factTimer)
  }, [])

  // Progress listener
  useEffect(() => {
    const handleProgress = (update: { stage: BuildStage; message: string }) => {
      setStage(update.stage)
      setMessage(update.message)
    }

    buildProgress.on('progress', handleProgress)
    buildProgress.startBuild()

    return () => {
      buildProgress.off('progress', handleProgress)
      buildProgress.reset()
    }
  }, [])

  // Progress percentage based on stage
  const getProgress = () => {
    const stages: BuildStage[] = ['analyzing', 'structuring', 'generating', 'styling', 'optimizing', 'complete']
    const index = stages.indexOf(stage)
    return Math.min(((index + 1) / stages.length) * 100, 95)
  }

  const config = STAGE_CONFIG[stage]
  const Icon = config.icon

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  return (
    <div className="relative min-h-[400px] w-full flex flex-col items-center justify-center p-6 md:p-8">
      {/* Floating particles background */}
      <FloatingParticles />

      {/* Glassmorphism card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 md:p-10 shadow-2xl shadow-black/50 max-w-lg w-full"
      >
        {/* Top gradient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.05),transparent_60%)] rounded-2xl pointer-events-none" />

        <div className="relative flex flex-col items-center space-y-6">
          {/* Progress ring with Pip */}
          <ProgressRing progress={getProgress()} stage={stage} />

          {/* Stage indicator */}
          <div className="flex flex-col items-center space-y-2">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
            >
              <motion.div
                animate={{ rotate: stage === 'generating' ? 360 : 0 }}
                transition={{ duration: 2, repeat: stage === 'generating' ? Infinity : 0, ease: "linear" }}
              >
                <Icon className="w-4 h-4 text-emerald-400" />
              </motion.div>
              <span className="text-sm font-medium text-emerald-400">{config.label}</span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.p
                key={message}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-zinc-400 text-sm text-center"
              >
                {config.subtext}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Progress</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Fun fact carousel */}
          <div className="w-full pt-4 border-t border-zinc-800/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFact}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {BUILD_FACTS[currentFact]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-center gap-6 pt-2 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span>Claude Sonnet 4.5</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400">{formatTime(elapsedSeconds)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
