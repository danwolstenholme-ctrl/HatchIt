'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Terminal, Cpu, Zap, Code2, ArrowRight, Database, Layers, ShieldCheck } from 'lucide-react'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const transition = (delay = 0) => ({
  duration: 0.5,
  delay,
  ease: "easeOut" as const
});

const Phase = ({ icon: Icon, phase, title, description, delay = 0 }: { icon: any, phase: string, title: string, description: string, delay?: number }) => (
  <motion.div
    className="flex flex-col items-start text-left group"
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    transition={transition(delay)}
  >
    <div className="flex items-center justify-center w-12 h-12 rounded-sm bg-emerald-500/10 border border-emerald-500/20 mb-6 group-hover:bg-emerald-500/20 transition-colors">
      <Icon className="w-6 h-6 text-emerald-400" />
    </div>
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs font-mono text-emerald-500/60">PHASE_{phase}</span>
      <div className="h-px w-8 bg-emerald-500/20"></div>
    </div>
    <h3 className="text-xl font-bold mb-3 font-mono text-white">{title}</h3>
    <p className="text-zinc-400 text-sm leading-relaxed font-mono">{description}</p>
  </motion.div>
);

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,#10b98115,transparent)] pointer-events-none" />

      {/* Hero */}
      <div className="relative px-6 pt-24 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-2 text-emerald-400 mb-6 font-mono text-sm"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={transition()}
          >
            <Terminal className="w-4 h-4" />
            <span>EXECUTION_SEQUENCE</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-mono tracking-tight"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={transition(0.1)}
          >
            From Concept to <span className="text-emerald-400">Entity</span>
            <br />
            <span className="text-zinc-500">in T-Minus Seconds</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-zinc-400 max-w-2xl font-mono leading-relaxed"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={transition(0.2)}
          >
            The System streamlines the materialization process by converting natural language directives into production-grade architecture.
          </motion.p>
        </div>
      </div>

      {/* Phases */}
      <div className="px-6 py-24 border-y border-zinc-800/50 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 md:gap-16 items-start relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-6 left-0 w-full h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0"></div>

            <Phase 
              icon={Layers}
              phase="01"
              title="Initialization"
              description="Select a template vector (Website, Portfolio, SaaS). Define brand parameters: color hex codes, typography, and entity identity. The System enforces these constraints globally."
              delay={0}
            />
            <Phase 
              icon={Cpu}
              phase="02"
              title="Fabrication"
              description="Execute section generation sequentially. If input data is sparse, the Hatch Interface Entity will extrapolate prompts. Sonnet constructs. Opus refines."
              delay={0.1}
            />
            <Phase 
              icon={Zap}
              phase="03"
              title="Deployment"
              description="Instant compilation to live URL. Domain binding available. Full source code ownership retained by the Architect. No platform dependency."
              delay={0.2}
            />
          </div>
        </div>
      </div>

      {/* System Architecture */}
      <div className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="relative"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={transition(0.1)}
          >
            <div className="flex items-center gap-2 mb-12">
              <Database className="w-5 h-5 text-emerald-500" />
              <h2 className="text-2xl font-bold font-mono">System Architecture V3.0</h2>
            </div>

            <div className="grid gap-6">
              <div className="group p-6 bg-zinc-900/30 border border-zinc-800 hover:border-emerald-500/30 transition-colors rounded-sm">
                <div className="flex items-start gap-4">
                  <div className="mt-1 font-mono text-emerald-500 text-xs">[01]</div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 font-mono text-white group-hover:text-emerald-400 transition-colors">Tri-Core Neural Pipeline</h3>
                    <p className="text-zinc-400 text-sm font-mono leading-relaxed">
                      Distributed cognitive load. Claude Sonnet 4 handles rapid construction. Claude Opus 4 executes semantic refinement and accessibility compliance. Gemini 2.5 Pro performs final code audit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 bg-zinc-900/30 border border-zinc-800 hover:border-emerald-500/30 transition-colors rounded-sm">
                <div className="flex items-start gap-4">
                  <div className="mt-1 font-mono text-emerald-500 text-xs">[02]</div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 font-mono text-white group-hover:text-emerald-400 transition-colors">Hatch Interface Entity</h3>
                    <p className="text-zinc-400 text-sm font-mono leading-relaxed">
                      The bridge between Architect and System. Powered by Claude Haiku for low-latency interaction. Capable of extrapolating full prompt directives from minimal user input.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 bg-zinc-900/30 border border-zinc-800 hover:border-emerald-500/30 transition-colors rounded-sm">
                <div className="flex items-start gap-4">
                  <div className="mt-1 font-mono text-emerald-500 text-xs">[03]</div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 font-mono text-white group-hover:text-emerald-400 transition-colors">Sovereign Code Output</h3>
                    <p className="text-zinc-400 text-sm font-mono leading-relaxed">
                      Output is standard React/Tailwind architecture. Exportable as ZIP archive. Zero proprietary lock-in. The Architect retains full sovereignty over the generated codebase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="relative p-12 bg-zinc-900/30 border border-zinc-800 rounded-sm overflow-hidden group"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={transition(0.2)}
          >
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-mono relative z-10">Ready to Initialize?</h2>
            <p className="text-zinc-400 mb-8 font-mono relative z-10">Cease manual coding. Begin materialization.</p>
            
            <Link href="/builder" className="relative z-10 inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-zinc-950 hover:bg-emerald-400 rounded-sm font-bold text-lg font-mono transition-all">
              <Code2 className="w-5 h-5" />
              <span>INIT_BUILDER</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
