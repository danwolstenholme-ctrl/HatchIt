'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import BuildFlowController from '@/components/BuildFlowController'

// =============================================================================
// BUILDER PAGE - Same as demo but with auth + persistence
// Unauthenticated users → /demo
// Authenticated users → full builder with project persistence
// =============================================================================

function BuilderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  const projectId = searchParams.get('project')
  const prompt = searchParams.get('prompt')

  // Redirect unauthenticated users to demo
  if (isLoaded && !isSignedIn) {
    const demoUrl = prompt ? `/demo?prompt=${encodeURIComponent(prompt)}` : '/demo'
    router.replace(demoUrl)
    return <div className="min-h-screen bg-zinc-950" />
  }

  // Show loading while checking auth
  if (!isLoaded) {
    return <div className="min-h-screen bg-zinc-950" />
  }

  // Authenticated user - same UI as demo, just with persistence
  return (
    <BuildFlowController 
      existingProjectId={projectId || undefined}
      initialPrompt={prompt || undefined}
      isDemo={true}
    />
  )
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <BuilderContent />
    </Suspense>
  )
}
