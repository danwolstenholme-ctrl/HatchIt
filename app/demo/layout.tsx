import type { Metadata } from 'next'
import { ReactNode } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'Demo | HatchIt',
  description: 'Try HatchIt free. No signup required. Describe your website and watch AI build it in real-time.',
  openGraph: {
    title: 'Demo | HatchIt',
    description: 'Try HatchIt free. No signup required. Describe your website and watch AI build it.',
    url: 'https://hatchit.dev/demo',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demo | HatchIt',
    description: 'Try HatchIt free. No signup required. Describe your website and watch AI build it.',
    creator: '@HatchItD',
  },
  alternates: {
    canonical: 'https://hatchit.dev/demo',
  },
}

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Void background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </ErrorBoundary>
  )
}
