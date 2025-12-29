import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { skipSection } from '@/lib/db'

// =============================================================================
// POST: Skip a section
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

    const { id: sectionId } = await params

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
