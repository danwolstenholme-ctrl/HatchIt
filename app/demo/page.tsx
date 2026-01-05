'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import BuildFlowController from '@/components/BuildFlowController'

// =============================================================================
// DEMO PAGE - Full builder experience, localStorage only
// Premium actions (deploy, download) show signup modal
// =============================================================================

function DemoContent() {
  const searchParams = useSearchParams()
  const prompt = searchParams.get('prompt')
  
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
