import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand Assets | HatchIt',
  description: 'HatchIt brand assets. Logos, colors, and guidelines for press and partners.',
  openGraph: {
    title: 'Brand Assets | HatchIt',
    description: 'HatchIt brand assets. Logos, colors, and guidelines.',
    url: 'https://hatchit.dev/brand-assets',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brand Assets | HatchIt',
    description: 'HatchIt brand assets. Logos, colors, and guidelines.',
    creator: '@HatchItD',
  },
  alternates: {
    canonical: 'https://hatchit.dev/brand-assets',
  },
}

export default function BrandAssetsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
