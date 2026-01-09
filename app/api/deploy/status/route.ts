import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// =============================================================================
// DEPLOYMENT STATUS API
// Check Vercel deployment status to provide user feedback
// =============================================================================

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const deploymentId = req.nextUrl.searchParams.get('id')
    const slug = req.nextUrl.searchParams.get('slug')
    
    if (!deploymentId && !slug) {
      return NextResponse.json({ error: 'Missing deployment ID or slug' }, { status: 400 })
    }

    // If we have a slug, try to fetch the site directly first
    if (slug) {
      try {
        const siteUrl = `https://${slug}.hatchitsites.dev`
        const response = await fetch(siteUrl, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        })
        
        if (response.ok) {
          return NextResponse.json({
            status: 'ready',
            url: siteUrl
          })
        }
      } catch {
        // Site not ready, continue to check Vercel
      }
    }

    // Check Vercel deployment status
    if (deploymentId) {
      const response = await fetch(
        `https://api.vercel.com/v13/deployments/${deploymentId}?teamId=team_itec4dUtXYYa962mXb7ZnLGg`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
          },
        }
      )

      if (!response.ok) {
        return NextResponse.json({ 
          status: 'unknown',
          error: 'Could not fetch deployment status'
        })
      }

      const deployment = await response.json()
      
      // Vercel deployment states: QUEUED, BUILDING, READY, ERROR, CANCELED
      const state = deployment.readyState || deployment.state
      
      if (state === 'READY') {
        return NextResponse.json({
          status: 'ready',
          url: `https://${deployment.alias?.[0] || deployment.url}`
        })
      }
      
      if (state === 'ERROR' || state === 'CANCELED') {
        // Get build logs URL for debugging
        const logsUrl = `https://vercel.com/hatchit-sites/${deployment.name}/${deploymentId.split('_')[1]}`
        
        return NextResponse.json({
          status: 'failed',
          error: deployment.errorMessage || 'Build failed',
          logsUrl,
          errorCode: deployment.errorCode
        })
      }
      
      if (state === 'BUILDING' || state === 'QUEUED') {
        return NextResponse.json({
          status: 'building',
          message: state === 'QUEUED' ? 'Queued...' : 'Building...'
        })
      }

      return NextResponse.json({
        status: 'unknown',
        state
      })
    }

    return NextResponse.json({ status: 'unknown' })

  } catch (error) {
    console.error('Deployment status check error:', error)
    return NextResponse.json({ 
      status: 'unknown',
      error: 'Failed to check status'
    }, { status: 500 })
  }
}
