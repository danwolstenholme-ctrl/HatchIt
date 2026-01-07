import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | HatchIt',
  description: 'Get in touch with the HatchIt team. Questions, feedback, or just want to say hi.',
  openGraph: {
    title: 'Contact | HatchIt',
    description: 'Get in touch with the HatchIt team. Questions, feedback, or just want to say hi.',
    url: 'https://hatchit.dev/contact',
    siteName: 'HatchIt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | HatchIt',
    description: 'Get in touch with the HatchIt team.',
    creator: '@HatchItD',
  },
  alternates: {
    canonical: 'https://hatchit.dev/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
