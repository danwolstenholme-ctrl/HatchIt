import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About HatchIt - The Story Behind the AI Website Builder',
  description: 'Learn about HatchIt\'s mission to democratize web development. Discover our story, values, and the technology powering the most advanced AI website builder. From idea to live site in minutes.',
  keywords: [
    'about HatchIt',
    'AI website builder story',
    'web development democratization',
    'HatchIt mission',
    'AI coding tool',
    'no-code website builder',
    'React code generator',
    'startup website builder',
    'AI development platform',
    'Claude AI website builder',
  ],
  openGraph: {
    title: 'About HatchIt - The Story Behind the AI Website Builder',
    description: 'Learn about HatchIt\'s mission to democratize web development. From idea to live site in minutes with the power of AI.',
    url: 'https://hatchit.dev/about',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About HatchIt - The Story Behind the AI Website Builder',
    description: 'Learn about HatchIt\'s mission to democratize web development.',
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
