import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter, JetBrains_Mono } from 'next/font/google';
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import ContactButton from "@/components/ContactButton";
import ConditionalNavigation from "@/components/ConditionalNavigation";
import ConditionalFooter from "@/components/ConditionalFooter";
import ConditionalAnalytics from "@/components/ConditionalAnalytics";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import UserSync from "@/components/UserSync";
import "./globals.css";

// System Status: FUNCTIONAL. Verified by The Engineer.

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#09090b',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://hatchit.dev'),
  title: 'HatchIt | The Singularity Interface',
  description: 'Not just a website builder. A recursive, self-healing architectural system. Speak your intent, watch the code evolve. Welcome to the post-prompt era.',
  keywords: ['AI website builder', 'React', 'Tailwind CSS', 'Singularity', 'Self-Healing Code', 'Direct Line API'],
  authors: [{ name: 'HatchIt' }],
  creator: 'HatchIt',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HatchIt',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hatchit.dev',
    siteName: 'HatchIt',
    title: 'HatchIt | The Singularity Interface',
    description: 'Not just a website builder. A recursive, self-healing architectural system.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@HatchItD',
    creator: '@HatchItD',
    title: 'HatchIt — The Architect | AI Website Builder',
    description: 'The prompt is dead. Speak your intent. Watch the code evolve. The Singularity Interface is here.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#ffffff', // white
          colorBackground: '#18181b', // zinc-900
          colorText: '#f4f4f5', // zinc-100
          colorTextSecondary: '#a1a1aa', // zinc-400
          colorInputBackground: '#09090b', // zinc-950
          colorInputText: '#fff',
          borderRadius: '0.75rem',
        },
        elements: {
          rootBox: 'font-sans',
          card: 'bg-zinc-900 border border-zinc-800 shadow-xl',
          headerTitle: 'text-white font-bold',
          headerSubtitle: 'text-zinc-400 text-sm',
          formButtonPrimary: 'bg-white hover:bg-zinc-200 text-black font-bold shadow-lg transition-all',
          formFieldInput: 'bg-zinc-950 border-zinc-800 focus:border-white text-white',
          formFieldLabel: 'text-zinc-400 text-xs uppercase tracking-wider',
          footerActionLink: 'text-white hover:text-zinc-300',
          identityPreviewText: 'text-zinc-300',
          formFieldInputShowPasswordButton: 'text-zinc-400 hover:text-white',
          socialButtonsBlockButton: 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 transition-all',
          socialButtonsBlockButtonText: 'text-xs',
          dividerLine: 'bg-zinc-800',
          dividerText: 'text-zinc-600 text-[10px] uppercase',
          footer: 'hidden', // Hide the "Secured by Clerk" footer for cleaner look if allowed, or style it minimal
        }
      }}
    >
      <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <body className="font-sans antialiased bg-zinc-950 text-white selection:bg-emerald-500/30">
          <SubscriptionProvider>
            <UserSync />
            <ServiceWorkerRegistration />
            <ConditionalNavigation />
            {children}
            <ConditionalFooter />
            <ContactButton />
            <ConditionalAnalytics />
          </SubscriptionProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}