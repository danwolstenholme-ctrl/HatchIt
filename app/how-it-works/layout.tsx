import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works - HatchIt | Build Websites with AI in 4 Simple Steps',
  description: 'Learn how to build professional websites with HatchIt in 4 simple steps: Describe, Generate, Refine, Deploy. No coding required. AI-powered React code generation from natural language descriptions.',
  keywords: [
    'how to build website with AI',
    'AI website builder tutorial',
    'no-code website creation',
    'website generator guide',
    'HatchIt tutorial',
    'build website without coding',
    'AI web development guide',
    'website builder instructions',
    'create website fast',
    'website in minutes',
  ],
  openGraph: {
    title: 'How It Works - HatchIt | Build Websites with AI',
    description: 'Build professional websites in 4 simple steps: Describe, Generate, Refine, Deploy. No coding required.',
    url: 'https://hatchit.dev/how-it-works',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works - HatchIt | Build Websites with AI',
    description: 'Build professional websites in 4 simple steps. No coding required.',
    creator: '@HatchItD',
  },
  alternates: {
    canonical: 'https://hatchit.dev/how-it-works',
  },
}

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
