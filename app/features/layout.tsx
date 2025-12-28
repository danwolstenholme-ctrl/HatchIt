import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features - HatchIt | AI Website Builder with Live Code Streaming',
  description: 'Discover all HatchIt features: AI-powered generation with Claude Opus 4.5, live code streaming, one-click components, multi-page support, brand customization, version history, one-click deploy, and more. The most advanced AI website builder.',
  keywords: [
    'AI website builder',
    'AI web development',
    'React code generator',
    'live code streaming',
    'one-click components',
    'website generator',
    'no-code website builder',
    'AI landing page builder',
    'Claude AI website',
    'Tailwind CSS generator',
    'responsive website builder',
    'custom domain hosting',
    'React component generator',
    'AI design tool',
    'website deployment',
  ],
  openGraph: {
    title: 'Features - HatchIt | AI Website Builder',
    description: 'AI-powered website generation with live code streaming, one-click components, and instant deployment. See all the features that make HatchIt the best AI website builder.',
    url: 'https://hatchit.dev/features',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features - HatchIt | AI Website Builder',
    description: 'AI-powered website generation with live code streaming, one-click components, and instant deployment.',
    creator: '@HatchItD',
  },
  alternates: {
    canonical: 'https://hatchit.dev/features',
  },
}

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
