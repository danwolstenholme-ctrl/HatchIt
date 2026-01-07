'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Plus, 
  Layers, 
  Sparkles, 
  MessageSquare, 
  Eye,
  Globe,
  Zap,
  Shield,
  Download,
  Rocket,
  Lock,
  ArrowRight,
  ChevronDown,
  FileCode,
  Check
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// =============================================================================
// DEMO SIDEBAR - Focused on Hero section, Witness available to help
// Clear indication of demo mode, other sections blurred/teased
// =============================================================================

interface DemoSidebarProps {
  currentSection: number
  totalSections: number
  sectionNames?: string[]
  isGenerating: boolean
  projectName?: string
  onSignUp: () => void
  onOpenWitness?: () => void  // Witness is available in demo!
}

// Full site sections - Hero active, rest blurred
const SITE_SECTIONS = [
  { id: 'hero', name: 'Hero', available: true },
  { id: 'features', name: 'Features', available: false },
  { id: 'pricing', name: 'Pricing', available: false },
  { id: 'testimonials', name: 'Testimonials', available: false },
  { id: 'contact', name: 'Contact', available: false },
  { id: 'footer', name: 'Footer', available: false },
]

// Tools - only Witness available in demo
const FEATURES = [
  { id: 'witness', icon: Eye, name: 'Witness', desc: 'AI guide & helper', available: true },
  { id: 'genesis', icon: Plus, name: 'Genesis', desc: 'Add new section', available: false },
  { id: 'oracle', icon: MessageSquare, name: 'Oracle', desc: 'AI assistant', available: false },
  { id: 'architect', icon: Sparkles, name: 'Architect', desc: 'Prompt optimizer', available: false },
  { id: 'pages', icon: FileCode, name: 'Pages', desc: 'Multi-page sites', available: false },
  { id: 'deploy', icon: Rocket, name: 'Deploy', desc: 'Ship to web', available: false },
  { id: 'export', icon: Download, name: 'Export', desc: 'Download code', available: false },
  { id: 'auditor', icon: Shield, name: 'Auditor', desc: 'Quality check', available: false },
  { id: 'healer', icon: Zap, name: 'Healer', desc: 'Auto-fix errors', available: false },
  { id: 'replicator', icon: Globe, name: 'Replicator', desc: 'Clone any site', available: false },
]

export default function DemoSidebar({
  currentSection,
  totalSections,
  sectionNames,
  isGenerating,
  projectName = 'Demo Project',
  onSignUp,
  onOpenWitness,
}: DemoSidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('build')

  return (
    <div className="w-64 lg:w-72 flex flex-col h-full relative overflow-hidden">
      {/* Glass background */}
      <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.04),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-zinc-700/50 to-transparent" />
      
      <div className="relative flex-1 overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="px-4 py-4 border-b border-zinc-800/50">
          <Link href="/" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors mb-3">
            <Home className="w-3.5 h-3.5" />
            Exit Demo
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <Image src="/icon.svg" alt="HatchIt" width={20} height={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-amber-400/80">Sandbox Mode</p>
              <h2 className="text-sm font-medium text-white truncate">{projectName}</h2>
            </div>
          </div>
        </div>

        {/* Current Focus - Hero Section Highlighted */}
        <div className="px-4 py-3 border-b border-zinc-800/50">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Now Building</span>
            </div>
            <p className="text-white font-medium">Hero Section</p>
            <p className="text-[11px] text-zinc-400 mt-1">
              Your landing page&apos;s first impression
            </p>
          </div>
        </div>

        {/* Site Structure - Hero active, rest blurred */}
        <div className="px-4 py-3 border-b border-zinc-800/50">
          <button
            onClick={() => setExpandedSection(expandedSection === 'build' ? null : 'build')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-medium text-zinc-300">Full Site Preview</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${expandedSection === 'build' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {expandedSection === 'build' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-1.5">
                  {SITE_SECTIONS.map((section) => (
                    <div 
                      key={section.id} 
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-all ${
                        section.available 
                          ? 'bg-emerald-500/10 border border-emerald-500/20' 
                          : 'opacity-40 blur-[0.5px]'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        section.available 
                          ? 'bg-emerald-400 animate-pulse' 
                          : 'bg-zinc-700'
                      }`} />
                      <span className={`text-xs ${section.available ? 'text-white font-medium' : 'text-zinc-500'}`}>
                        {section.name}
                      </span>
                      {section.available && isGenerating && (
                        <span className="text-[10px] text-emerald-400 ml-auto">Building...</span>
                      )}
                      {!section.available && (
                        <Lock className="w-2.5 h-2.5 text-zinc-600 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-600 mt-3 text-center">
                  Sign up to build your complete site
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tools - Witness available, rest locked */}
        <div className="px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-3">Tools</p>
          <div className="space-y-1">
            {FEATURES.map((feature) => (
              <button
                key={feature.id}
                onClick={feature.available ? onOpenWitness : onSignUp}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
                  feature.available
                    ? 'bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/15 hover:border-emerald-500/40'
                    : 'bg-zinc-800/30 border border-zinc-800/50 hover:border-zinc-700 opacity-50'
                }`}
              >
                <div className={`p-1.5 rounded-md ${feature.available ? 'bg-emerald-500/20' : 'bg-zinc-900/80'}`}>
                  <feature.icon className={`w-3.5 h-3.5 ${feature.available ? 'text-emerald-400' : 'text-zinc-500'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className={`text-xs font-medium ${feature.available ? 'text-white' : 'text-zinc-400'}`}>
                    {feature.name}
                  </p>
                  <p className={`text-[10px] ${feature.available ? 'text-emerald-400/70' : 'text-zinc-600'}`}>
                    {feature.desc}
                  </p>
                </div>
                {feature.available ? (
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Lock className="w-3 h-3 text-zinc-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative p-4 border-t border-zinc-800/50">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
        
        <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-3 mb-3">
          <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
            Love what you&apos;re building? Sign up to unlock the full suite.
          </p>
        </div>
        
        <button
          onClick={onSignUp}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all"
        >
          <span className="text-sm font-semibold text-white">Sign Up Free</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>
      </div>
    </div>
  )
}
