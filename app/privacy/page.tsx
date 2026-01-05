'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Ambient void background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay" />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,#10b98115,transparent)] pointer-events-none" />

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-16 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-2 text-emerald-400 mb-6 font-mono text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Lock className="w-4 h-4" />
            <span>PRIVACY_PROTOCOL</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-mono tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Privacy <span className="text-emerald-400">Policy</span>
          </motion.h1>
          
          <motion.p 
            className="text-xs text-zinc-500 font-mono uppercase tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Last updated: December 30, 2025
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-24 relative z-10">
        <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-mono prose-headings:text-white prose-p:text-zinc-400 prose-p:font-mono prose-p:text-sm prose-li:text-zinc-400 prose-li:font-mono prose-li:text-sm prose-strong:text-emerald-400">
          <p>
            At HatchIt.dev ("the System"), we prioritize the sovereignty of your data. This Privacy Policy outlines our protocols for collecting, using, and protecting your information.
          </p>

          <h3>1. Information Collection</h3>
          <p>
            <strong>Personal Data:</strong> We collect minimal personal data required for account operation, such as your email address and authentication details via Clerk.
          </p>
          <p>
            <strong>Project Data:</strong> We store the prompts, configurations, and generated code associated with your projects to provide the service.
          </p>
          <p>
            <strong>Usage Data:</strong> We collect anonymous telemetry on System usage to optimize performance and feature development.
          </p>

          <h3>2. Data Usage</h3>
          <p>
            We use your data solely to:
          </p>
          <ul>
            <li>Provide and maintain the System.</li>
            <li>Process your generation requests via our AI pipeline.</li>
            <li>Manage your subscription and billing via Stripe.</li>
            <li>Communicate with you regarding System updates.</li>
          </ul>

          <h3>3. Data Sharing</h3>
          <p>
            We do not sell your data. We share data only with essential third-party infrastructure providers:
          </p>
          <ul>
            <li><strong>Clerk:</strong> For authentication.</li>
            <li><strong>Stripe:</strong> For payment processing.</li>
            <li><strong>Anthropic/Google:</strong> For AI generation (prompts only, anonymized where possible).</li>
            <li><strong>Supabase:</strong> For database persistence.</li>
          </ul>

          <h3>4. Data Security</h3>
          <p>
            We employ industry-standard encryption and security protocols to protect your data. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h3>5. Your Rights</h3>
          <p>
            You have the right to access, update, or delete your personal data at any time. You may request a full data export or deletion by contacting support.
          </p>

          <h3>6. Cookies</h3>
          <p>
            We use essential cookies for authentication and session management. We do not use tracking cookies for third-party advertising.
          </p>

          <div className="mt-12 pt-8 border-t border-zinc-800">
            <p className="text-xs text-zinc-500">
              Privacy inquiries should be directed to <a href="mailto:privacy@hatchit.dev" className="text-emerald-400 hover:underline">privacy@hatchit.dev</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
