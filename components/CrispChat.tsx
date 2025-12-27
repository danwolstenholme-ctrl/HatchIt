'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    $crisp: unknown[]
    CRISP_WEBSITE_ID: string
  }
}

export default function CrispChat() {
  const pathname = usePathname()
  const isBuilder = pathname?.startsWith('/builder')

  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID
    if (!websiteId) {
      console.warn('Crisp: NEXT_PUBLIC_CRISP_WEBSITE_ID not set')
      return
    }

    // Initialize Crisp
    window.$crisp = []
    window.CRISP_WEBSITE_ID = websiteId

    // Load the Crisp script
    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      // Cleanup on unmount (though Crisp typically persists)
      const existingScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  // Add/remove class to body for positioning adjustments in builder
  useEffect(() => {
    if (isBuilder) {
      document.body.classList.add('crisp-builder-mode')
    } else {
      document.body.classList.remove('crisp-builder-mode')
    }
    return () => {
      document.body.classList.remove('crisp-builder-mode')
    }
  }, [isBuilder])

  return null
}
