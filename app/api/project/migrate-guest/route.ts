import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Project } from '@/types/builder'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { projects } = await req.json() as { projects: Project[] }
    
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'No projects to migrate' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Migrate each project to Supabase
    const migratedProjects = []
    
    for (const localProject of projects) {
      // Generate unique slug from project name
      const slug = `${localProject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).slice(2, 8)}`
      
      // Get the latest code from project
      const latestCode = localProject.code || localProject.versions?.[localProject.currentVersionIndex]?.code || ''
      
      // Insert project into Supabase
      const { data: project, error: projectError } = await supabaseAdmin
        .from('projects')
        .insert({
          user_id: userId,
          name: localProject.name,
          description: localProject.description || null,
          slug,
          template_id: 'single-page',
          brand_config: localProject.brand || null,
          status: localProject.status || 'complete',
          deployed_url: localProject.deployedSlug ? `https://${localProject.deployedSlug}.hatchitsites.dev` : null,
          custom_domain: localProject.customDomain || null,
        })
        .select()
        .single()

      if (projectError) {
        console.error('Error migrating project:', projectError)
        continue
      }

      // Create a single section with the project's code
      if (latestCode && project?.id) {
        const { error: sectionError } = await supabaseAdmin
          .from('sections')
          .insert({
            project_id: project.id,
            type: 'hero',
            order: 0,
            code: latestCode,
            user_prompt: localProject.vibe || localProject.description || '',
            status: 'complete',
            refined: false,
          })

        if (sectionError) {
          console.error('Error migrating section:', sectionError)
        }
      }

      migratedProjects.push(project)
    }

    return NextResponse.json({ 
      success: true, 
      migratedCount: migratedProjects.length,
      projects: migratedProjects 
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 })
  }
}
