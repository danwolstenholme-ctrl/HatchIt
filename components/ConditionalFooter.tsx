'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  
  // Don't show footer on builder or canvas pages
  if (pathname?.startsWith('/builder') || pathname?.startsWith('/canvas')) {
    return null
  }
  
  return <Footer />
}
