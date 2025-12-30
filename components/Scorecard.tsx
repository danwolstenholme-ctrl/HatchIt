'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Zap, Smartphone, Eye, ShieldCheck } from 'lucide-react'

interface ScorecardProps {
  scores: {
    accessibility: number
    performance: number
    consistency: number
    mobile: number
  }
  passed: boolean
}

export default function Scorecard({ scores, passed }: ScorecardProps) {
  const getGrade = (score: number) => {
    if (score >= 95) return { grade: 'A+', color: 'text-emerald-400' }
    if (score >= 90) return { grade: 'A', color: 'text-emerald-500' }
    if (score >= 80) return { grade: 'B', color: 'text-blue-400' }
    if (score >= 70) return { grade: 'C', color: 'text-amber-400' }
    return { grade: 'D', color: 'text-red-400' }
  }

  const metrics = [
    { label: 'Accessibility', score: scores.accessibility, icon: Eye },
    { label: 'Performance', score: scores.performance, icon: Zap },
    { label: 'Consistency', score: scores.consistency, icon: ShieldCheck },
    { label: 'Mobile', score: scores.mobile, icon: Smartphone },
  ]

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider">System Diagnostics</h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
          passed 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
        }`}>
          {passed ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-xs font-bold">{passed ? 'PASSED' : 'WARNINGS DETECTED'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, i) => {
          const { grade, color } = getGrade(metric.score)
          const Icon = metric.icon
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-2xl font-bold ${color}`}>{grade}</span>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-zinc-500 font-mono uppercase">{metric.label}</p>
                <div className="flex items-end gap-2">
                  <span className="text-lg font-semibold text-white">{metric.score}</span>
                  <span className="text-xs text-zinc-600 mb-1">/ 100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-1 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.score}%` }}
                  transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                  className={`h-full rounded-full ${
                    metric.score >= 90 ? 'bg-emerald-500' :
                    metric.score >= 80 ? 'bg-blue-500' :
                    metric.score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
