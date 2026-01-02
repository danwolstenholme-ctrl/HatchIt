'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Lock, CreditCard, ArrowRight } from 'lucide-react'
import BuildFlowController from '@/components/BuildFlowController'
import { AccountSubscription } from '@/types/subscriptions'

// =============================================================================
// BUILDER PAGE WRAPPER
// V3 Structured Build Flow - REQUIRES ACTIVE SUBSCRIPTION
// URL: /builder
// =============================================================================

function BuilderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isSignedIn, isLoaded } = useUser()
  const projectId = searchParams.get('project')
  const upgrade = searchParams.get('upgrade')
  const mode = searchParams.get('mode') // 'guest' for demo mode
  const initialPrompt = searchParams.get('prompt')
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Get subscription from Clerk metadata
  const subscription = user?.publicMetadata?.accountSubscription as AccountSubscription | null
  const hasActiveSubscription = subscription?.status === 'active'
  
  // Guest mode = unsigned user trying builder from homepage
  const isGuestMode = mode === 'guest' || !isSignedIn

  // Handle upgrade param - redirect to Stripe checkout (only for signed-in users)
  useEffect(() => {
    if (!isLoaded) return
    
    // If signed in with upgrade param, handle checkout
    if (isSignedIn) {
      const pendingTier = upgrade || (typeof window !== 'undefined' ? localStorage.getItem('pendingUpgradeTier') : null)
      
      if (pendingTier && ['lite', 'pro', 'agency'].includes(pendingTier)) {
        setIsRedirecting(true)
        
        // Clear both URL param and localStorage
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete('upgrade')
        window.history.replaceState({}, '', newUrl.toString())
        localStorage.removeItem('pendingUpgradeTier')
        
        // Trigger checkout
        fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier: pendingTier })
        })
          .then(res => res.json())
          .then(data => {
            if (data.url) {
              window.location.href = data.url
            }
          })
          .catch(err => {
            console.error('Checkout redirect failed:', err)
            setIsRedirecting(false)
          })
      }
    }
  }, [isLoaded, isSignedIn, upgrade])

  // Loading state
  if (!isLoaded || isRedirecting) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-zinc-500 text-sm">
            {isRedirecting ? 'Redirecting to checkout...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  // ALLOW EVERYONE INTO BUILDER - paywall is on deploy/export, not entry
  return (
    <div className="relative min-h-screen">
      <BuildFlowController 
        existingProjectId={projectId || undefined}
        guestMode={isGuestMode}
        initialPrompt={initialPrompt || undefined}
      />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    }>
      <BuilderContent />
    </Suspense>
  )
}
