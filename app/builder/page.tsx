'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import BuildFlowController from '@/components/BuildFlowController'
import SingularityLoader from '@/components/singularity/SingularityLoader'

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
    return <SingularityLoader text="REDIRECTING TO DEMO" />
  }

  // Show loading while checking auth
  if (!isLoaded) {
    return <SingularityLoader text="VERIFYING IDENTITY" />
  }

  // Authenticated user - same UI as demo, just with persistence
  return (
    <BuildFlowController 
      existingProjectId={projectId || undefined}
      initialPrompt={prompt || undefined}
      isDemo={false} // Explicitly NOT demo mode for authenticated users
    />
  )
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<SingularityLoader text="LOADING BUILDER" />}>
      <BuilderContent />
    </Suspense>
  )
}
