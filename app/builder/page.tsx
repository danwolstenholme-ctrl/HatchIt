'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import BuildFlowController from '@/components/BuildFlowController'

// =============================================================================
// BUILDER PAGE WRAPPER
// V3 Structured Build Flow
// URL: /builder
// =============================================================================

function BuilderContent() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project') // For resuming V3 projects

  // Always return V3 Structured Build Flow
  return <BuildFlowController existingProjectId={projectId || undefined} />
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
