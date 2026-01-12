import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getProjectById } from '@/lib/db'

// =============================================================================
// VERCEL DEPLOYMENT DATA API
// Fetches real-time deployment info from Vercel for a project
// =============================================================================

const VERCEL_TEAM_ID = 'team_jFQEvL36dljJxRCn3ekJ9WdF'

interface VercelDeployment {
  uid: string
  name: string
  url: string
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  createdAt: number
  buildingAt?: number
  ready?: number
  meta?: {
    githubCommitMessage?: string
    githubCommitRef?: string
  }
}

interface VercelProject {
  id: string
  name: string
  framework: string | null
  latestDeployments?: VercelDeployment[]
  targets?: {
    production?: {
      alias?: string[]
      url?: string
    }
  }
}

// GET: Fetch deployment data from Vercel
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

    // Get project and verify ownership
    const project = await getProjectById(projectId)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    if (project.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if project has been deployed
    if (!project.vercel_project_id) {
      return NextResponse.json({
        deployed: false,
        message: 'Project has not been deployed yet'
      })
    }

    const vercelToken = process.env.VERCEL_TOKEN
    if (!vercelToken) {
      return NextResponse.json({ error: 'Vercel not configured' }, { status: 500 })
    }

    // Fetch project info from Vercel
    const projectResponse = await fetch(
      `https://api.vercel.com/v9/projects/${project.vercel_project_id}?teamId=${VERCEL_TEAM_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
        },
      }
    )

    if (!projectResponse.ok) {
      // Project might have been deleted from Vercel
      if (projectResponse.status === 404) {
        return NextResponse.json({
          deployed: false,
          vercelDeleted: true,
          message: 'Vercel project no longer exists'
        })
      }
      throw new Error(`Vercel API error: ${projectResponse.status}`)
    }

    const vercelProject: VercelProject = await projectResponse.json()

    // Fetch recent deployments
    const deploymentsResponse = await fetch(
      `https://api.vercel.com/v6/deployments?teamId=${VERCEL_TEAM_ID}&projectId=${project.vercel_project_id}&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
        },
      }
    )

    let deployments: VercelDeployment[] = []
    if (deploymentsResponse.ok) {
      const deploymentsData = await deploymentsResponse.json()
      deployments = deploymentsData.deployments || []
    }

    // Find the current production deployment
    const productionDeployment = deployments.find(d => d.state === 'READY')
    const latestDeployment = deployments[0]

    // Build the live URL
    const liveUrl = project.deployed_slug 
      ? `https://${project.deployed_slug}.hatchit.dev`
      : null

    return NextResponse.json({
      deployed: true,
      vercelProjectId: project.vercel_project_id,
      vercelProjectName: vercelProject.name,
      liveUrl,
      // Current status
      status: latestDeployment?.state || 'UNKNOWN',
      // Production info
      production: productionDeployment ? {
        deploymentId: productionDeployment.uid,
        url: liveUrl,
        state: productionDeployment.state,
        createdAt: new Date(productionDeployment.createdAt).toISOString(),
        readyAt: productionDeployment.ready 
          ? new Date(productionDeployment.ready).toISOString() 
          : null,
      } : null,
      // Recent deployments
      deployments: deployments.map(d => ({
        id: d.uid,
        state: d.state,
        url: `https://${d.url}`,
        createdAt: new Date(d.createdAt).toISOString(),
        readyAt: d.ready ? new Date(d.ready).toISOString() : null,
        buildingAt: d.buildingAt ? new Date(d.buildingAt).toISOString() : null,
      })),
      // Links for management
      vercelDashboard: `https://vercel.com/hatchitdev/${vercelProject.name}`,
      vercelLogs: latestDeployment 
        ? `https://vercel.com/hatchitdev/${vercelProject.name}/${latestDeployment.uid}`
        : null,
    })

  } catch (error) {
    console.error('Error fetching Vercel data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deployment data' },
      { status: 500 }
    )
  }
}

// DELETE: Take down the deployed site (delete Vercel project)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params

    // Get project and verify ownership
    const project = await getProjectById(projectId)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    if (project.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!project.vercel_project_id) {
      return NextResponse.json({ 
        error: 'Project has not been deployed' 
      }, { status: 400 })
    }

    const vercelToken = process.env.VERCEL_TOKEN
    if (!vercelToken) {
      return NextResponse.json({ error: 'Vercel not configured' }, { status: 500 })
    }

    // Delete the Vercel project
    const deleteResponse = await fetch(
      `https://api.vercel.com/v9/projects/${project.vercel_project_id}?teamId=${VERCEL_TEAM_ID}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
        },
      }
    )

    if (!deleteResponse.ok && deleteResponse.status !== 404) {
      const error = await deleteResponse.json()
      console.error('Vercel delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete from Vercel' },
        { status: 500 }
      )
    }

    // Clear the Vercel project ID from our database
    // Note: We don't delete the HatchIt project, just the deployment
    const { supabaseAdmin } = await import('@/lib/supabase')
    if (supabaseAdmin) {
      await supabaseAdmin
        .from('projects')
        .update({ 
          vercel_project_id: null,
          deployed_slug: null,
          deployed_at: null,
          status: 'complete'  // Revert to complete, not deployed
        })
        .eq('id', projectId)
    }

    return NextResponse.json({
      success: true,
      message: 'Site taken down successfully'
    })

  } catch (error) {
    console.error('Error deleting Vercel deployment:', error)
    return NextResponse.json(
      { error: 'Failed to take down site' },
      { status: 500 }
    )
  }
}
