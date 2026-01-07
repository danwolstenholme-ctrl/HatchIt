import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manifesto | HatchIt',
  description: 'The HatchIt manifesto. Why we built this and what we believe about the future of web development.',
  openGraph: {
    title: 'Manifesto | HatchIt',
    description: 'Why we built HatchIt and what we believe about the future of web development.',
    url: 'https://hatchit.dev/manifesto',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manifesto | HatchIt',
    description: 'Why we built HatchIt and what we believe.',
    creator: '@HatchItD',
  },
  alternates: {
    canonical: 'https://hatchit.dev/manifesto',
  },
}

export default function ManifestoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
