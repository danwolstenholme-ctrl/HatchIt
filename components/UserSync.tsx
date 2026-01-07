'use client'

import { useEffect } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import { createClerkSupabaseClient } from '@/lib/supabase'

const SUPABASE_JWT_TEMPLATE = process.env.NEXT_PUBLIC_CLERK_SUPABASE_TEMPLATE

export default function UserSync() {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user) return

      try {
        const templateName = SUPABASE_JWT_TEMPLATE
        if (!templateName) {
          if (process.env.NODE_ENV === 'development') {
            console.debug('[UserSync] Skipping sync - NEXT_PUBLIC_CLERK_SUPABASE_TEMPLATE not set')
          }
          return
        }

        const token = await getToken({ template: templateName }).catch((error) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[UserSync] Failed to fetch Clerk JWT for Supabase sync. Ensure the template exists or set NEXT_PUBLIC_CLERK_SUPABASE_TEMPLATE.', error)
          }
          return null
        })

        if (!token) return

        const supabase = createClerkSupabaseClient(token)

        const { error } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            full_name: user.fullName,
            avatar_url: user.imageUrl,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (error) {
          console.error('Error syncing user to Supabase:', error)
        }
      } catch (err) {
        // Silently fail - user sync is not critical
        console.debug('User sync skipped:', err)
      }
    }

    syncUser()
  }, [isLoaded, user, getToken])

  return null
}
