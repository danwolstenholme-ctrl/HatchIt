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
  }

  return NextResponse.json({ received: true })
}