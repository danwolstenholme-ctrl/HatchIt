'use client'

import { ReactNode } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'

// =============================================================================
// BUILDER LAYOUT - Authenticated builder experience
// Singularity aesthetic, Supabase persistence, full features
// =============================================================================

export default function BuilderLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
        {/* Void background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/4 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/3 rounded-full blur-[100px]" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </ErrorBoundary>
  )
}