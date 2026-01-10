'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Sparkles, Rocket, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { LogoMark } from '@/components/Logo'

interface SubscriptionState {
  tier: 'architect' | 'visionary' | 'singularity' | null
  status: string | null
  synced: boolean
  message?: string
}

function PostPaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()
  const [subState, setSubState] = useState<SubscriptionState>({ tier: null, status: null, synced: false })
  const [isSyncing, setIsSyncing] = useState(true)
  const tierParam = searchParams.get('tier') as 'architect' | 'visionary' | 'singularity' | null
  const projectSlug = searchParams.get('project') || undefined

  const tier = useMemo(() => {
    if (tierParam) return tierParam
    const meta = user?.publicMetadata?.accountSubscription as { tier?: 'architect' | 'visionary' | 'singularity'; status?: string } | undefined
    return meta?.tier || null
  }, [tierParam, user?.publicMetadata])

  const syncSubscription = async () => {
    setIsSyncing(true)
    try {
      const res = await fetch('/api/subscription/sync', { cache: 'no-store' })
      const data = await res.json()
      setSubState({
        tier: data?.subscription?.tier || tier || null,
        status: data?.subscription?.status || null,
        synced: !!data?.synced,
        message: data?.message,
      })
    } catch (err) {
      console.error('Sync failed', err)
      setSubState({ tier: tier || null, status: null, synced: false, message: 'Sync failed' })
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    if (!isLoaded) return
    syncSubscription()
  }, [isLoaded])

  const tierConfig = {
    architect: {
      name: 'Architect',
      emoji: '🏗️',
      color: 'emerald',
      perks: ['Deploy & export your sites', 'Push to GitHub', '3 active projects'],
    },
    visionary: {
      name: 'Visionary',
      emoji: '✨',
      color: 'violet',
      perks: ['Everything in Architect', 'Custom domains', 'Remove HatchIt branding'],
    },
    singularity: {
      name: 'Singularity',
      emoji: '🌌',
      color: 'amber',
      perks: ['Unlimited everything', 'The Replicator', 'Priority support'],
    },
  }

  const activeTier = tier ? tierConfig[tier] : null
  const firstName = user?.firstName || 'there'

  const handleStartBuilding = () => {
    const qs = new URLSearchParams()
    if (projectSlug) qs.set('project', projectSlug)
    router.push(`/builder${qs.toString() ? `?${qs.toString()}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Simple header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <LogoMark size={20} />
            <span className="text-base font-semibold text-white">HatchIt</span>
          </Link>
          <Link 
            href="/dashboard" 
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg text-center"
        >
          {/* Success animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              {isSyncing ? (
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              ) : (
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              )}
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {isSyncing ? 'Setting things up...' : `Welcome aboard, ${firstName}!`}
            </h1>
            <p className="text-lg text-zinc-400 mb-2">
              {isSyncing 
                ? 'Just a moment while we activate your account'
                : 'Your payment was successful'
              }
            </p>
          </motion.div>

          {/* Tier badge */}
          {!isSyncing && activeTier && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/60 border border-zinc-700/50 mb-8"
            >
              <span className="text-xl">{activeTier.emoji}</span>
              <span className="text-sm font-medium text-white">{activeTier.name} Plan</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </motion.div>
          )}

          {/* Perks */}
          {!isSyncing && activeTier && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-10"
            >
              <div className="inline-flex flex-col gap-2 text-left">
                {activeTier.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA Buttons */}
          {!isSyncing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <button
                onClick={handleStartBuilding}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mx-auto"
              >
                <Rocket className="w-5 h-5" />
                Start Building
              </button>
              
              <div className="flex items-center justify-center gap-4 text-sm">
                <Link 
                  href="/dashboard" 
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  Go to Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Sync status for debugging */}
          {!isSyncing && !subState.synced && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-xs text-zinc-500 mb-2">
                Having trouble? Your subscription may take a moment to sync.
              </p>
              <button
                onClick={syncSubscription}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Retry sync
              </button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

export default function PostPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>}> 
      <PostPaymentContent />
    </Suspense>
  )
}
