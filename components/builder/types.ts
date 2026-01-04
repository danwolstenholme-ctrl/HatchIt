// =============================================================================
// BUILDER TYPES
// Consolidated type definitions for the builder module
// =============================================================================

import { Template, Section, BuildState } from '@/lib/templates'
import { DbProject, DbSection, DbBrandConfig } from '@/lib/supabase'
import { AccountSubscription } from '@/types/subscriptions'

// Build phases
export type BuildPhase = 'initializing' | 'building' | 'review'

// Device view options
export type DeviceView = 'mobile' | 'tablet' | 'desktop'

// Mobile tab options
export type MobileTab = 'input' | 'preview'
export type ReviewMobileTab = 'modules' | 'preview'

// Hatch modal reasons
export type HatchModalReason = 
  | 'generation_limit' 
  | 'code_access' 
  | 'deploy' 
  | 'download' 
  | 'proactive' 
  | 'running_low' 
  | 'guest_lock'

// Paywall reasons
export type PaywallReason = 'limit_reached' | 'site_complete'

// Tier configuration for UI
export interface TierConfig {
  name: string
  color: string
  gradient: string
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  projectLimit: number
}

// Builder props
export interface BuildFlowControllerProps {
  existingProjectId?: string
  demoMode?: boolean
  initialPrompt?: string
  guestMode?: boolean
}

// Section with code for preview
export interface PreviewSection {
  id: string
  code: string
}

// SEO settings
export interface SEOSettings {
  title: string
  description: string
  keywords: string
}

// Builder state (internal)
export interface BuilderInternalState {
  // Phase
  phase: BuildPhase
  
  // Template/sections
  selectedTemplate: Template
  customizedSections: Section[]
  
  // Project data
  project: DbProject | null
  dbSections: DbSection[]
  brandConfig: DbBrandConfig | null
  buildState: BuildState | null
  
  // UI state
  reviewDeviceView: DeviceView
  reviewMobileTab: ReviewMobileTab
  
  // Modals
  showHatchModal: boolean
  hatchModalReason: HatchModalReason
  showPaywallTransition: boolean
  paywallReason: PaywallReason
  showScorecard: boolean
  showWitness: boolean
  showSignupGate: boolean
  isSettingsOpen: boolean
  
  // Loading/error
  isLoading: boolean
  error: string | null
  
  // Guest mode
  demoMode: boolean
  guestInteractionCount: number
  
  // Deploy
  isDeploying: boolean
  deployedUrl: string | null
  
  // Audit
  isAuditRunning: boolean
  
  // Witness
  witnessNote: string
  isWitnessLoading: boolean
}

// Full site preview props
export interface FullSitePreviewProps {
  sections: PreviewSection[]
  deviceView: DeviceView
  seo?: SEOSettings
}

// Section builder props
export interface SectionBuilderProps {
  section: Section
  dbSection: DbSection
  projectId: string
  onComplete: (code: string) => void
  onNextSection: () => void
  isLastSection: boolean
  allSectionsCode: Record<string, string>
  demoMode?: boolean
  brandConfig?: DbBrandConfig | null
  isPaid: boolean
}

// Review header props
export interface ReviewHeaderProps {
  project: DbProject | null
  tierConfig: TierConfig | null
  deployedUrl: string | null
  isDeploying: boolean
  assembledCode: string
  error: string | null
  onGoHome: () => void
  onStartFresh: () => void
  onDownload: () => void
  onDeploy: () => void
}

// Section list props
export interface SectionListProps {
  sections: Section[]
  buildState: BuildState
  isPaidUser: boolean
  tierConfig: TierConfig | null
  accountSubscription: AccountSubscription | null
  isAuditRunning: boolean
  onSectionClick: (sectionId: string) => void
  onDirectCheckout: (tier: string) => void
  onRunAudit: () => void
}

// Device toggle props
export interface DeviceToggleProps {
  currentDevice: DeviceView
  onDeviceChange: (device: DeviceView) => void
}
