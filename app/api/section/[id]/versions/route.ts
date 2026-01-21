import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSectionById, getSectionVersions, rollbackSectionToVersion, pushSectionVersion } from '@/lib/db'

// =============================================================================
// SECTION VERSION HISTORY API
// GET: Get version history for a section
// POST: Rollback to a specific version
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

    const { id: sectionId } = await params

    // Verify section exists and user has access
    const section = await getSectionById(sectionId)
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }

    // Get version history
    const versions = await getSectionVersions(sectionId)

    return NextResponse.json({
      success: true,
      versions,
      currentCode: section.code,
      sectionId: section.section_id,
    })

  } catch (error) {
    console.error('Error fetching section versions:', error)
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 })
  }
}

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
    const body = await request.json()
    const { versionIndex } = body

    if (typeof versionIndex !== 'number') {
      return NextResponse.json({ error: 'versionIndex is required' }, { status: 400 })
    }

    // Verify section exists
    const section = await getSectionById(sectionId)
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }

    // Save current code as a version before rollback (so user can undo the rollback)
    if (section.code) {
      await pushSectionVersion(sectionId, section.code, 'Before rollback')
    }

    // Rollback to the specified version
    const updatedSection = await rollbackSectionToVersion(sectionId, versionIndex)
    
    if (!updatedSection) {
      return NextResponse.json({ error: 'Failed to rollback' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      code: updatedSection.code,
      message: `Rolled back to version ${versionIndex + 1}`,
    })

  } catch (error) {
    console.error('Error rolling back section:', error)
    return NextResponse.json({ error: 'Failed to rollback' }, { status: 500 })
  }
}
