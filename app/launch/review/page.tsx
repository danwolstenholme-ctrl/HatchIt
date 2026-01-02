'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, Zap } from 'lucide-react'

type SavedSection = {
  sectionId: string
  userPrompt: string
}

export default function LaunchReviewPage() {
  const router = useRouter()
  const [sections, setSections] = useState<SavedSection[]>([])
  const [creditsUsed, setCreditsUsed] = useState(0)
  const [limit, setLimit] = useState(9)

  useEffect(() => {
    try {
      const handoff = localStorage.getItem('hatch_guest_handoff')
      if (handoff) {
        const parsed = JSON.parse(handoff)
        setSections(parsed.sections || [])
      }
      const used = parseInt(localStorage.getItem('hatch_guest_total') || '0')
      setCreditsUsed(Number.isFinite(used) ? used : 0)
      const max = parseInt(process.env.NEXT_PUBLIC_FREE_TOTAL_CREDITS || '9', 10)
      setLimit(Number.isFinite(max) ? max : 9)
    } catch (err) {
      console.warn('Failed to load guest review state', err)
    }
  }, [])

  const resetDemo = () => {
    try {
      localStorage.removeItem('hatch_guest_handoff')
      localStorage.removeItem('hatch_guest_total')
      localStorage.removeItem('hatch_guest_locked')
      localStorage.removeItem('hatch_guest_lock_reason')
      localStorage.removeItem('hatch_guest_generations')
      localStorage.removeItem('hatch_guest_refinements')
      localStorage.removeItem('hatch_guest_dreams')
    } catch (err) {
      console.warn('Failed to reset demo state', err)
    }
    router.push('/launch?mode=demo')
  }

  const signUp = () => {
    router.push('/sign-up?upgrade=pro')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] opacity-60" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <button onClick={resetDemo} className="text-sm text-zinc-400 hover:text-white inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Restart demo
          </button>
          <div className="text-xs text-emerald-300/80 font-mono flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Trial used: {creditsUsed}/{limit}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(16,185,129,0.12)]"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Trial complete
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Review your build</h1>
          <p className="text-zinc-300 mb-8">You hit the demo limit. Save your work by creating an account or start a fresh run.</p>

          <div className="grid gap-3 mb-8">
            {sections.length > 0 ? (
              sections.map((section) => (
                <div key={section.sectionId} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60">
                  <div className="text-xs font-mono text-emerald-200 uppercase tracking-wide">{section.sectionId}</div>
                  <p className="text-sm text-zinc-300 mt-1">{section.userPrompt || 'Prompt not captured.'}</p>
                </div>
              ))
            ) : (
              <div className="text-sm text-zinc-400">We’ll capture your sections during the next run.</div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={signUp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-black rounded-lg font-semibold hover:bg-emerald-100 transition"
            >
              Save & continue
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={resetDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 border border-emerald-500/40 text-emerald-100 rounded-lg hover:border-emerald-300/60 transition"
            >
              Run another demo
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
