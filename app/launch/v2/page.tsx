'use client'

import { Suspense, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, Shield, Cpu, BatteryFull, Wand2, Eye } from 'lucide-react'

const capabilityRows = [
  {
    title: 'Prompt + credits carried',
    body: 'We move your prompt and 9 guest credits into the builder and track them across steps.',
    icon: BatteryFull
  },
  {
    title: 'V2 highlights (optional)',
    body: 'Quick reel of HUD and motion. Skip anytime to start building.',
    icon: Eye
  },
  {
    title: 'Upgrade path ready',
    body: 'Tier stays in the URL. When credits end we route to checkout with it selected.',
    icon: Shield
  }
]

const miniSteps = [
  'Bring your prompt or tap an example.',
  'Watch the V2 highlights (optional).',
  'Use 9 guest credits across build, refine, dream.',
  'Credits at zero → pause → signup/checkout with tier preserved.'
]

function LaunchV2Content() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isSignedIn } = useUser()
  const prompt = searchParams.get('prompt') || ''
  const upgrade = searchParams.get('upgrade') || ''

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (prompt) params.set('prompt', prompt)
    if (upgrade) params.set('upgrade', upgrade)
    return params.toString()
  }, [prompt, upgrade])

  const goBack = () => {
    const path = queryString ? `/launch?${queryString}` : '/launch'
    router.push(path)
  }

  const startBuilding = () => {
    const params = new URLSearchParams()
    if (prompt) params.set('prompt', prompt)
    if (!isSignedIn) params.set('mode', 'guest')
    if (upgrade) params.set('upgrade', upgrade)
    const path = params.toString() ? `/builder?${params.toString()}` : '/builder'
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.08),transparent_45%),radial-gradient(circle_at_80%_15%,rgba(168,85,247,0.08),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(14,165,233,0.08),transparent_45%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:42px_42px] opacity-40" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <button onClick={goBack} className="text-sm text-zinc-400 hover:text-white inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="text-xs text-emerald-300/80 font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Guest flow • V2 preview
            </div>
          </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-900/20 via-zinc-900/70 to-zinc-950 shadow-[0_0_40px_rgba(16,185,129,0.25)]"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            V2 highlights then build
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">See the V2 reel, then build with your prompt.</h1>
          <p className="text-lg text-zinc-300 max-w-2xl mb-6">
            Your prompt and 9 guest credits travel with you. Watch the preview or jump straight into the builder.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
            <button
              onClick={startBuilding}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 text-black rounded-lg font-semibold shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:bg-emerald-400 transition"
            >
              Start building now
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-sm text-emerald-200/80">Prompt carried forward{prompt ? ' • loaded' : ''} • 9 guest credits ready</div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {capabilityRows.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * i }}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/70"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                    <cap.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{cap.title}</h3>
                    <p className="text-sm text-zinc-400">{cap.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 grid md:grid-cols-[1.2fr_1fr] gap-6">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60">
            <div className="flex items-center gap-2 text-sm text-emerald-300 mb-2">
              <Wand2 className="w-4 h-4" />
              Flow at a glance
            </div>
            <div className="space-y-3">
              {miniSteps.map((line, i) => (
                <div key={line} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg border border-emerald-500/30 text-emerald-200 flex items-center justify-center font-semibold">
                    {i + 1}
                  </div>
                  <div className="text-zinc-200">{line}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
            <div className="flex items-center gap-2 text-sm text-emerald-50 mb-2">
              <Shield className="w-4 h-4" />
              Credit guardrails
            </div>
            <p className="text-emerald-50/90 mb-3">
              9 pooled guest credits across build, refine, and dream. When they hit zero we pause, save, and route to signup/checkout with their tier selected.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-emerald-100">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40">Build</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40">Refine</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40">Dream</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40">Review lock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LaunchV2Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}> 
      <LaunchV2Content />
    </Suspense>
  )
}
