'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Code2, Layers, Palette, Zap, Check, ArrowRight, Lightbulb } from 'lucide-react'
import Pip from '../Pip'

// =============================================================================
// GENERATING MODAL - Pip guides you through the ~1 minute wait
// Informational, helpful, keeps users engaged
// =============================================================================

interface GeneratingModalProps {
  isOpen: boolean
  stage: string
  stageIndex: number
}

// What's happening behind the scenes
const BUILD_STAGES = [
  { 
    label: 'Analyzing your prompt', 
    icon: Sparkles,
    detail: 'Understanding your vision and requirements'
  },
  { 
    label: 'Designing the structure', 
    icon: Layers,
    detail: 'Planning component hierarchy and layout'
  },
  { 
    label: 'Writing the code', 
    icon: Code2,
    detail: 'Generating production-ready React + Tailwind'
  },
  { 
    label: 'Adding polish', 
    icon: Palette,
    detail: 'Animations, accessibility, responsive design'
  },
]

// Pip's tips - rotates every few seconds
const PIP_TIPS = [
  { icon: '✨', text: 'Your code is 100% yours — export anytime, no lock-in' },
  { icon: '🎯', text: 'Pro tip: "Make the headline bigger" works great after this' },
  { icon: '⚡', text: 'Built with React + Tailwind. Production-ready from day one' },
  { icon: '💡', text: 'Click any element after to refine just that part' },
  { icon: '🎨', text: 'Try "darker" or "more contrast" if it feels flat' },
  { icon: '🚀', text: 'Average user ships their first section in under 3 minutes' },
  { icon: '🔮', text: 'The more specific your prompt, the better the result' },
  { icon: '✏️', text: 'You can edit text directly in the preview after building' },
]

// Fun facts about what Claude is doing
const CLAUDE_FACTS = [
  'Sonnet 4.5 is analyzing design patterns from millions of websites',
  'Writing semantic HTML with proper accessibility attributes',
  'Optimizing for Core Web Vitals and performance',
  'Adding Framer Motion for smooth micro-interactions',
  'Ensuring responsive design across all breakpoints',
  'Using your brand colors throughout the component',
]

export default function GeneratingModal({ isOpen, stageIndex }: GeneratingModalProps) {
  const [tipIndex, setTipIndex] = useState(0)
  const [factIndex, setFactIndex] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  
  // Rotate tips every 4 seconds
  useEffect(() => {
    if (!isOpen) {
      setTipIndex(0)
      setElapsedSeconds(0)
      return
    }
    
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % PIP_TIPS.length)
    }, 4000)
    
    const factInterval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % CLAUDE_FACTS.length)
    }, 5000)
    
    const timeInterval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1)
    }, 1000)
    
    return () => {
      clearInterval(tipInterval)
      clearInterval(factInterval)
      clearInterval(timeInterval)
    }
  }, [isOpen])
  
  const currentStage = BUILD_STAGES[Math.min(stageIndex, BUILD_STAGES.length - 1)]
  const progressPercent = Math.min(95, ((stageIndex + 1) / BUILD_STAGES.length) * 100 + (elapsedSeconds % 20))
  const currentTip = PIP_TIPS[tipIndex]
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-center justify-center bg-zinc-950/98 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg px-6"
          >
            {/* Pip Header */}
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                animate={{ 
                  y: [0, -4, 0],
                  rotate: [0, 2, 0, -2, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Pip size={48} animate={true} float={false} glow={true} />
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold text-white">Building your section</h2>
                <p className="text-sm text-zinc-400">This usually takes about a minute</p>
              </div>
            </div>
            
            {/* Current Stage Card */}
            <motion.div 
              key={stageIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-5 mb-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
                >
                  <currentStage.icon className="w-5 h-5 text-emerald-400" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{currentStage.label}</p>
                  <p className="text-xs text-zinc-500">{currentStage.detail}</p>
                </div>
                <span className="text-xs font-mono text-zinc-600">{formatTime(elapsedSeconds)}</span>
              </div>
              
              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                />
              </div>
              
              {/* Stage indicators */}
              <div className="flex items-center justify-between mt-3">
                {BUILD_STAGES.map((stage, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full transition-colors ${
                      i < stageIndex ? 'bg-emerald-500' :
                      i === stageIndex ? 'bg-emerald-400 animate-pulse' :
                      'bg-zinc-700'
                    }`} />
                    <span className={`text-[10px] hidden sm:block ${
                      i <= stageIndex ? 'text-zinc-400' : 'text-zinc-600'
                    }`}>
                      {stage.label.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Claude fact */}
            <motion.div 
              className="bg-zinc-900/40 border border-zinc-800/30 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">Claude Sonnet 4.5</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={factIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-zinc-400 leading-relaxed"
                    >
                      {CLAUDE_FACTS[factIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
            
            {/* Pip's Tip */}
            <motion.div 
              className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-500/70 mb-1">Pip&apos;s Tip</p>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tipIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-start gap-2"
                    >
                      <span className="text-sm">{currentTip.icon}</span>
                      <p className="text-sm text-zinc-300 leading-relaxed">{currentTip.text}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
            
            {/* What happens next */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-600">
              <Check className="w-3.5 h-3.5" />
              <span>Live preview appears when ready</span>
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Then refine with Pip</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
