import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About HatchIt - Built in 3 Days, Perfected in 7',
  description: 'The story of HatchIt: how one founder with zero React knowledge built a production-grade AI website builder in 7 days using Claude Opus 4.5 and Gemini 2.5 Pro. Real code, real results.',
  keywords: [
    'about HatchIt',
    'AI website builder story',
    'Claude Opus 4.5',
    'Gemini 2.5 Pro',
    'React code generator',
    'AI coding tool',
    'no-code to real code',
    'startup website builder',
    'solo founder',
    'built with AI',
  ],
  openGraph: {
    title: 'About HatchIt - Built in 3 Days, Perfected in 7',
    description: 'How one founder with zero React knowledge built a production-grade AI website builder in 7 days. The AI writes the code, I make the decisions.',
    url: 'https://hatchit.dev/about',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About HatchIt - Built in 3 Days, Perfected in 7',
    description: 'How one founder built a production-grade AI website builder in 7 days with zero React knowledge.',
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
