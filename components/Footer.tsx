'use client'

import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-800/50">
      {/* Subtle glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Main content */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10 sm:gap-8">
          
          {/* Brand + tagline */}
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="text-sm text-zinc-500 max-w-xs">
              Text to React. Ship faster.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-6 sm:gap-x-12">
            {/* Product */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Product</span>
              <Link href="/demo" className="text-sm text-zinc-400 hover:text-white transition-colors">Demo</Link>
              <Link href="/how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">How It Works</Link>
              <Link href="/features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</Link>
              <Link href="/roadmap" className="text-sm text-zinc-400 hover:text-white transition-colors">Roadmap</Link>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Company</span>
              <Link href="/about" className="text-sm text-zinc-400 hover:text-white transition-colors">About</Link>
              <Link href="/privacy" className="text-sm text-zinc-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-sm text-zinc-400 hover:text-white transition-colors">Terms</Link>
            </div>

            {/* Connect */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Connect</span>
              <a 
                href="https://reddit.com/r/hatchit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
                Reddit
              </a>
              <a 
                href="https://twitter.com/haborymern"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-zinc-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">
            © {currentYear} HatchIt
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  )
}
