'use client'

import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ContactButton() {
  const pathname = usePathname()
  
  // Don't show on the contact page, builder, or demo pages
  if (pathname === '/contact' || pathname?.startsWith('/builder') || pathname?.startsWith('/demo')) return null

  const contactUrl = `/contact?returnUrl=${encodeURIComponent(pathname)}`

  return (
    <Link href={contactUrl} aria-label="Contact Support">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-zinc-900 border border-zinc-800 rounded-full hover:border-zinc-700 hover:bg-zinc-800 transition-colors group"
      >
        <MessageSquare className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
        <span className="hidden sm:inline text-xs md:text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
          Contact
        </span>
      </motion.div>
    </Link>
  )
}
