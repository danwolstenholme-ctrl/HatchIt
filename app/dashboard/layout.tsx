'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'
import { 
  LayoutDashboard, 
  Sparkles, 
  Activity, 
  CreditCard, 
  Settings,
  Rocket
} from 'lucide-react'
import { LogoMark } from '@/components/Logo'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user } = useUser()

  const accountSubscription = user?.publicMetadata?.accountSubscription as { tier?: string } | undefined
  const tier = accountSubscription?.tier || 'free'

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/features', label: 'Features', icon: Sparkles },
    { href: '/dashboard/builds', label: 'Builds', icon: Activity },
    { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-zinc-500/20">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 flex min-h-screen">
        <aside className="w-56 border-r border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl flex flex-col fixed h-full">
          <div className="p-4 border-b border-zinc-800/60">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <LogoMark size={20} />
              <span className="text-sm font-semibold text-white">HatchIt</span>
            </Link>
          </div>

          <nav className="flex-1 p-3 space-y-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all ${
                    active
                      ? 'text-white bg-zinc-800/80'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="p-3 border-t border-zinc-800/60 space-y-3">
            <Link
              href="/builder"
              className="flex items-center justify-center gap-2 w-full px-3 py-2 text-[13px] font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors"
            >
              <Rocket className="w-4 h-4" />
              New Project
            </Link>

            <div className="flex items-center gap-3 px-2 py-1.5">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-7 h-7 ring-1 ring-zinc-700"
                  }
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-zinc-400 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                <p className="text-[10px] text-zinc-500 capitalize">{tier} plan</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 ml-56">
          <div className="max-w-5xl mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
