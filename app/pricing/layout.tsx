import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | HatchIt',
  description: 'Simple, transparent pricing. Start free, upgrade when you need deploys and exports. Plans from $19/month.',
  keywords: [
    'AI website builder pricing',
    'HatchIt plans',
    'website builder cost',
    'React generator pricing',
  ],
  openGraph: {
    title: 'Pricing | HatchIt',
    description: 'Simple, transparent pricing. Start free, upgrade when you need deploys and exports.',
    url: 'https://hatchit.dev/pricing',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | HatchIt',
    description: 'Simple, transparent pricing. Start free, upgrade when you need deploys and exports.',
    creator: '@HatchItD',
  },
  alternates: {
    canonical: 'https://hatchit.dev/pricing',
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
