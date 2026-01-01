'use client'

import { SignUp } from '@clerk/nextjs'
import { CheckCircle2, Zap, Code2, Shield } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/builder'
  
  return (
    <div className="min-h-screen bg-zinc-950 flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 gap-8 lg:gap-16 relative z-10">
        
        {/* Left Column: Value Props (Hidden on small mobile, visible on tablet+) */}
        <div className="hidden md:flex flex-col max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Free to start
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              Build real software <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">in minutes.</span>
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Join the architects building the future. No credit card required for the starter tier.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Instant Generation</h3>
                <p className="text-sm text-zinc-500">Describe your vision and watch The Architect build it section by section.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                <Code2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Production-Ready Code</h3>
                <p className="text-sm text-zinc-500">Get clean, modern React + Tailwind code that you can export and own.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Secure & Scalable</h3>
                <p className="text-sm text-zinc-500">Built on Next.js 14 with enterprise-grade security and performance.</p>
              </div>
            </div>
          </div>

          {/* Social Proof Mini */}
          <div className="mt-10 pt-8 border-t border-zinc-800/50 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[10px] text-zinc-500">
                  {/* Placeholder avatars */}
                  <div className={`w-full h-full rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800`} />
                </div>
              ))}
            </div>
            <div className="text-xs text-zinc-500">
              <span className="text-white font-medium">Join builders</span> creating with AI
            </div>
          </div>
        </div>

        {/* Right Column: Sign Up Form */}
        <div className="w-full max-w-md">
          {/* Mobile Header (Visible only on mobile) */}
          <div className="md:hidden text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-zinc-400 text-sm">Start building for free. No credit card needed.</p>
          </div>

          <SignUp 
            forceRedirectUrl={redirectUrl}
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-2xl rounded-xl w-full',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white transition-all',
                formFieldInput: 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-white',
                formFieldLabel: 'text-zinc-400',
                footerActionLink: 'text-emerald-500 hover:text-emerald-400',
                identityPreviewText: 'text-zinc-300',
                formFieldInputShowPasswordButton: 'text-zinc-400 hover:text-white',
                dividerLine: 'bg-zinc-800',
                dividerText: 'text-zinc-500',
                socialButtonsBlockButton: 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900 text-zinc-300',
                socialButtonsBlockButtonText: 'font-medium',
                formFieldInputPlaceholder: 'text-zinc-600',
              },
              layout: {
                socialButtonsPlacement: 'top',
                showOptionalFields: false,
              }
            }} 
          />
        </div>
      </div>
    </div>
  )
}