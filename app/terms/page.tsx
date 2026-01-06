'use client'

import { motion } from 'framer-motion'

export default function TermsPage() {
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
            Terms of Service
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
            Welcome to HatchIt. By accessing or using our website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">1. Access & Usage</h3>
            <p>We grant you a limited, non-exclusive, non-transferable, and revocable license to use our services for personal or commercial purposes. You agree not to use the service for any illegal or unauthorized purpose.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">2. Intellectual Property</h3>
            <div className="space-y-3">
              <p><span className="text-zinc-200">Your Content:</span> You retain 100% ownership of all code, designs, and content generated through HatchIt. We claim no intellectual property rights over your output.</p>
              <p><span className="text-zinc-200">Our Platform:</span> The HatchIt platform, including its interface, algorithms, and branding, remains our exclusive property.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">3. Subscription & Payments</h3>
            <p>Certain features require a paid subscription. By subscribing, you agree to pay the fees indicated for that service. Payments are processed securely via Stripe. You may cancel your subscription at any time.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">4. Limitation of Liability</h3>
            <p>In no event shall HatchIt, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">5. Termination</h3>
            <p>We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">6. Governing Law</h3>
            <p>These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">7. Changes</h3>
            <p>We reserve the right to modify or replace these Terms at any time. By continuing to access or use our service after revisions become effective, you agree to be bound by the revised terms.</p>
          </div>

          <div className="pt-8 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">
              Questions: <a href="mailto:support@hatchit.dev" className="text-emerald-400 hover:text-emerald-300 transition-colors">support@hatchit.dev</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
