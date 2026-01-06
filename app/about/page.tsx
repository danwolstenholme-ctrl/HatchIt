'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 overflow-hidden relative selection:bg-emerald-500/30">
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center px-4 sm:px-6 pt-32 pb-24 overflow-hidden">
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

        <div className="relative z-10 max-w-3xl mx-auto w-full text-center">
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
            The story
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white leading-[1.1]"
          >
            Built by one person.
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
              For everyone.
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            HatchIt started with a simple question: what if you could describe a website and have AI build it for you?
          </motion.p>
        </div>
      </section>

      {/* The Story */}
      <Section>
        <div className="px-6 py-16 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-8 text-lg text-zinc-300 leading-relaxed">
              <p>
                Web development is slow. You either drag rectangles around in a no-code tool 
                and get something generic, or you write code from scratch and spend weeks 
                on boilerplate.
              </p>
              <p>
                I wanted something in between. A tool where I could describe what I want 
                in plain English, and get real, production-ready code out the other side. 
                Not templates. Not components I have to glue together. Actual websites.
              </p>
              <p>
                So I built HatchIt. It uses Claude to write React components, Tailwind for 
                styling, and deploys to real infrastructure. You describe, it builds, you ship.
              </p>
              <p className="text-zinc-400">
                December 2024. Melbourne, Australia.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Founder Quote */}
      <Section delay={0.1}>
        <div className="px-6 py-16 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="p-8 md:p-10 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl">
              <blockquote className="text-xl md:text-2xl font-light text-zinc-200 leading-relaxed mb-6">
                &ldquo;The AI writes the code, I make the decisions. I focus on the product, 
                the user, the vision. The implementation details? That&apos;s what machines are for.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-lg font-bold text-zinc-950">
                  D
                </div>
                <div>
                  <div className="font-medium text-white">Dan</div>
                  <div className="text-sm text-zinc-500">Founder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section delay={0.1}>
        <div className="px-6 py-20 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to build?</h2>
            <p className="text-lg text-zinc-400 mb-8">
              Try it free. No credit card required.
            </p>
            <Link
              href="/builder"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-emerald-500/50 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            >
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                Open Builder
              </span>
              <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  )
}
