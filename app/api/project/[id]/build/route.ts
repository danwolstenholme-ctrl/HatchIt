import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createBuild, getLatestBuild, updateProjectStatus, getProjectById, getOrCreateUser } from '@/lib/db'

// =============================================================================
// POST: Create a build from completed sections
// =============================================================================
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress
    const dbUser = await getOrCreateUser(clerkId, email)
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id: projectId } = await params

    // Verify ownership using internal user ID
    const project = await getProjectById(projectId)
    if (!project || project.user_id !== dbUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress
    const dbUser = await getOrCreateUser(clerkId, email)
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id: projectId } = await params

    // Verify ownership using internal user ID
    const project = await getProjectById(projectId)
    if (!project || project.user_id !== dbUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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
