import { supabaseAdmin, DbProject, DbBrandConfig } from '../supabase'

// =============================================================================
// PROJECT DATABASE OPERATIONS
// =============================================================================

/**
 * Generate a unique slug from project name
 */
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  
  // Add random suffix for uniqueness
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${base}-${suffix}`
}

/**
 * Create a new project with optional brand config
 */
export async function createProject(
  userId: string,
  name: string,
  templateId: string,
  brandConfig?: DbBrandConfig | null
): Promise<DbProject | null> {
  if (!supabaseAdmin) {
    console.error('Supabase admin client not configured')
    return null
  }

  const slug = generateSlug(name)

  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert({
      user_id: userId,
      name,
      slug,
      template_id: templateId,
      brand_config: brandConfig || null,
      status: 'building',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    return null
  }

  return data as DbProject
}

/**
 * Update project brand config
 */
export async function updateProjectBrandConfig(
  projectId: string,
  brandConfig: DbBrandConfig
): Promise<DbProject | null> {
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('projects')
    .update({ brand_config: brandConfig })
    .eq('id', projectId)
    .select()
    .single()

  if (error) {
    console.error('Error updating brand config:', error)
    return null
  }

  return data as DbProject
}

/**
 * Get all projects for a user
 */
export async function getProjectsByUserId(userId: string): Promise<DbProject[]> {
  if (!supabaseAdmin) return []

  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data as DbProject[]
}

/**
 * Get a project by ID
 */
export async function getProjectById(id: string): Promise<DbProject | null> {
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as DbProject
}

/**
 * Get a project by slug
 */
export async function getProjectBySlug(slug: string): Promise<DbProject | null> {
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as DbProject
}

/**
 * Update project status
 */
export async function updateProjectStatus(
  id: string,
  status: DbProject['status']
): Promise<DbProject | null> {
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('projects')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project status:', error)
    return null
  }

  return data as DbProject
}

/**
 * Update project name
 */
export async function updateProjectName(
  id: string,
  name: string
): Promise<DbProject | null> {
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('projects')
    .update({ name })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project name:', error)
    return null
  }

  return data as DbProject
}

/**
 * Delete a project (cascades to sections and builds)
 */
export async function deleteProject(id: string): Promise<boolean> {
  if (!supabaseAdmin) return false

  const { error } = await supabaseAdmin
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting project:', error)
    return false
  }

  return true
}

/**
 * Get project with progress info (uses view)
 */
export async function getProjectWithProgress(id: string): Promise<
  (DbProject & { total_sections: number; completed_sections: number; skipped_sections: number }) | null
> {
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('projects_with_progress')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}
