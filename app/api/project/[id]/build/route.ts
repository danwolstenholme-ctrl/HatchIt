import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createBuild, getLatestBuild, updateProjectStatus } from '@/lib/db'

// =============================================================================
// POST: Create a build from completed sections
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

    const { id: projectId } = await params

    // Create the build
    const build = await createBuild(projectId)
    if (!build) {
      return NextResponse.json(
        { error: 'Failed to create build' },
        { status: 500 }
      )
    }

    // Update project status to complete
    await updateProjectStatus(projectId, 'complete')

    return NextResponse.json({ build })

  } catch (error) {
    console.error('Error creating build:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// =============================================================================
// GET: Get the latest build for a project
// =============================================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params

    const build = await getLatestBuild(projectId)
    if (!build) {
      return NextResponse.json({ error: 'No build found' }, { status: 404 })
    }

    return NextResponse.json({ build })

  } catch (error) {
    console.error('Error fetching build:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
