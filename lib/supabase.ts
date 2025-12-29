import { createClient, SupabaseClient } from '@supabase/supabase-js'

// =============================================================================
// SUPABASE CLIENT INITIALIZATION
// =============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client-side Supabase client (uses anon key, respects RLS)
// Only create if URL is configured
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Server-side Supabase client (uses service role key, bypasses RLS)
// Only use this in API routes, never expose to client
export const supabaseAdmin: SupabaseClient | null = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// =============================================================================
// TYPE DEFINITIONS (matching Supabase schema)
// =============================================================================

export interface DbUser {
  id: string
  clerk_id: string
  email: string | null
  created_at: string
}

export interface DbProject {
  id: string
  user_id: string
  name: string
  slug: string
  template_id: string
  status: 'building' | 'complete' | 'deployed'
  created_at: string
  updated_at: string
}

export interface DbSection {
  id: string
  project_id: string
  section_id: string
  code: string | null
  user_prompt: string | null
  refined: boolean
  refinement_changes: string[] | null
  status: 'pending' | 'building' | 'complete' | 'skipped'
  order_index: number
  created_at: string
  updated_at: string
}

export interface DbBuild {
  id: string
  project_id: string
  full_code: string
  version: number
  audit_complete: boolean
  audit_changes: string[] | null
  deployed_url: string | null
  created_at: string
}

// =============================================================================
// HELPER: Check if Supabase is configured
// =============================================================================

export const isSupabaseConfigured = (): boolean => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export const isSupabaseAdminConfigured = (): boolean => {
  return !!(isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY)
}
