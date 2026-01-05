'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import BuildFlowController from '@/components/BuildFlowController'

// =============================================================================
// DEMO PAGE - Full builder experience, localStorage only
// Premium actions (deploy, download) show signup modal
// If signed in, redirect to /builder to migrate guest work
// =============================================================================

function DemoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  const prompt = searchParams.get('prompt')
  
  // If user is signed in, redirect to /builder to migrate their demo work
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Check if they have guest work to migrate
      const hasHandoff = typeof window !== 'undefined' && localStorage.getItem('hatch_guest_handoff')
      const hasPreview = typeof window !== 'undefined' && 
        Array.from({ length: localStorage.length }).some((_, i) => 
          localStorage.key(i)?.startsWith('hatch_preview_')
        )
      
      if (hasHandoff || hasPreview) {
        // Redirect to builder which will migrate their work
        router.replace('/builder')
      } else {
        // No demo work - just go to builder fresh
        router.replace('/builder')
      }
    }
  }, [isLoaded, isSignedIn, router])
  
  // Show loading while checking auth
  if (!isLoaded) {
    return <div className="min-h-screen bg-zinc-950" />
  }
  
  // If signed in, don't render - we're redirecting
  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  return (
    <BuildFlowController 
      isDemo={true}
      initialPrompt={prompt || undefined}
    />
  )
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <DemoContent />
    </Suspense>
  )
}
