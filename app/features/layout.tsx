import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features | HatchIt',
  description: 'Explore what HatchIt can do. Real-time AI code generation, live preview, section-by-section building, one-click deploys, and clean React + Tailwind output.',
  keywords: [
    'AI website builder',
    'React code generator',
    'live preview',
    'one-click deploy',
    'Tailwind CSS',
    'Claude AI',
    'website builder features',
  ],
  openGraph: {
    title: 'Features | HatchIt',
    description: 'Real-time AI code generation, live preview, and one-click deploys. See what HatchIt can do.',
    url: 'https://hatchit.dev/features',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features | HatchIt',
    description: 'Real-time AI code generation, live preview, and one-click deploys. See what HatchIt can do.',
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
