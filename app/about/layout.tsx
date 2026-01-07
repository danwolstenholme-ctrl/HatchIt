import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | HatchIt',
  description: 'The story behind HatchIt. Built by a developer who was tired of WordPress, templates, and bloated AI tools. Real React code, instant deploys.',
  keywords: [
    'AI website builder',
    'about HatchIt',
    'React generation',
    'website builder story',
    'indie developer',
    'HatchIt founder',
  ],
  openGraph: {
    title: 'About | HatchIt',
    description: 'Built by a developer who was tired of WordPress, templates, and bloated AI tools.',
    url: 'https://hatchit.dev/about',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | HatchIt',
    description: 'Built by a developer who was tired of WordPress, templates, and bloated AI tools.',
    creator: '@HatchItD',
  },
  alternates: {
    canonical: 'https://hatchit.dev/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
