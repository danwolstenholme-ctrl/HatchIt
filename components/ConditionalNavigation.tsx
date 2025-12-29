'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function ConditionalNavigation() {
  const pathname = usePathname()
  
  // Don't show navigation on builder or canvas pages
  if (pathname?.startsWith('/builder') || pathname?.startsWith('/canvas')) {
    return null
  }
  
  return <Navigation />
}
