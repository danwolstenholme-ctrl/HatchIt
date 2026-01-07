'use client'

import { SignUp } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard'
  
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950/50 to-zinc-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <SignUp 
          forceRedirectUrl={redirectUrl}
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/50 shadow-2xl shadow-black/50',
              headerTitle: 'text-white font-bold',
              headerSubtitle: 'text-zinc-400',
              socialButtonsBlockButton: 'bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 text-white hover:bg-zinc-800/70 hover:border-zinc-600 transition-all',
              socialButtonsBlockButtonText: 'text-zinc-200 font-medium',
              dividerLine: 'bg-zinc-800',
              dividerText: 'text-zinc-500',
              formFieldLabel: 'text-zinc-300',
              formFieldInput: 'bg-zinc-800/50 border-zinc-700/50 text-white focus:border-emerald-500/50 focus:ring-emerald-500/20',
              footerActionLink: 'text-emerald-400 hover:text-emerald-300',
              identityPreviewText: 'text-zinc-300',
              identityPreviewEditButton: 'text-emerald-400 hover:text-emerald-300',
              formButtonPrimary: 'bg-emerald-500/15 backdrop-blur-xl border border-emerald-500/40 text-white hover:bg-emerald-500/25 hover:border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all font-semibold',
              formButtonReset: 'text-emerald-400 hover:text-emerald-300',
              alertText: 'text-zinc-300',
              footerActionText: 'text-zinc-400',
            }
          }}
        />
      </motion.div>
    </div>
  )
}
