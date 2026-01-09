import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { AccountSubscription } from '@/types/subscriptions'

// Admin emails that can upgrade accounts (bootstrap list)
const ADMIN_EMAILS = [
  'dan@hatchit.ai',
  'dan.wolstenholme@gmail.com',
]

/**
 * POST /api/admin/upgrade
 * Admin-only endpoint to manually set a user's subscription tier
 * 
 * Body: { userId?: string, tier: 'architect' | 'visionary' | 'singularity' }
 * - If userId is omitted, upgrades the calling user (self-upgrade)
 * - Caller must be admin (publicMetadata.role === 'admin' OR email in ADMIN_EMAILS)
 */
export async function POST(request: NextRequest) {
  try {
    const { userId: callerId } = await auth()
    
    if (!callerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clerkClient()
    const caller = await client.users.getUser(callerId)
    
    // Admin check - either role or email
    const callerEmail = caller.emailAddresses?.[0]?.emailAddress?.toLowerCase()
    const isAdmin = caller.publicMetadata?.role === 'admin' || 
                    (callerEmail && ADMIN_EMAILS.includes(callerEmail))
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, tier } = body as { userId?: string; tier?: string }
    
    // Validate tier
    const validTiers = ['architect', 'visionary', 'singularity']
    if (!tier || !validTiers.includes(tier)) {
      return NextResponse.json({ 
        error: 'Invalid tier. Must be one of: architect, visionary, singularity' 
      }, { status: 400 })
    }

    // Target user - self if not specified
    const targetUserId = userId || callerId
    const targetUser = await client.users.getUser(targetUserId)
    
    // Create subscription record
    const now = new Date()
    const periodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year
    
    const accountSubscription: AccountSubscription = {
      tier: tier as 'architect' | 'visionary' | 'singularity',
      stripeSubscriptionId: 'admin-grant',
      stripeCustomerId: 'admin-grant',
      status: 'active',
      currentPeriodEnd: periodEnd.toISOString(),
      createdAt: now.toISOString(),
    }
    
    await client.users.updateUser(targetUserId, {
      publicMetadata: {
        ...targetUser.publicMetadata,
        accountSubscription,
        opusRefinementsUsed: 0,
        opusRefinementsResetDate: periodEnd.toISOString(),
      },
    })

    console.log(`[Admin Upgrade] ${callerId} upgraded ${targetUserId} to ${tier}`)

    return NextResponse.json({
      success: true,
      message: `Upgraded to ${tier}`,
      subscription: accountSubscription
    })
    
  } catch (error) {
    console.error('[Admin Upgrade Error]', error)
    return NextResponse.json({ error: 'Failed to upgrade' }, { status: 500 })
  }
}
