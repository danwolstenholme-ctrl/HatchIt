'use client'

import { motion } from 'framer-motion'
import { Shield, FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30 relative overflow-hidden">
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
            <Shield className="w-4 h-4" />
            <span>LEGAL_PROTOCOL</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-mono tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Terms of <span className="text-emerald-400">Service</span>
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
            Welcome to HatchIt.dev ("the System"). By accessing or using our website and services, you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the System.
          </p>

          <h3>1. Access & Usage</h3>
          <p>
            The System grants you a limited, non-exclusive, non-transferable, and revocable license to use our services for personal or commercial purposes. You agree not to use the System for any illegal or unauthorized purpose.
          </p>

          <h3>2. Intellectual Property</h3>
          <p>
            <strong>Your Content:</strong> You retain 100% ownership of all code, designs, and content generated through the System. We claim no intellectual property rights over the material you provide or the output generated for you.
          </p>
          <p>
            <strong>Our System:</strong> The HatchIt.dev platform, including its interface, proprietary algorithms, and branding, remains the exclusive property of HatchIt.dev.
          </p>

          <h3>3. Subscription & Payments</h3>
          <p>
            Certain features of the System require a paid subscription. By subscribing, you agree to pay the fees indicated for that service. Payments are processed securely via Stripe. You may cancel your subscription at any time.
          </p>

          <h3>4. Limitation of Liability</h3>
          <p>
            In no event shall HatchIt.dev, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h3>5. Termination</h3>
          <p>
            We may terminate or suspend access to our System immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h3>6. Governing Law</h3>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>

          <h3>7. Changes</h3>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our System after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <div className="mt-12 pt-8 border-t border-zinc-800">
            <p className="text-xs text-zinc-500">
              Questions regarding these Terms should be directed to <a href="mailto:support@hatchit.dev" className="text-emerald-400 hover:underline">support@hatchit.dev</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
