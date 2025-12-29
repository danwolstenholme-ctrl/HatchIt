'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const transition = (delay = 0) => ({
  duration: 0.5,
  delay,
  ease: "easeOut" as const
});

const Step = ({ icon, step, title, description, delay = 0 }: { icon: string, step: string, title: string, description: string, delay?: number }) => (
  <motion.div
    className="flex flex-col items-center text-center"
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    transition={transition(delay)}
  >
    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4">
      <span className="text-3xl">{icon}</span>
    </div>
    <div className="text-xs font-mono text-purple-400/60 mb-2">STEP {step}</div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-zinc-400">{description}</p>
  </motion.div>
);

export default function HowItWorksPage() {
  return (
    <div className="bg-zinc-950 text-white">
      {/* Hero */}
      <div className="relative px-6 pt-16 pb-24 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-3xl mx-auto">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={transition()}
          >
            From Idea to Live Site in Minutes
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-zinc-400"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={transition(0.1)}
          >
            HatchIt streamlines the development process by turning your natural language prompts into high-quality, production-ready code. Here's how it works.
          </motion.p>
        </div>
      </div>

      {/* Steps */}
      <div className="px-6 py-24 bg-zinc-900/30 border-y border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
            <Step 
              icon="💭"
              step="01"
              title="Describe Your Vision"
              description="Start with a simple prompt. Describe the component, page, or full site you want to build. Be as descriptive as you like. Mention colors, layout, and content."
              delay={0}
            />
            <Step 
              icon="⚡"
              step="02"
              title="Watch the AI Build"
              description="Hit 'Build' and watch the code stream in real-time. HatchIt generates clean, production-quality React code using Tailwind CSS for styling."
              delay={0.1}
            />
            <Step 
              icon="🔄"
              step="03"
              title="Iterate and Refine"
              description="The first draft is just the beginning. Use follow-up prompts to tweak styles, add sections, change logic, or fix bugs. The AI understands context."
              delay={0.2}
            />
          </div>
        </div>
      </div>

      {/* Deeper Dive Section */}
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
            <h2 className="text-3xl font-bold text-center mb-12">A Developer-First Workflow</h2>
            <div className="space-y-8">
              <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <h3 className="text-xl font-bold mb-2">Real Code, Not Lock-in</h3>
                <p className="text-zinc-400">
                  We generate standard React and Tailwind CSS code. You can export it at any time as a ZIP file, giving you full ownership and control. No proprietary formats, no platform lock-in.
                </p>
              </div>
              <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <h3 className="text-xl font-bold mb-2">Live Previews, Instantly</h3>
                <p className="text-zinc-400">
                  As the AI generates code, you see a live, interactive preview of your component. This instant feedback loop makes iteration incredibly fast and intuitive.
                </p>
              </div>
              <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <h3 className="text-xl font-bold mb-2">One-Click Deployment</h3>
                <p className="text-zinc-400">
                  When you're ready, deploy your project to a live URL with a single click. Connect a custom domain for a professional finish. (Coming soon!)
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="relative p-12 bg-gradient-to-br from-purple-900/40 to-pink-900/30 border border-purple-500/20 rounded-3xl"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={transition(0.2)}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to build faster?</h2>
            <p className="text-xl text-zinc-300 mb-8">Stop writing boilerplate. Start creating.</p>
            <Link href="/builder" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 hover:bg-zinc-100 rounded-xl font-bold text-lg transition-all">
              Start Building Free <span>→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
