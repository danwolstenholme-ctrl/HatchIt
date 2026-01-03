'use client'

import { useEffect } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import { createClerkSupabaseClient } from '@/lib/supabase'

export default function UserSync() {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user) return

      try {
        const token = await getToken({ template: 'supabase' })
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
        console.error('Failed to sync user:', err)
      }
    }

    syncUser()
  }, [isLoaded, user, getToken])

  return null
}
