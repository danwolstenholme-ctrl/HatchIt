import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog | HatchIt',
  description: 'See what\'s new in HatchIt. Release notes, updates, and improvements.',
  openGraph: {
    title: 'Changelog | HatchIt',
    description: 'See what\'s new in HatchIt. Release notes, updates, and improvements.',
    url: 'https://hatchit.dev/changelog',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog | HatchIt',
    description: 'See what\'s new in HatchIt. Release notes and updates.',
    creator: '@HatchItD',
  },
  alternates: {
    canonical: 'https://hatchit.dev/changelog',
  },
}

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
