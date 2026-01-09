'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { LogoMark } from '@/components/Logo'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/features', label: 'Features' },
    { href: '/dashboard/builds', label: 'Builds' },
    { href: '/dashboard/billing', label: 'Billing' },
    { href: '/dashboard/settings', label: 'Settings' },
  ]
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-zinc-500/20">
      {/* Subtle grid pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <Link href="/" className="block hover:opacity-70 transition-opacity">
              <LogoMark size={24} />
            </Link>
            
            <nav className="flex items-center gap-0.5 bg-zinc-900/80 backdrop-blur-sm p-0.5 rounded-lg border border-zinc-800/60">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                      isActive
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-7 h-7 ring-1 ring-zinc-700 hover:ring-zinc-600 transition-all"
              }
            }}
          />
        </div>

        <main className="relative">
          {children}
        </main>
      </div>
    </div>
  )
}
