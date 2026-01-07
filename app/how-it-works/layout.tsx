import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works | HatchIt',
  description: 'See how HatchIt turns your ideas into live websites. Describe your site, watch AI build each section, refine with prompts, and deploy with one click.',
  keywords: [
    'AI website builder',
    'how it works',
    'React generation',
    'website from text',
    'AI development',
    'HatchIt tutorial',
  ],
  openGraph: {
    title: 'How It Works | HatchIt',
    description: 'Describe → Build → Refine → Deploy. See how HatchIt turns ideas into websites.',
    url: 'https://hatchit.dev/how-it-works',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works | HatchIt',
    description: 'Describe → Build → Refine → Deploy. See how HatchIt turns ideas into websites.',
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
