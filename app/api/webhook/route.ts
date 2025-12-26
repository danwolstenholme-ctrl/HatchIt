import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { clerkClient } from '@clerk/nextjs/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
})

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId

    if (userId) {
      try {
        const client = await clerkClient()
        await client.users.updateUser(userId, {
          publicMetadata: {
            paid: true,
            stripeCustomerId: session.customer,
            subscriptionId: session.subscription,
          },
        })
        console.log(`User ${userId} marked as paid in Clerk`, {
          paid: true,
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
        })
      } catch (err) {
        console.error('Failed to update user:', err)
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string
    console.log(`Subscription canceled for customer: ${customerId}`)

    try {
      // Find the user by Stripe customer ID and mark them as unpaid
      const client = await clerkClient()
      const users = await client.users.getUserList({
        query: customerId,
      })

      if (users.data && users.data.length > 0) {
        const user = users.data[0]
        const deployedSlugs = (user.publicMetadata?.deployedSlugs as string[]) || []

        // Update Clerk to mark user as unpaid
        await client.users.updateUser(user.id, {
          publicMetadata: {
            paid: false,
            deployedSlugs: [], // Clear deployed slugs
          },
        })

        console.log(`User ${user.id} marked as unpaid in Clerk`)

        // Delete all deployed projects from Vercel
        const vercelToken = process.env.VERCEL_TOKEN
        if (vercelToken && deployedSlugs.length > 0) {
          for (const slug of deployedSlugs) {
            try {
              const deleteResponse = await fetch(`https://api.vercel.com/v9/projects/${slug}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${vercelToken}`,
                },
              })

              if (deleteResponse.ok) {
                console.log(`Successfully deleted deployed project: ${slug}`)
              } else {
                console.error(`Failed to delete deployed project ${slug}:`, deleteResponse.status)
              }
            } catch (err) {
              console.error(`Error deleting deployed project ${slug}:`, err)
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to process subscription cancellation:', err)
    }
  }

  return NextResponse.json({ received: true })
}