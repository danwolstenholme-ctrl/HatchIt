import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { skipSection, getSectionById, getProjectById, getOrCreateUser } from '@/lib/db'

// =============================================================================
// POST: Skip a section
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

    const { id: sectionId } = await params

    // Verify ownership: section -> project -> user
    const existingSection = await getSectionById(sectionId)
    if (!existingSection) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }
    const project = await getProjectById(existingSection.project_id)
    if (!project || project.user_id !== dbUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const section = await skipSection(sectionId)
    if (!section) {
      return NextResponse.json(
        { error: 'Failed to skip section' },
        { status: 500 }
      )
    }

    return NextResponse.json({ section })

  } catch (error) {
    console.error('Error skipping section:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
