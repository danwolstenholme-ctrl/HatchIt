'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import BuildFlowController from '@/components/BuildFlowController'
import { AccountSubscription } from '@/types/subscriptions'

// =============================================================================
// BUILDER PAGE - REQUIRES AUTHENTICATION
// Unauthenticated users → /demo
// Authenticated users → full builder with project persistence
// =============================================================================

function SeamlessLoader() {
  return <div className="min-h-screen bg-zinc-950" />
}

function BuilderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isSignedIn, isLoaded } = useUser()
  const projectId = searchParams.get('project')
  const upgrade = searchParams.get('upgrade')
  const prompt = searchParams.get('prompt')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isImportingDemo, setIsImportingDemo] = useState(false)

  // Get subscription from Clerk metadata
  const subscription = user?.publicMetadata?.accountSubscription as AccountSubscription | null

  // Redirect unauthenticated users to demo
  useEffect(() => {
    if (!isLoaded) return
    
    if (!isSignedIn) {
      // Preserve prompt if they had one
      const demoUrl = prompt ? `/demo?prompt=${encodeURIComponent(prompt)}` : '/demo'
      router.replace(demoUrl)
      return
    }
  }, [isLoaded, isSignedIn, router, prompt])

  // Handle upgrade param - redirect to Stripe checkout
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    const pendingTier = upgrade || (typeof window !== 'undefined' ? localStorage.getItem('pendingUpgradeTier') : null)
    
    if (pendingTier && ['architect', 'visionary', 'singularity'].includes(pendingTier)) {
      setIsRedirecting(true)
      
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('upgrade')
      window.history.replaceState({}, '', newUrl.toString())
      localStorage.removeItem('pendingUpgradeTier')
      
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
  }, [isLoaded, isSignedIn, upgrade])

  // Import demo work after signup
  useEffect(() => {
    if (!isLoaded || !isSignedIn || isRedirecting) return

    const payloadStr = typeof window !== 'undefined' ? localStorage.getItem('hatch_guest_handoff') : null
    if (!payloadStr) return

    const migrate = async () => {
      try {
        setIsImportingDemo(true)
        const payload = JSON.parse(payloadStr)
        const res = await fetch('/api/project/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          localStorage.removeItem('hatch_guest_handoff')
          const data = await res.json()
          if (data?.projectId) {
            router.replace(`/builder?project=${data.projectId}`)
            return // Don't turn off loader, redirect will handle it
          }
        } else {
          // Import failed - clear handoff and continue to builder anyway
          console.error('Demo import failed with status:', res.status)
          localStorage.removeItem('hatch_guest_handoff')
        }
      } catch (err) {
        console.error('Demo import failed', err)
        // Clear handoff on error so user doesn't get stuck
        localStorage.removeItem('hatch_guest_handoff')
      } finally {
        setIsImportingDemo(false)
      }
    }

    migrate()
  }, [isLoaded, isSignedIn, isRedirecting, router])

  // Loading states
  if (!isLoaded || isRedirecting || isImportingDemo) {
    return <SeamlessLoader />
  }

  // Not signed in - redirect happening
  if (!isSignedIn) {
    return <SeamlessLoader />
  }

  // Authenticated user - show builder
  return (
    <div className="relative min-h-screen">
      <BuildFlowController 
        existingProjectId={projectId || undefined}
        initialPrompt={prompt || undefined}
      />
    </div>
  )
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<SeamlessLoader />}>
      <BuilderContent />
    </Suspense>
  )
}
