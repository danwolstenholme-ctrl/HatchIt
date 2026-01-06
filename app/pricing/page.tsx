'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function PricingPage() {
  const plans = [
    {
      tier: 'Architect',
      price: '$19',
      description: 'For individuals shipping their first site',
      color: 'emerald',
      borderClass: 'border-zinc-800 hover:border-emerald-500/40',
      featured: false,
      perks: [
        'Unlimited generations',
        'Deploy to hatchitsites.dev',
        '3 projects',
        'Download source code',
        'Live preview',
      ],
    },
    {
      tier: 'Visionary',
      price: '$49',
      description: 'For creators who ship fast and often',
      color: 'violet',
      borderClass: 'border-violet-500/30 hover:border-violet-500/50',
      featured: true,
      perks: [
        'Everything in Architect',
        'Unlimited projects',
        'Custom domains',
        'Remove HatchIt branding',
        'Self-healing code',
        'Priority support',
      ],
    },
    {
      tier: 'Singularity',
      price: '$199',
      description: 'For agencies and power users',
      color: 'amber',
      borderClass: 'border-zinc-800 hover:border-amber-500/40',
      featured: false,
      perks: [
        'Everything in Visionary',
        'Website Cloner (Replicator)',
        'Dream Engine (self-evolving UI)',
        'Direct founder access',
        'Early feature access',
        'Custom integrations',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 relative overflow-hidden selection:bg-emerald-500/30">
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center px-4 sm:px-6 pt-32 pb-16 overflow-hidden">
        {/* Gradient backdrop - matching how-it-works */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent to-zinc-950/90" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.sin(i) * 15, 0],
                opacity: [0.05, 0.2, 0.05],
                scale: [1, 1.3, 1]
              }}
              transition={{
                duration: 10 + i * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8
              }}
              className="absolute w-1 h-1 rounded-full bg-emerald-400/30"
              style={{
                left: `${15 + (i * 10)}%`,
                top: `${25 + (i % 3) * 20}%`,
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 text-zinc-400 text-sm mb-8"
          >
            <motion.span 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-emerald-400 rounded-full" 
            />
            Simple, transparent pricing
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-white leading-[1.1]"
          >
            Start free.
            <br />
            <motion.span
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(16,185,129,0.3)',
                  '0 0 40px rgba(16,185,129,0.4)',
                  '0 0 20px rgba(16,185,129,0.3)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent"
            >
              Scale when ready.
            </motion.span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl text-zinc-400 max-w-xl mx-auto"
          >
            No per-generation limits. No hidden fees. Pay when you deploy.
          </motion.p>
        </div>
      </section>

      <div className="relative z-10 px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          {/* Plans */}
          <div className="grid lg:grid-cols-3 gap-6 mb-16">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`relative p-8 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border ${plan.borderClass} flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-black/50`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-violet-500 text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 text-${plan.color}-400`}>
                    {plan.tier}
                  </h3>
                  <p className="text-sm text-zinc-500 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-zinc-500">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 text-${plan.color}-400 mt-0.5 flex-shrink-0`} />
                      <span className="text-zinc-300 text-sm">{perk}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/sign-up"
                  className={`group flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-semibold transition-all bg-${plan.color}-500/10 border border-${plan.color}-500/30 hover:bg-${plan.color}-500/15 hover:border-${plan.color}-500/50 text-white`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Free tier note */}
          <Section>
            <div className="text-center">
              <div className="inline-flex items-center gap-4 px-6 py-4 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-xl">
                <p className="text-zinc-400">
                  <span className="text-white font-medium">Free tier available.</span>{' '}
                  Build unlimited, pay at deploy.
                </p>
                <Link 
                  href="/demo" 
                  className="text-emerald-400 hover:text-emerald-300 font-medium whitespace-nowrap transition-colors"
                >
                  Try Demo
                </Link>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
