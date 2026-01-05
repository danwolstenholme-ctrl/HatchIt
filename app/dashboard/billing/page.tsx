'use client'

import { useUser } from '@clerk/nextjs'
import { Check, Clock } from 'lucide-react'
import Link from 'next/link'

export default function BillingPage() {
  const { user } = useUser()
  const accountSubscription = user?.publicMetadata?.accountSubscription as any
  const currentTier = accountSubscription?.tier || 'free'
  
  // PAYMENTS GATED - Show coming soon
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Clock className="w-8 h-8 text-emerald-500" />
      </div>
      <h1 className="text-2xl font-semibold text-white mb-3">Paid Plans Coming Soon</h1>
      <p className="text-zinc-400 mb-8">
        We&apos;re putting the finishing touches on the builder. <br />
        For now, enjoy free access while we polish things up.
      </p>
      <Link 
        href="/builder"
        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-medium rounded-lg transition-colors"
      >
        Try the Builder
      </Link>
    </div>
  )

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Try it out',
      features: [
        '10 builds',
        '1 refinement',
        'Live preview',
        '1 project',
      ],
      cta: currentTier === 'free' ? 'Current plan' : 'Downgrade',
      current: currentTier === 'free',
      free: true,
    },
    {
      id: 'architect',
      name: 'Architect',
      price: 19,
      description: 'For individuals getting started',
      features: [
        'Unlimited builds & refinements',
        'Deploy to hatchit.dev',
        '3 projects',
      ],
      cta: currentTier === 'architect' ? 'Current plan' : 'Get started',
      current: currentTier === 'architect',
    },
    {
      id: 'visionary',
      name: 'Visionary',
      price: 49,
      description: 'For professionals who need more',
      features: [
        'Everything in Architect',
        '10 projects',
        'Download source code',
        'Custom domain',
        'No HatchIt branding',
        'Commercial license',
      ],
      cta: currentTier === 'visionary' ? 'Current plan' : 'Upgrade',
      current: currentTier === 'visionary',
      recommended: true,
    },
    {
      id: 'singularity',
      name: 'Singularity',
      price: 199,
      description: 'For teams and agencies',
      features: [
        'Everything in Visionary',
        'Unlimited projects',
        'API access',
        'Priority support',
        'Early access to features',
        'Dedicated infrastructure',
      ],
      cta: currentTier === 'singularity' ? 'Current plan' : 'Upgrade',
      current: currentTier === 'singularity',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-white mb-2">Billing</h1>
        <p className="text-zinc-500 text-sm">
          Manage your subscription and billing details
        </p>
      </div>

      {/* Current plan info */}
      <div className="mb-10 p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Current plan</p>
            <p className="text-lg font-medium text-white capitalize">{currentTier}</p>
          </div>
          {currentTier !== 'free' && (
            <a 
              href="/api/subscription/portal"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Manage subscription →
            </a>
          )}
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative p-6 rounded-xl border transition-all ${
              plan.current
                ? 'bg-emerald-500/5 border-emerald-500/30'
                : plan.recommended
                ? 'bg-white/[0.02] border-emerald-500/20 hover:border-emerald-500/40'
                : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            {plan.recommended && !plan.current && (
              <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-emerald-500 text-black text-[10px] font-semibold rounded">
                RECOMMENDED
              </div>
            )}

            <div className="mb-5">
              <h3 className="text-lg font-medium text-white mb-1">{plan.name}</h3>
              <p className="text-sm text-zinc-500">{plan.description}</p>
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-semibold text-white">${plan.price}</span>
              <span className="text-zinc-500 text-sm">/month</span>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {plan.current ? (
              <div className="w-full py-2.5 text-center text-sm text-emerald-400 border border-emerald-500/30 rounded-lg">
                Current plan
              </div>
            ) : (
              <a
                href={`/api/checkout?tier=${plan.id}`}
                className={`block w-full py-2.5 text-center text-sm font-medium rounded-lg transition-colors ${
                  plan.recommended
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                    : 'bg-white/[0.06] hover:bg-white/[0.1] text-white'
                }`}
              >
                {plan.cta}
              </a>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-zinc-600 mt-8">
        All plans include a 14-day money-back guarantee. Cancel anytime.
      </p>
    </div>
  )
}
