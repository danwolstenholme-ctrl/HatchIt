'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function LaunchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [phase, setPhase] = useState<'init' | 'handoff'>('init')

  const prompt = searchParams.get('prompt') || ''
  const upgrade = searchParams.get('upgrade') || ''
  const mode = searchParams.get('mode') || 'demo'

  useEffect(() => {
    const first = setTimeout(() => setPhase('handoff'), 700)
    const redirectTimer = setTimeout(() => {
      const params = new URLSearchParams()
      if (prompt) params.set('prompt', prompt)
      if (upgrade) params.set('upgrade', upgrade)
      params.set('mode', mode)
      router.push(`/builder?${params.toString()}`)
    }, 1500)

    return () => {
      clearTimeout(first)
      clearTimeout(redirectTimer)
    }
  }, [prompt, upgrade, mode, router])

  const messages = {
    init: 'Loading systems... stand by.',
    handoff: 'Starting your build workspace...'
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] opacity-60" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] opacity-60" />
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-emerald-900/20 rounded-full blur-[100px] opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(16,185,129,0.12)]"
          >
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500/50 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm text-emerald-100 font-mono">{messages[phase]}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
