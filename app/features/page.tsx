'use client'
import Link from 'next/link'
import { motion, useReducedMotion as useFramerReducedMotion } from 'framer-motion'
import { useState, useSyncExternalStore } from 'react'
import { Terminal, Cpu, Network, Zap, Code2, Shield, Layers, Globe, Box, Lock, Brain, Sparkles, MessageSquare } from 'lucide-react'

// Client-side check to prevent hydration mismatch
const emptySubscribe = () => () => {}
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

// Custom hook to detect reduced motion preference
function useReducedMotion() {
  const prefersReducedMotion = useFramerReducedMotion()
  return prefersReducedMotion
}

export default function FeaturesPage() {
  const reducedMotion = useReducedMotion()
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  const coreFeatures = [
    {
      id: 'ai-generation',
      icon: <Cpu className="w-6 h-6" />,
      title: 'Unified Genesis Architecture',
      subtitle: 'Powered by Claude 3.5 Sonnet',
      description: "It's not just a chatbot. It's a full-stack engineer. The Genesis Engine writes the code, tests it, fixes bugs, and optimizes for mobile—all in one go. You describe the result; it handles the implementation.",
      details: [
        'Genesis Engine: Instant logic generation',
        'The Architect: Semantic & accessibility refinement',
        'The Auditor: Security & best-practice audit',
        'Recursive self-correction loop',
      ],
      gradient: 'from-white/10 to-zinc-500/10',
    },
    {
      id: 'hatch-helper',
      icon: <Terminal className="w-6 h-6" />,
      title: 'Direct Line Interface',
      subtitle: 'Voice-to-Code Protocol',
      description: 'Bypass the keyboard. Speak your intent directly to the Architect. The system parses natural language into executable React components in real-time.',
      details: [
        'Latency: <200ms voice parsing',
        'Context-aware intent resolution',
        'Recursive prompt refinement',
        'Hands-free architectural control',
      ],
      gradient: 'from-white/10 to-zinc-500/10',
      badge: 'V4.0',
    },
    {
      id: 'section-building',
      icon: <Layers className="w-6 h-6" />,
      title: 'Modular Architecture',
      subtitle: 'Component-Level Isolation',
      description: 'Build the system piece by piece. Header, hero, features, pricing—each module is isolated, generated, and refined before integration into the main branch.',
      details: [
        'Atomic component generation',
        'Context-aware integration',
        'Style propagation system',
        'Modular rollback capability',
      ],
      gradient: 'from-white/10 to-zinc-500/10',
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-[100px] opacity-50 md:opacity-100" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-zinc-500/5 rounded-full blur-[100px] opacity-50 md:opacity-100" />
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-white/5 rounded-full blur-[100px] opacity-50 md:opacity-100" />
      </div>
      
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 text-center z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm mb-8 font-mono"
          >
            <Zap className="w-4 h-4" />
            <span>SYSTEM_CAPABILITIES</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight"
          >
            Beyond
            <br />
            <span className="text-white">
              Templates.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The Architect does not use drag-and-drop. It uses a recursive neural pipeline to generate, audit, and deploy production-grade React code.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/builder"
              className="px-8 py-4 bg-white hover:bg-zinc-200 text-black rounded-full font-bold text-lg transition-all shadow-lg hover:scale-105"
            >
              Initialize System
            </Link>
            <Link
              href="/roadmap"
              className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-full font-semibold text-lg transition-all text-zinc-300 hover:text-white"
            >
              View Evolution Log
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {coreFeatures.map((feature, i) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-6 md:p-8 rounded-xl bg-zinc-900/20 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:bg-zinc-900/40"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    {feature.badge && (
                      <span className="px-2 py-1 rounded text-xs font-mono bg-white/10 text-white border border-white/20">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1 text-white">{feature.title}</h3>
                  <p className="text-sm font-mono text-zinc-500 mb-4">{feature.subtitle}</p>
                  <p className="text-zinc-400 leading-relaxed mb-6">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.details.map((detail, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-zinc-500">
                        <div className="w-1 h-1 rounded-full bg-white/50" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Neural Network (AI Models) */}
      <section className="py-24 px-6 relative z-10 bg-zinc-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The Neural Network</h2>
            <p className="text-zinc-400">Three specialized models working in perfect synchronization.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Gemini 3 Pro",
                role: "The Architect",
                desc: "Vision, high-level architecture, and user intent analysis. It sees the big picture.",
                icon: <Brain className="w-6 h-6" />,
                color: "text-teal-400",
                bg: "bg-violet-500/10",
                border: "border-violet-500/20"
              },
              {
                name: "Claude Sonnet 4",
                role: "The Engine",
                desc: "Heavy lifting and code generation. It writes strict, production-ready TypeScript.",
                icon: <Cpu className="w-6 h-6" />,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20"
              },
              {
                name: "Claude Opus 4.5",
                role: "The Poet",
                desc: "Creative direction and marketing copy. It gives the system its voice and soul.",
                icon: <Sparkles className="w-6 h-6" />,
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20"
              }
            ].map((model, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-md bg-zinc-950 border ${model.border} hover:border-opacity-50 transition-all group`}
              >
                <div className={`w-12 h-12 rounded-md ${model.bg} ${model.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {model.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{model.name}</h3>
                <p className={`text-sm font-mono ${model.color} mb-4`}>{model.role}</p>
                <p className="text-zinc-400 text-sm leading-relaxed">{model.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="py-24 px-6 border-t border-zinc-800/50 bg-zinc-900/20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">System Architecture</h2>
            <p className="text-zinc-400">Built on the bleeding edge. Outputs standard, maintainable code.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Code2 />, label: "React 19" },
              { icon: <Box />, label: "Next.js 15" },
              { icon: <Layers />, label: "Tailwind 4" },
              { icon: <Globe />, label: "Edge Ready" },
              { icon: <Shield />, label: "Auth v5" },
              { icon: <Zap />, label: "Framer Motion" },
              { icon: <Lock />, label: "TypeScript 5" },
              { icon: <Terminal />, label: "Node 22" },
            ].map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-md bg-zinc-950 border border-zinc-800 flex items-center gap-3 hover:border-emerald-500/30 transition-colors group"
              >
                <div className="text-zinc-500 group-hover:text-emerald-400 transition-colors">
                  {tech.icon}
                </div>
                <span className="font-mono text-sm text-zinc-300">{tech.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
