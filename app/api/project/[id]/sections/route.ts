import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getProjectById } from '@/lib/db'
import { supabaseAdmin } from '@/lib/supabase'

// =============================================================================
// ADD SECTION TO PROJECT
// POST /api/project/[id]/sections
// =============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    // Verify project ownership
    const project = await getProjectById(id)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    if (project.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { sectionId, orderIndex } = await request.json()
    
    if (!sectionId || typeof orderIndex !== 'number') {
      return NextResponse.json({ error: 'Missing sectionId or orderIndex' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Check if section already exists for this project
    const { data: existing } = await supabaseAdmin
      .from('sections')
      .select('id')
      .eq('project_id', id)
      .eq('section_id', sectionId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ 
        error: 'Section already exists', 
        existingId: existing.id 
      }, { status: 409 })
    }

    // Shift existing sections' order_index to make room
    await supabaseAdmin
      .from('sections')
      .update({ order_index: supabaseAdmin.rpc('increment_order', { x: 1 }) })
      .eq('project_id', id)
      .gte('order_index', orderIndex)

    // Actually, simpler approach - just update manually
    const { data: existingSections } = await supabaseAdmin
      .from('sections')
      .select('id, order_index')
      .eq('project_id', id)
      .gte('order_index', orderIndex)
      .order('order_index', { ascending: false })

    if (existingSections && existingSections.length > 0) {
      // Increment order_index for each section at or after insertion point
      for (const section of existingSections) {
        await supabaseAdmin
          .from('sections')
          .update({ order_index: section.order_index + 1 })
          .eq('id', section.id)
      }
    }

    // Insert new section
    const { data: newSection, error } = await supabaseAdmin
      .from('sections')
      .insert({
        project_id: id,
        section_id: sectionId,
        order_index: orderIndex,
        status: 'pending',
        code: null,
        user_prompt: null,
        refined: false,
        refinement_changes: null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating section:', error)
      return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
    }

    return NextResponse.json({ success: true, section: newSection })
  } catch (error) {
    console.error('Error in POST /api/project/[id]/sections:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
