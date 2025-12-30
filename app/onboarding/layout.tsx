import { ReactNode } from 'react'
import Link from 'next/link'
import { Box } from 'lucide-react'

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 flex flex-col">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <header className="h-20 flex items-center justify-between px-8 relative z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-sm flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
            <Box className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="font-mono font-bold text-lg tracking-tighter">DEMIURGE</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-500">INITIALIZATION_SEQUENCE</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8 relative z-10">
        {children}
      </main>
    </div>
  )
}
