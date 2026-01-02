'use client'

import { useEffect, useRef, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { track } from '@vercel/analytics'
import { AccountSubscription } from '@/types/subscriptions'
import { useSubscription } from '@/contexts/SubscriptionContext'

// =============================================================================
// WELCOME PAGE
// A creative, animated welcome experience for all user types
// Free: Grey theme, friendly intro
// Lite: Lime/green theme, starter tier
// Pro: Emerald/teal theme with Hatch character
// Agency: Gold/amber theme with Agency Node
// =============================================================================

type WelcomeTier = 'lite' | 'pro' | 'agency'

  ? (urlTier as WelcomeTier)
const tierConfig = {
  lite: {
    emoji: '🌱',
    title: 'Protocol: SEEDLING',
    subtitle: 'Growth sequence initiated.',
    description: "Your journey begins here. Build up to 3 active projects with unlimited generations and 5 AI polishes per month. Perfect for launching first ideas.",
    price: '$9 / mo',
    ctaText: 'Start Building',
    ctaUrl: '/builder',
    gradient: 'from-lime-500 to-emerald-500',
    accentColor: 'lime',
    features: [
      { icon: '🌱', text: '3 Complete Sites' },
      { icon: '∞', text: 'Unlimited Generations' },
      { icon: '🎯', text: '5 AI Polishes / mo' },
      { icon: '🖥️', text: 'Live DOM Preview' },
      { icon: '🤖', text: 'Full AI Architect Access' },
    ],
  },
  pro: {
    emoji: '🧠',
    title: "Protocol: ARCHITECT",
    subtitle: 'Full neural link established.',
    description: "You are now one with the system. Create, deploy, and manifest with unlimited generations and ~30 AI polishes per month.",
    price: '$29 / mo',
    ctaText: 'Start Building',
    ctaUrl: '/builder',
    gradient: 'from-emerald-500 to-teal-500',
    accentColor: 'emerald',
    features: [
      { icon: '∞', text: 'Unlimited Neural Generations' },
      { icon: '🎯', text: '~30 AI Polishes / mo' },
      { icon: '🚀', text: 'Direct-to-Edge Deployment' },
      { icon: '💾', text: 'Full Source Export' },
      { icon: '🌐', text: 'Custom Domain Binding' },
      { icon: '🎨', text: 'Deep Style Injection' },
      { icon: '⚡', text: 'Priority Kernel Access' },
    ],
  },
  agency: {
    emoji: '🔮',
    title: 'Protocol: DEMIURGE',
    subtitle: 'Reality distortion field active.',
    description: "You build worlds for others. White-label the Architect and deploy fleets of sites. You are the system administrator.",
function AgencyNode() {
        className="absolute inset-4 border-2 border-amber-500/50 rounded-full border-dashed"
      >
            left: "50%",

      {/* Subtle glow */}
      className="relative w-40 h-40 flex items-center justify-center"
}
  const derivedTier: WelcomeTier = hasValidUrlTier
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      // Removed
    </div>
  }, [hasValidUrlTier, isLoaded, syncSubscription])

  // Track new user sign-up completion
  const hasTrackedSignup = useRef(false)
  useEffect(() => {
    if (!isLoaded || !user || hasTrackedSignup.current) return
    // Only track if user was created recently (within last 5 minutes) - indicates fresh signup
    const createdAt = user.createdAt ? new Date(user.createdAt).getTime() : 0
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000
    if (now - createdAt < fiveMinutes) {
      track('Sign Up Completed', { 
        tier: derivedTier,
        source: 'welcome_page'
      })
    }
    hasTrackedSignup.current = true
  }, [isLoaded, user, derivedTier])

  const config = tierConfig[derivedTier]

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background effects - subtle, matching site aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-80 h-80 ${
          tier === 'agency' ? 'bg-orange-500/10' :
          tier === 'pro' ? 'bg-emerald-500/10' :
          tier === 'lite' ? 'bg-lime-500/10' :
          'bg-zinc-500/5'
        } rounded-full blur-[100px]`} />
        <div className={`absolute top-1/3 -right-40 w-96 h-96 ${
          tier === 'agency' ? 'bg-amber-500/10' :
          tier === 'pro' ? 'bg-teal-500/10' :
          tier === 'lite' ? 'bg-emerald-500/10' :
          'bg-zinc-500/5'
        } rounded-full blur-[100px]`} />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl"
      >
        {/* Character/Icon */}
        <div className="mb-8 flex justify-center">
          {tier === 'agency' ? (
            <AgencyNode />
          ) : tier === 'pro' ? (
            <ProNode />
          ) : (
            <LiteNode />
          )}
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          {config.title}
        </motion.h1>

        {/* Price Tag (New) */}
        {/* @ts-ignore */}
        {config.price && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-sm font-mono mb-6 ${
              tier === 'agency' ? 'text-amber-400' :
              tier === 'pro' ? 'text-emerald-400' :
              tier === 'lite' ? 'text-lime-400' :
              'text-zinc-400'
            }`}
          >
            {/* @ts-ignore */}
            {config.price}
          </motion.div>
        )}

        {/* Subtitle with gradient */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-xl md:text-2xl font-medium bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-6`}
        >
          {config.subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-zinc-400 text-lg mb-10 max-w-md mx-auto"
        >
          {config.description}
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`bg-zinc-900/80 backdrop-blur-sm border ${
            tier === 'agency' ? 'border-orange-500/30' :
            tier === 'pro' ? 'border-emerald-500/30' :
            tier === 'lite' ? 'border-lime-500/30' :
            'border-zinc-800'
          } rounded-2xl p-6 mb-10`}
        >
          <div className="grid grid-cols-2 gap-4">
            import { redirect } from 'next/navigation'

            export default function WelcomePage() {
              redirect('/builder?mode=guest')
            }
                transition={{ delay: 0.6 + i * 0.1 }}
