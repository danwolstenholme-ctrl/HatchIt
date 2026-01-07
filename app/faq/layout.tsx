import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | HatchIt',
  description: 'Frequently asked questions about HatchIt. Learn how the AI website builder works, pricing, deployment, and more.',
  openGraph: {
    title: 'FAQ | HatchIt',
    description: 'Frequently asked questions about HatchIt. Learn how it works, pricing, and more.',
    url: 'https://hatchit.dev/faq',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | HatchIt',
    description: 'Frequently asked questions about HatchIt. Learn how it works, pricing, and more.',
    creator: '@HatchItD',
  },
  alternates: {
    canonical: 'https://hatchit.dev/faq',
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
