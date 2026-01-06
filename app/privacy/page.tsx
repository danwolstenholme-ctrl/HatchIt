'use client'

import { motion } from 'framer-motion'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 relative overflow-hidden selection:bg-emerald-500/30">
      {/* Gradient backdrops */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/4 rounded-full blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-12 z-10">
        <div className="max-w-2xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Privacy Policy
          </motion.h1>
          
          <motion.p 
            className="text-sm text-zinc-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Last updated: December 30, 2025
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <motion.div 
        className="max-w-2xl mx-auto px-6 pb-24 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="space-y-8 text-zinc-400 leading-relaxed">
          <p>
            At HatchIt, we prioritize the sovereignty of your data. This Privacy Policy outlines how we collect, use, and protect your information.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">1. Information Collection</h3>
            <div className="space-y-3">
              <p><span className="text-zinc-200">Personal Data:</span> We collect minimal personal data required for account operation, such as your email address and authentication details via Clerk.</p>
              <p><span className="text-zinc-200">Project Data:</span> We store the prompts, configurations, and generated code associated with your projects to provide the service.</p>
              <p><span className="text-zinc-200">Usage Data:</span> We collect anonymous telemetry on usage to optimize performance and feature development.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">2. Data Usage</h3>
            <p className="mb-3">We use your data solely to:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>Provide and maintain the service</li>
              <li>Process your generation requests via our AI pipeline</li>
              <li>Manage your subscription and billing via Stripe</li>
              <li>Communicate with you regarding updates</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">3. Data Sharing</h3>
            <p className="mb-3">We do not sell your data. We share data only with essential third-party infrastructure providers:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li><span className="text-zinc-200">Clerk:</span> For authentication</li>
              <li><span className="text-zinc-200">Stripe:</span> For payment processing</li>
              <li><span className="text-zinc-200">Anthropic/Google:</span> For AI generation</li>
              <li><span className="text-zinc-200">Supabase:</span> For database persistence</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">4. Data Security</h3>
            <p>We employ industry-standard encryption and security protocols to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">5. Your Rights</h3>
            <p>You have the right to access, update, or delete your personal data at any time. You may request a full data export or deletion by contacting support.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">6. Cookies</h3>
            <p>We use essential cookies for authentication and session management. We do not use tracking cookies for third-party advertising.</p>
          </div>

          <div className="pt-8 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">
              Privacy inquiries: <a href="mailto:privacy@hatchit.dev" className="text-emerald-400 hover:text-emerald-300 transition-colors">privacy@hatchit.dev</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
