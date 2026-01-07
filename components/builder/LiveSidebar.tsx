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
  ChevronDown,
  ChevronRight,
  FileCode,
  Settings,
  Check,
  Crown,
  Star,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// =============================================================================
// SIDEBAR - ONE layout for both demo and live modes
// Demo mode: tier='demo', features locked, sign-up CTAs
// Live mode: tier based on subscription, features unlock progressively
// =============================================================================

type Tier = 'demo' | 'free' | 'architect' | 'visionary' | 'singularity'

interface SidebarProps {
  currentSection: number
  totalSections: number
  sectionNames?: string[]
  allSectionNames?: string[]
  isGenerating: boolean
  projectName?: string
  userTier: Tier
  // Status indicators
  isHealing?: boolean
  lastHealMessage?: string
  // Feature callbacks
  onOpenSettings?: () => void
  onAddSection?: () => void
  onOpenOracle?: () => void
  onOpenWitness?: () => void
  onOpenArchitect?: () => void
  onOpenReplicator?: () => void
  onRunAudit?: () => void
  onDeploy?: () => void
  onExport?: () => void
  onAddPage?: () => void
  onSelectSection?: (index: number) => void
  onUpgrade?: (requiredTier: Tier) => void
  onSignUp?: () => void  // For demo mode - redirect to sign up
}

// Singularity-branded feature names with tier requirements
// Healer is NOT a clickable tool - it runs automatically in background
const FEATURES: Array<{
  id: string
  icon: typeof Plus
  name: string
  desc: string
  tier: Tier
  action: keyof SidebarProps
}> = [
  { id: 'genesis', icon: Plus, name: 'Genesis', desc: 'Add new section', tier: 'free', action: 'onAddSection' },
  { id: 'oracle', icon: MessageSquare, name: 'Oracle', desc: 'AI assistant', tier: 'free', action: 'onOpenOracle' },
  { id: 'witness', icon: Eye, name: 'Witness', desc: 'AI observations', tier: 'free', action: 'onOpenWitness' },
  { id: 'architect', icon: Sparkles, name: 'Architect', desc: 'Prompt optimizer', tier: 'free', action: 'onOpenArchitect' },
  { id: 'pages', icon: FileCode, name: 'Pages', desc: 'Multi-page sites', tier: 'architect', action: 'onAddPage' },
  { id: 'deploy', icon: Rocket, name: 'Deploy', desc: 'Ship to web', tier: 'architect', action: 'onDeploy' },
  { id: 'export', icon: Download, name: 'Export', desc: 'Download code', tier: 'architect', action: 'onExport' },
  { id: 'auditor', icon: Shield, name: 'Auditor', desc: 'Quality check', tier: 'visionary', action: 'onRunAudit' },
  { id: 'replicator', icon: Globe, name: 'Replicator', desc: 'Clone any site', tier: 'singularity', action: 'onOpenReplicator' },
]

// Demo is below free - nothing unlocked except witness
const TIER_ORDER: Tier[] = ['demo', 'free', 'architect', 'visionary', 'singularity']

const TIER_CONFIG: Record<Tier, { name: string; color: string; icon: typeof Star }> = {
  demo: { name: 'Sandbox', color: 'text-amber-400', icon: Star },
  free: { name: 'Free', color: 'text-zinc-400', icon: Star },
  architect: { name: 'Architect', color: 'text-emerald-400', icon: Star },
  visionary: { name: 'Visionary', color: 'text-violet-400', icon: Crown },
  singularity: { name: 'Singularity', color: 'text-amber-400', icon: Crown },
}

function canAccess(userTier: Tier, requiredTier: Tier): boolean {
  return TIER_ORDER.indexOf(userTier) >= TIER_ORDER.indexOf(requiredTier)
}

export default function LiveSidebar({
  currentSection,
  totalSections,
  sectionNames,
  allSectionNames,
  isGenerating,
  projectName = 'Untitled Project',
  userTier,
  isHealing,
  lastHealMessage,
  onOpenSettings,
  onAddSection,
  onOpenOracle,
  onOpenWitness,
  onOpenArchitect,
  onOpenReplicator,
  onRunAudit,
  onDeploy,
  onExport,
  onAddPage,
  onSelectSection,
  onUpgrade,
  onSignUp,
}: SidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('build')
  const isDemo = userTier === 'demo'

  const tierConfig = TIER_CONFIG[userTier]
  const TierIcon = tierConfig.icon
  const [showHealerInfo, setShowHealerInfo] = useState(false)

  const getSectionLabel = (index: number) => {
    const names = allSectionNames || sectionNames
    if (names && names[index]) {
      return names[index].replace(/Section/i, '').trim()
    }
    return `Section ${index + 1}`
  }

  const handleFeatureClick = (feature: typeof FEATURES[0]) => {
    // Demo users go to sign up for locked features
    if (!canAccess(userTier, feature.tier)) {
      if (isDemo && onSignUp) {
        onSignUp()
      } else {
        onUpgrade?.(feature.tier)
      }
      return
    }
    
    const callbacks: Record<string, (() => void) | undefined> = {
      onAddSection,
      onOpenOracle,
      onOpenWitness,
      onOpenArchitect,
      onOpenReplicator,
      onRunAudit,
      onDeploy,
      onExport,
      onAddPage,
    }
    
    callbacks[feature.action]?.()
  }

  // Group features by access level
  const unlockedFeatures = FEATURES.filter(f => canAccess(userTier, f.tier))
  const lockedFeatures = FEATURES.filter(f => !canAccess(userTier, f.tier))

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
          <Link href={isDemo ? "/" : "/dashboard"} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors mb-3">
            <Home className="w-3.5 h-3.5" />
            {isDemo ? 'Exit Demo' : 'Dashboard'}
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <Image src="/icon.svg" alt="HatchIt" width={20} height={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <TierIcon className={`w-3 h-3 ${tierConfig.color}`} />
                <p className={`text-[10px] uppercase tracking-wider ${tierConfig.color}`}>{tierConfig.name}</p>
              </div>
              <h2 className="text-sm font-medium text-white truncate">{projectName}</h2>
            </div>
          </div>
        </div>

        {/* System Status - Healer (click for info) */}
        <div className="px-4 py-2 border-b border-zinc-800/50">
          <button 
            onClick={() => setShowHealerInfo(!showHealerInfo)}
            className="w-full flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className={`w-2 h-2 rounded-full ${isHealing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            <Zap className={`w-3 h-3 ${isHealing ? 'text-amber-400' : 'text-zinc-600'}`} />
            <span className="text-[10px] uppercase tracking-wider text-zinc-600">Healer</span>
            {isHealing && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1 ml-auto"
              >
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                <span className="text-[10px] text-amber-400">Fixing...</span>
              </motion.div>
            )}
            {!isHealing && lastHealMessage && (
              <span className="text-[10px] text-emerald-400/70 ml-auto truncate max-w-[120px]">
                ✓ Fixed
              </span>
            )}
            {!isHealing && !lastHealMessage && (
              <span className="text-[10px] text-zinc-600 ml-auto">Ready</span>
            )}
          </button>
          
          {/* Healer Info Panel */}
          <AnimatePresence>
            {showHealerInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 p-2.5 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    {isHealing ? (
                      <>Healer detected an issue and is automatically fixing it. No action needed.</>
                    ) : lastHealMessage ? (
                      <>Last fix: {lastHealMessage}</>
                    ) : (
                      <>Healer monitors your builds for errors and automatically fixes them. It runs in the background - you don&apos;t need to do anything.</>
                    )}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isHealing ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500">
                      {isHealing ? 'Working' : 'Standby'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Build Timeline */}
        <div className="px-4 py-3 border-b border-zinc-800/50">
          <button
            onClick={() => setExpandedSection(expandedSection === 'build' ? null : 'build')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-zinc-200">Sections</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500">{currentSection}/{totalSections}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${expandedSection === 'build' ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          <AnimatePresence>
            {expandedSection === 'build' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-1">
                  {Array.from({ length: allSectionNames?.length || totalSections }).map((_, i) => {
                    const isActive = i === currentSection - 1
                    const isCompleted = i < currentSection - 1
                    const isClickable = isCompleted || isActive
                    
                    return (
                      <button
                        key={i}
                        onClick={() => isClickable && onSelectSection?.(i)}
                        disabled={!isClickable}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all ${
                          isActive 
                            ? 'bg-emerald-500/10 border border-emerald-500/20' 
                            : isClickable 
                              ? 'hover:bg-zinc-800/50 cursor-pointer' 
                              : 'opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          isCompleted ? 'bg-emerald-500' : isActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-700'
                        }`} />
                        <span className={`text-xs truncate ${isActive ? 'text-white font-medium' : 'text-zinc-400'}`}>
                          {getSectionLabel(i)}
                        </span>
                        {isCompleted && <Check className="w-3 h-3 text-emerald-500 ml-auto flex-shrink-0" />}
                        {isActive && isGenerating && (
                          <span className="text-[10px] text-emerald-400 ml-auto flex-shrink-0">Building...</span>
                        )}
                      </button>
                    )
                  })}
                  
                  {/* Add Section Button */}
                  <button
                    onClick={() => handleFeatureClick(FEATURES[0])}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md border border-dashed border-zinc-700 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all mt-2"
                  >
                    <Plus className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs text-zinc-500">Add section</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Unlocked Features */}
        <div className="px-4 py-3 border-b border-zinc-800/50">
          <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">Tools</p>
          <div className="space-y-1">
            {unlockedFeatures.slice(1).map((feature) => ( // Skip Genesis, it's in timeline
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(feature)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-800/50 transition-all group"
              >
                <div className="p-1.5 rounded-md bg-zinc-800/80 group-hover:bg-emerald-500/10 transition-colors">
                  <feature.icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{feature.name}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Locked Features */}
        {lockedFeatures.length > 0 && (
          <div className="px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">Upgrade to Unlock</p>
            <div className="space-y-1">
              {lockedFeatures.map((feature) => {
                const requiredTierConfig = TIER_CONFIG[feature.tier]
                return (
                  <button
                    key={feature.id}
                    onClick={() => onUpgrade?.(feature.tier)}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg bg-zinc-800/20 border border-zinc-800/30 hover:border-zinc-700 transition-all group opacity-60 hover:opacity-80"
                  >
                    <div className="p-1.5 rounded-md bg-zinc-900/80">
                      <feature.icon className="w-3.5 h-3.5 text-zinc-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-medium text-zinc-500">{feature.name}</p>
                      <p className={`text-[10px] ${requiredTierConfig.color}`}>{requiredTierConfig.name}</p>
                    </div>
                    <Lock className="w-3 h-3 text-zinc-600" />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom - Settings or Sign Up CTA */}
      <div className="relative p-4 border-t border-zinc-800/50">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
        
        {isDemo && onSignUp ? (
          <button
            onClick={onSignUp}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-all"
          >
            <span className="text-sm font-semibold text-black">Sign Up Free</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        ) : onOpenSettings ? (
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 transition-all"
          >
            <div className="p-1.5 rounded-lg bg-zinc-800/80">
              <Settings className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-xs font-medium text-zinc-300">Project Settings</span>
              <p className="text-[10px] text-zinc-500">SEO, brand, integrations</p>
            </div>
          </button>
        ) : null}
      </div>
    </div>
  )
}
