'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'
import { AccountSubscription } from '@/types/subscriptions'

interface SubscriptionContextValue {
  // Subscription data
  subscription: AccountSubscription | null
  tier: 'free' | 'architect' | 'visionary' | 'singularity'
  isPaidUser: boolean
  isVisionaryUser: boolean
  isSingularityUser: boolean
  
  // Renewal info
  daysUntilRenewal: number | null
  renewalDate: Date | null
  
  // Visual theme
  tierColor: {
    gradient: string
    border: string
    text: string
    glow: string
    bgSubtle: string
  }
  
  // Actions
  syncSubscription: () => Promise<void>
  isSyncing: boolean
}

const defaultColors = {
  gradient: 'from-zinc-600 to-zinc-500',
  border: 'border-zinc-700',
  text: 'text-zinc-400',
  glow: 'shadow-zinc-500/20',
  bgSubtle: 'bg-zinc-800/50',
}

const visionaryColors = {
  gradient: 'from-violet-500 to-purple-500',
  border: 'border-violet-500/50',
  text: 'text-violet-400',
  glow: 'shadow-violet-500/30',
  bgSubtle: 'bg-violet-500/10',
}

const architectColors = {
  gradient: 'from-emerald-500 to-teal-500',
  border: 'border-emerald-500/50',
  text: 'text-emerald-400',
  glow: 'shadow-emerald-500/30',
  bgSubtle: 'bg-emerald-500/10',
}

const singularityColors = {
  gradient: 'from-amber-500 to-orange-500',
  border: 'border-amber-500/50',
  text: 'text-amber-400',
  glow: 'shadow-amber-500/30',
  bgSubtle: 'bg-amber-500/10',
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser()
  const [isSyncing, setIsSyncing] = useState(false)
  const [hasSynced, setHasSynced] = useState(false)
  const [localSubscription, setLocalSubscription] = useState<AccountSubscription | null>(null)

  // Read subscription from user metadata, but also check local override
  const subscription = useMemo(() => {
    // Prefer local state if we just synced (more up-to-date)
    if (localSubscription) return localSubscription
    if (!user) return null
    return (user.publicMetadata?.accountSubscription as AccountSubscription) || null
  }, [user, localSubscription])

  const tier = useMemo(() => {
    if (!subscription || subscription.status !== 'active') return 'free'
    return subscription.tier
  }, [subscription])

  const isPaidUser = tier !== 'free'
  const isVisionaryUser = tier === 'visionary'
  const isSingularityUser = tier === 'singularity'

  const renewalDate = useMemo(() => {
    if (!subscription?.currentPeriodEnd) return null
    return new Date(subscription.currentPeriodEnd)
  }, [subscription])

  const daysUntilRenewal = useMemo(() => {
    if (!renewalDate) return null
    const now = new Date()
    const diff = renewalDate.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }, [renewalDate])

  const tierColor = useMemo(() => {
    if (tier === 'singularity') return singularityColors
    if (tier === 'visionary') return visionaryColors
    if (tier === 'architect') return architectColors
    return defaultColors
  }, [tier])

  const syncSubscription = useCallback(async () => {
    if (!user || isSyncing) return
    
    setIsSyncing(true)
    try {
      const response = await fetch('/api/subscription/sync')
      const data = await response.json()
      
      if (data.synced && data.subscription) {
        // Update local state immediately for faster UI update
        setLocalSubscription(data.subscription)
        // Also force a user refresh to update Clerk's cache
        await user.reload()
      }
    } catch (error) {
      console.error('Failed to sync subscription:', error)
    } finally {
      setIsSyncing(false)
    }
  }, [user, isSyncing])

  // Auto-sync on mount for ALL users (not just those without subscription)
  // This ensures paid users get the latest subscription status
  useEffect(() => {
    if (isLoaded && user && !hasSynced) {
      // Small delay to let initial render complete
      const timer = setTimeout(() => {
        syncSubscription()
        setHasSynced(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoaded, user, hasSynced, syncSubscription])

  const value: SubscriptionContextValue = {
    subscription,
    tier,
    isPaidUser,
    isVisionaryUser,
    isSingularityUser,
    daysUntilRenewal,
    renewalDate,
    tierColor,
    syncSubscription,
    isSyncing,
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
