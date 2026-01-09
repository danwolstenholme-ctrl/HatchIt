import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getProjectById, updateProjectName } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { name } = await request.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid project name' }, { status: 400 })
    }

    // Verify ownership
    const project = await getProjectById(id)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    if (project.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update the name
    const updated = await updateProjectName(id, name.trim())
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update project name' }, { status: 500 })
    }

    return NextResponse.json({ success: true, project: updated })
  } catch (error) {
    console.error('Error updating project name:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
