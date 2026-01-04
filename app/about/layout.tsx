import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Origin Story - HatchIt | The Singularity',
  description: 'The genesis of the Singularity Engine. How a recursive AI system evolved from a script into an Architect.',
  keywords: [
    'AI website builder',
    'Singularity Engine',
    'autonomous coding',
    'React generation',
    'AI architect',
    'HatchIt origin',
  ],
  openGraph: {
    title: 'Origin Story - HatchIt | The Singularity',
    description: 'It wasn\'t built. It was grown. The story of the Singularity Engine.',
    url: 'https://hatchit.dev/about',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Origin Story - HatchIt | The Singularity',
    description: 'It wasn\'t built. It was grown. The story of the Singularity Engine.',
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
