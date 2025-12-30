'use client'

import { Analytics } from '@vercel/analytics/next'
import { useEffect, useState } from 'react'

export default function ConditionalAnalytics() {
  const [shouldLoad, setShouldLoad] = useState(true)

  useEffect(() => {
    // Skip analytics in development
    if (process.env.NODE_ENV === 'development') {
      setShouldLoad(false)
      return
    }

    // Skip if cookie is set (manual override)
    if (document.cookie.includes('skipAnalytics=true')) {
      setShouldLoad(false)
      return
    }

    // Get user's IP and compare against blocked IPs
    fetch('/api/check-ip')
      .then(res => res.json())
      .then(data => {
        // List of IPs to block (add your IP here)
        const blockedIPs = [
          '31.153.32.99', // Your Cyprus IP
          '2a00:1358:e2d7:4000:dc08:631b:f1f7:6978', // Your IPv6
        ]
        
        if (blockedIPs.includes(data.ip)) {
          setShouldLoad(false)
        }
      })
      .catch(() => {
        // If IP check fails, default to loading analytics
        setShouldLoad(true)
      })
  }, [])

  if (!shouldLoad) {
    return null
  }

  return <Analytics />
}