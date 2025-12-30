'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Cpu, Shield, Zap, Code2, Layout } from 'lucide-react'

const steps = [
  { icon: Terminal, text: "Parsing architectural requirements..." },
  { icon: Layout, text: "Structuring component hierarchy..." },
  { icon: Cpu, text: "Generating React + Tailwind code..." },
  { icon: Shield, text: "Verifying accessibility standards..." },
  { icon: Zap, text: "Optimizing render performance..." },
  { icon: Code2, text: "Finalizing output..." }
]

export default function ThinkingLog() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length)
    }, 800) // Change step every 800ms
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Pulsing rings */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-emerald-500/50"
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        />
        <div className="relative z-10 bg-zinc-900 rounded-full p-3 border border-emerald-500/50">
          <Terminal className="w-6 h-6 text-emerald-500" />
        </div>
      </div>

      <div className="h-8 relative w-full max-w-xs overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-mono text-emerald-400"
          >
            {(() => {
              const StepIcon = steps[currentStep].icon
              return (
                <>
                  <StepIcon className="w-4 h-4" />
                  <span>{steps[currentStep].text}</span>
                </>
              )
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex gap-1">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 w-8 rounded-full transition-colors duration-300 ${
              i === currentStep ? 'bg-emerald-500' : 
              i < currentStep ? 'bg-emerald-500/30' : 'bg-zinc-800'
            }`} 
          />
        ))}
      </div>
    </div>
  )
}
