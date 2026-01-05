'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <main className="relative">
        {children}
      </main>
    </div>
  )
}
