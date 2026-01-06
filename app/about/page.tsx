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
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-emerald-400/30"
            style={{
              left: `${15 + (i * 10) % 70}%`,
              top: `${20 + (i * 12) % 60}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 10 + i * 1.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Gradient backdrops */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/4 rounded-full blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-16 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Built by one person.
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              For everyone.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
