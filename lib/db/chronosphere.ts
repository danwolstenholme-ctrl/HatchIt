import { supabaseAdmin, StyleDNA } from '../supabase'

// =============================================================================
// THE CHRONOSPHERE (USER STYLE DNA)
// =============================================================================

const DEFAULT_DNA: StyleDNA = {
  vibe_keywords: [],
  preferred_colors: [],
  preferred_fonts: [],
  rejected_patterns: [],
  evolution_stage: 1,
  last_updated: new Date().toISOString()
}

/**
 * Get the user's Style DNA
 */
export async function getUserDNA(userId: string): Promise<StyleDNA> {
  if (!supabaseAdmin) return DEFAULT_DNA

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('style_dna')
    .eq('id', userId)
    .single()

  if (error || !data) {
    console.warn('Failed to fetch user DNA:', error)
    return DEFAULT_DNA
  }

  return (data.style_dna as StyleDNA) || DEFAULT_DNA
}

/**
 * Update the user's Style DNA
 */
export async function updateUserDNA(userId: string, dna: StyleDNA): Promise<void> {
  if (!supabaseAdmin) return

  const { error } = await supabaseAdmin
    .from('users')
    .update({ style_dna: dna })
    .eq('id', userId)

  if (error) {
    console.error('Failed to update user DNA:', error)
  }
}
