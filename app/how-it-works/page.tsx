'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { 
  Sparkles, Rocket, ArrowRight, Eye,
  MessageSquare, Code2, RefreshCw, Globe, Shield, Database,
  Zap, GitBranch, Cpu, CheckCircle2, Palette, MousePointer,
  Terminal, Layout, Smartphone, Layers, Download
} from 'lucide-react'

// Section wrapper with staggered animations
function Section({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center px-4 sm:px-6 pt-32 pb-24 overflow-hidden">
        {/* Gradient backdrop */}
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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-xs text-zinc-400 backdrop-blur-sm"
            >
              <motion.span 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-emerald-400 rounded-full" 
              />
              The complete pipeline
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]"
            >
              From idea to{' '}
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
                live site
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-500 bg-clip-text text-transparent"
              >
                in minutes.
              </motion.span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed"
            >
              AI-powered builder. Real infrastructure. Zero DevOps. 
              Here's exactly what happens when you build with HatchIt.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500 pt-4"
            >
              {['Claude Sonnet 4.5', 'React 19', 'Vercel Edge', 'Supabase'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* THE BUILD PIPELINE */}
      <Section className="px-4 sm:px-6 py-24 border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.04),transparent_70%)]" />
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              The Build Pipeline
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Three phases. Zero complexity. Production-ready output.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: '01', 
                icon: MessageSquare,
                title: 'Describe & Preview', 
                copy: 'Type in plain English. Watch production React + Tailwind render live. Refine with natural language until pixel-perfect.',
                features: ['Natural language prompts', 'Real-time preview', 'Iterative refinement'],
                delay: 0
              },
              { 
                step: '02', 
                icon: MousePointer,
                title: 'Edit & Customize', 
                copy: 'Point-and-click editing. Live preview updates instantly. We handle responsive design, accessibility, and performance.',
                features: ['Visual section editing', 'Responsive by default', 'Accessibility baked in'],
                delay: 0.1
              },
              { 
                step: '03', 
                icon: Rocket,
                title: 'Deploy Securely', 
                copy: 'One-click deploy to production infrastructure. Authentication, database, and CDN included. Custom domains supported.',
                features: ['Global edge deployment', 'SSL & security included', 'Full source export'],
                delay: 0.2
              },
            ].map((item) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                className="relative p-8 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl group hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/20 transition-all"
              >
                {/* Top highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="text-6xl font-bold text-zinc-800 mb-6">{item.step}</div>
                  
                  <motion.div 
                    whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                    className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors"
                  >
                    <item.icon className="w-6 h-6 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed mb-6">{item.copy}</p>
                  
                  <ul className="space-y-2">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-zinc-500">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400/70" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* THE AI ENGINE */}
      <Section className="px-4 sm:px-6 py-24 border-t border-zinc-900 bg-zinc-950/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.05),transparent_60%)]" />
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              The AI Engine
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Not a template system. Real AI that understands design, writes production code, and learns from feedback.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Cpu,
                title: 'Claude Sonnet 4.5',
                description: "Anthropic's most capable model for code generation. Understands context, follows design systems, and produces clean, maintainable React components.",
                delay: 0
              },
              {
                icon: Eye,
                title: 'Live Preview Rendering',
                description: 'See changes in real-time as the AI generates. No waiting for builds. Instant feedback loop for rapid iteration.',
                delay: 0.1
              },
              {
                icon: RefreshCw,
                title: 'Iterative Refinement',
                description: '"Make the button bigger." "Add more padding." "Use a darker shade." Natural language refinements applied instantly.',
                delay: 0.2
              },
              {
                icon: GitBranch,
                title: 'Version Control',
                description: 'Every generation is saved. Roll back to any previous version. Branch and experiment without losing work.',
                delay: 0.3
              }
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                    className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* REAL INFRASTRUCTURE */}
      <Section className="px-4 sm:px-6 py-24 border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.05),transparent_60%)]" />
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              Real infrastructure. Not a toy.
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Enterprise-grade deployment pipeline, secure authentication, managed database, and global CDN.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: Globe,
                title: 'Production Deployment',
                features: ['Global CDN with edge caching', 'Automatic SSL certificates', 'Custom domain support', 'Zero-downtime deploys'],
                delay: 0
              },
              {
                icon: Shield,
                title: 'Authentication & Security',
                features: ['Secure user accounts', 'OAuth integrations', 'Session management', 'Role-based access control'],
                delay: 0.1
              },
              {
                icon: Database,
                title: 'Database & Storage',
                features: ['PostgreSQL database', 'Real-time subscriptions', 'File storage & CDN', 'Automatic backups'],
                delay: 0.2
              },
              {
                icon: Zap,
                title: 'Integrations',
                features: ['Form handling', 'Analytics setup', 'Email capture', 'Payment processing'],
                delay: 0.3
              }
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="p-6 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-xl hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/20 transition-all group"
              >
                <motion.div whileHover={{ rotate: 360, transition: { duration: 0.6 } }}>
                  <item.icon className="w-8 h-8 text-zinc-400 group-hover:text-emerald-400 transition-colors mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-4">{item.title}</h3>
                <ul className="space-y-2">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/70" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Tech Stack Callout */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-xl text-center"
          >
            <p className="text-zinc-400">
              Built on production infrastructure:{' '}
              <span className="text-white font-medium">Vercel</span> for deployment,{' '}
              <span className="text-white font-medium">Supabase</span> for database,{' '}
              <span className="text-white font-medium">Clerk</span> for auth.{' '}
              Enterprise tools. Zero configuration.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* THE TECH STACK */}
      <Section className="px-4 sm:px-6 py-24 border-t border-zinc-900 bg-zinc-950/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.04),transparent_70%)]" />
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              What you get
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Production-ready code. Modern stack. Full ownership.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { name: 'React 19', icon: Code2 },
              { name: 'Tailwind 4', icon: Palette },
              { name: 'TypeScript', icon: Terminal },
              { name: 'Framer Motion', icon: Layers },
              { name: 'Responsive', icon: Smartphone },
              { name: 'Accessible', icon: CheckCircle2 },
              { name: 'SEO Ready', icon: Globe },
              { name: 'Full Export', icon: Download },
            ].map((tech, i) => (
              <motion.div 
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="flex items-center gap-3 px-4 py-4 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 rounded-xl transition-all group"
              >
                <motion.div whileHover={{ rotate: 360, transition: { duration: 0.6 } }}>
                  <tech.icon className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                </motion.div>
                <span className="text-sm font-medium text-zinc-300">{tech.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Code2,
                title: 'React 19 + TypeScript',
                description: 'Latest React with Server Components. Full TypeScript for type safety. The same stack used by Vercel, Linear, and Stripe.',
                delay: 0
              },
              {
                icon: Palette,
                title: 'Tailwind CSS 4',
                description: 'Utility-first CSS with zero config. Responsive design built in. Optimized for production with automatic purging.',
                delay: 0.1
              },
              {
                icon: Download,
                title: 'Full Source Export',
                description: 'Download your entire project anytime. No vendor lock-in. Run it locally, deploy anywhere, modify everything.',
                delay: 0.2
              }
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all group"
              >
                <motion.div whileHover={{ rotate: 360, transition: { duration: 0.6 } }}>
                  <item.icon className="w-8 h-8 text-zinc-400 group-hover:text-emerald-400 transition-colors mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="px-4 sm:px-6 py-24 border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white">Ready to build?</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Try the demo free. No account required. See exactly how it works before you commit.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/demo"
                className="group relative w-full sm:w-auto inline-flex justify-center items-center gap-3 px-8 py-4 bg-emerald-500/15 backdrop-blur-2xl border border-emerald-500/40 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent rounded-xl pointer-events-none" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative">Try the Demo</span>
                <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-zinc-800/50 backdrop-blur-xl hover:bg-zinc-800/60 border border-zinc-700/50 hover:border-zinc-600 px-8 py-4 font-medium text-zinc-200 transition-all"
              >
                View pricing
              </Link>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-zinc-500 text-sm"
            >
              No credit card required. Full access to the builder.
            </motion.p>
          </motion.div>
        </div>
      </Section>
    </div>
  )
}
