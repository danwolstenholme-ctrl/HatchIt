import { supabaseAdmin, DbUser } from '../supabase'

// =============================================================================
// USER DATABASE OPERATIONS
// =============================================================================

/**
 * Get or create a user record from Clerk ID
 * Called when user first accesses the builder
 */
export async function getOrCreateUser(
  clerkId: string,
  email?: string | null
): Promise<DbUser | null> {
  if (!supabaseAdmin) {
    console.error('Supabase admin client not configured')
    return null
  }

  // First, try to find existing user
  const { data: existingUser, error: findError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single()

  if (existingUser && !findError) {
    // Update email if it changed
    if (email && existingUser.email !== email) {
      await supabaseAdmin
        .from('users')
        .update({ email })
        .eq('id', existingUser.id)
    }
    return existingUser as DbUser
  }

  // User doesn't exist, create them
  const { data: newUser, error: createError } = await supabaseAdmin
    .from('users')
    .insert({
      clerk_id: clerkId,
      email: email || null,
    })
    .select()
    .single()

  if (createError) {
    console.error('Error creating user:', createError)
    return null
  }

  return newUser as DbUser
}

/**
 * Get user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string): Promise<DbUser | null> {
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single()

  if (error) return null
  return data as DbUser
}

/**
 * Get user by internal ID
 */
export async function getUserById(id: string): Promise<DbUser | null> {
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as DbUser
}
