'use client'

import { useState } from 'react'
import DesignPanel from '@/components/DesignPanel'
import { DesignTokens, defaultTokens } from '@/lib/tokens'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { 
  Plus, 
  Layers, 
  MessageSquare,
  Zap,
  ChevronRight,
  ChevronDown,
  Settings,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Trash2,
  Layout,
  Type,
  Image as ImageIcon,
  Quote,
  DollarSign,
  HelpCircle,
  Mail,
  BarChart3,
  Users,
  Briefcase,
  Menu as MenuIcon,
  Star,
  FileText,
  Globe
} from 'lucide-react'

// =============================================================================
// BUILDER SIDEBAR - Minimal, clean, uncluttered
// =============================================================================

type Tier = 'demo' | 'free' | 'architect' | 'visionary' | 'singularity'

const SECTION_TYPES = [
  { id: 'header', name: 'Header', icon: MenuIcon, pinned: 'top' },
  { id: 'hero', name: 'Hero', icon: Layout },
  { id: 'features', name: 'Features', icon: Star },
  { id: 'services', name: 'Services', icon: Briefcase },
  { id: 'about', name: 'About', icon: Users },
  { id: 'testimonials', name: 'Testimonials', icon: Quote },
  { id: 'pricing', name: 'Pricing', icon: DollarSign },
  { id: 'stats', name: 'Stats', icon: BarChart3 },
  { id: 'work', name: 'Portfolio', icon: ImageIcon },
  { id: 'faq', name: 'FAQ', icon: HelpCircle },
  { id: 'cta', name: 'CTA', icon: Zap },
  { id: 'contact', name: 'Contact', icon: Mail },
  { id: 'footer', name: 'Footer', icon: Type, pinned: 'bottom' },
] as const

export interface SitePage {
  id: string
  path: string
  name: string
  isActive?: boolean
}

interface SidebarProps {
  currentSection: number
  totalSections: number
  sectionNames?: string[]
  allSectionNames?: string[]
  sectionIds?: string[]
  completedSectionIds?: string[]
  isGenerating: boolean
  projectName?: string
  userTier: Tier
  isHealing?: boolean
  healingPaused?: boolean
  onToggleHealing?: () => void
  lastHealMessage?: string
  pages?: SitePage[]
  currentPageId?: string
  onSelectPage?: (pageId: string) => void
  onAddPage?: () => void
  onRenamePage?: (pageId: string, newName: string) => void
  onDeletePage?: (pageId: string) => void
  onOpenSettings?: () => void
  onAddSection?: () => void
  onAddSectionOfType?: (sectionType: string) => void
  onRemoveSection?: (index: number) => void
  onOpenHatch?: () => void
  onOpenReplicator?: () => void
  onRunAudit?: () => void
  onDeploy?: () => void
  onExport?: () => void
  onSelectSection?: (index: number) => void
  onMoveSection?: (fromIndex: number, toIndex: number) => void
  onUpgrade?: (requiredTier: Tier) => void
  onSignUp?: () => void
  designTokens?: DesignTokens
  onDesignTokensChange?: (tokens: DesignTokens) => void
}

const TIER_ORDER: Tier[] = ['demo', 'free', 'architect', 'visionary', 'singularity']

function canAccess(userTier: Tier, requiredTier: Tier): boolean {
  return TIER_ORDER.indexOf(userTier) >= TIER_ORDER.indexOf(requiredTier)
}

function getSectionIcon(sectionId: string) {
  const type = SECTION_TYPES.find(t => t.id === sectionId)
  return type?.icon || Layers
}

export default function LiveSidebar({
  currentSection,
  totalSections,
  sectionNames,
  allSectionNames,
  sectionIds,
  completedSectionIds = [],
  isGenerating,
  projectName = 'Untitled',
  userTier,
  isHealing,
  healingPaused,
  onToggleHealing,
  pages = [],
  currentPageId,
  onSelectPage,
  onAddPage,
  onRenamePage,
  onDeletePage,
  onOpenSettings,
  onAddSection,
  onAddSectionOfType,
  onRemoveSection,
  onOpenHatch,
  onSelectSection,
  onMoveSection,
  onUpgrade,
  onSignUp,
  designTokens,
  onDesignTokensChange,
}: SidebarProps) {
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [editingPageName, setEditingPageName] = useState('')
  const [pagesExpanded, setPagesExpanded] = useState(false)
  const isDemo = userTier === 'demo'

  const getSectionLabel = (index: number) => {
    const names = allSectionNames || sectionNames
    if (names && names[index]) {
      return names[index].replace(/Section/i, '').trim()
    }
    return `Section ${index + 1}`
  }

  const availableSectionTypes = SECTION_TYPES.filter(type => {
    if (!('pinned' in type)) return true
    return !sectionIds?.includes(type.id)
  })

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950">
      {/* Compact Header */}
      <div className="px-3 py-2 border-b border-zinc-800/40 flex items-center justify-between">
        <h2 className="text-xs font-medium text-white truncate">{projectName}</h2>
        <div className={`w-1.5 h-1.5 rounded-full ${isHealing ? 'bg-amber-400 animate-pulse' : isGenerating ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Pages - Collapsible */}
        {pages.length > 0 && (
          <div className="border-b border-zinc-800/40">
            <button
              onClick={() => setPagesExpanded(!pagesExpanded)}
              className="w-full px-3 py-2 flex items-center justify-between hover:bg-zinc-900/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Pages</span>
              </div>
              <ChevronDown className={`w-3 h-3 text-zinc-600 transition-transform ${pagesExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {pagesExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="px-2 pb-2 space-y-0.5">
                    {pages.map((page) => {
                      const isCurrentPage = page.id === currentPageId
                      const isEditing = editingPageId === page.id
                      const canDelete = pages.length > 1 && page.path !== '/'
                      
                      if (isEditing) {
                        return (
                          <div key={page.id} className="px-2 py-1">
                            <input
                              type="text"
                              value={editingPageName}
                              onChange={(e) => setEditingPageName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  onRenamePage?.(page.id, editingPageName)
                                  setEditingPageId(null)
                                } else if (e.key === 'Escape') {
                                  setEditingPageId(null)
                                }
                              }}
                              onBlur={() => {
                                if (editingPageName.trim()) {
                                  onRenamePage?.(page.id, editingPageName)
                                }
                                setEditingPageId(null)
                              }}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white outline-none focus:border-emerald-500"
                              autoFocus
                              placeholder="Page name"
                              aria-label="Page name"
                            />
                          </div>
                        )
                      }
                      
                      return (
                        <div key={page.id} className="group relative">
                          <button
                            onClick={() => onSelectPage?.(page.id)}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs ${
                              isCurrentPage 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : 'text-zinc-400 hover:bg-zinc-800/50'
                            }`}
                          >
                            <Globe className="w-3 h-3 flex-shrink-0" />
                            <span className="flex-1 truncate">{page.name}</span>
                            <span className="text-[9px] text-zinc-600 font-mono">{page.path}</span>
                          </button>
                          
                          {!isDemo && (
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingPageId(page.id)
                                  setEditingPageName(page.name)
                                }}
                                className="p-1 rounded hover:bg-zinc-700"
                                aria-label="Rename page"
                              >
                                <Type className="w-2.5 h-2.5 text-zinc-500" />
                              </button>
                              {canDelete && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDeletePage?.(page.id)
                                  }}
                                  className="p-1 rounded hover:bg-red-500/20"
                                  aria-label="Delete page"
                                >
                                  <Trash2 className="w-2.5 h-2.5 text-zinc-500 hover:text-red-400" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                    
                    {/* Add Page */}
                    {!isDemo && (
                      <button
                        onClick={onAddPage}
                        className="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add Page
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Sections */}
        <div className="px-2 py-2">
          <div className="px-1 pb-1.5 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">Sections</span>
            <span className="text-[10px] text-zinc-600">{completedSectionIds.length}/{totalSections}</span>
          </div>
          
          <LayoutGroup>
            <div className="space-y-0.5">
              {Array.from({ length: allSectionNames?.length || totalSections }).map((_, i) => {
                const isActive = i === currentSection - 1
                const id = sectionIds?.[i]
                const isBuilt = id ? completedSectionIds.includes(id) : false
                // Allow clicking any section - users should navigate freely
                const isClickable = true
                const SectionIcon = getSectionIcon(id || '')
                const isBuilding = isActive && isGenerating

                const isHeader = id === 'header'
                const isFooter = id === 'footer'
                const wouldSwapWithHeader = sectionIds?.[i - 1] === 'header'
                const wouldSwapWithFooter = sectionIds?.[i + 1] === 'footer'

                const canMoveUp = i > 0 && !isHeader && !isFooter && !wouldSwapWithHeader && isBuilt
                const canMoveDown = i < (totalSections - 1) && !isHeader && !isFooter && !wouldSwapWithFooter && isBuilt
                const canRemove = !isHeader && !isFooter && onRemoveSection && isBuilt
                
                return (
                  <motion.div 
                    key={id || i} 
                    layout
                    layoutId={id || `section-${i}`}
                    className="group relative"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <button
                      onClick={() => isClickable && onSelectSection?.(i)}
                      disabled={!isClickable}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs ${
                        isActive 
                          ? 'bg-zinc-800 text-white' 
                          : isBuilt
                            ? 'text-zinc-400 hover:bg-zinc-800/50'
                            : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isBuilding ? 'bg-amber-400 animate-pulse' : isBuilt ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`} />
                      <SectionIcon className="w-3 h-3 flex-shrink-0" />
                      <span className="flex-1 truncate">{getSectionLabel(i)}</span>
                      {isBuilt && !isActive && <Check className="w-3 h-3 text-emerald-500/60" />}
                    </button>

                    {/* Actions on hover */}
                    {(canMoveUp || canMoveDown || canRemove) && (
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/90 rounded px-0.5">
                        {canMoveUp && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onMoveSection?.(i, i - 1) }}
                            className="p-0.5 rounded hover:bg-zinc-700"
                            aria-label="Move section up"
                          >
                            <ArrowUp className="w-2.5 h-2.5 text-zinc-500" />
                          </button>
                        )}
                        {canMoveDown && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onMoveSection?.(i, i + 1) }}
                            className="p-0.5 rounded hover:bg-zinc-700"
                            aria-label="Move section down"
                          >
                            <ArrowDown className="w-2.5 h-2.5 text-zinc-500" />
                          </button>
                        )}
                        {canRemove && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onRemoveSection?.(i) }}
                            className="p-0.5 rounded hover:bg-red-500/20"
                            aria-label="Remove section"
                          >
                            <Trash2 className="w-2.5 h-2.5 text-zinc-500 hover:text-red-400" />
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </LayoutGroup>
          
          {/* Add Section */}
          {!isDemo && (
            <div className="relative mt-1.5">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs text-emerald-400 hover:bg-emerald-500/10 border border-dashed border-zinc-800 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Section
              </button>

              <AnimatePresence>
                {showAddMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute left-0 right-0 bottom-full mb-1 bg-zinc-900 border border-zinc-800 rounded shadow-xl z-50"
                    >
                      <div className="p-1 grid grid-cols-2 gap-0.5 max-h-40 overflow-y-auto">
                        {availableSectionTypes.map((type) => {
                          const Icon = type.icon
                          return (
                            <button
                              key={type.id}
                              onClick={() => {
                                onAddSectionOfType ? onAddSectionOfType(type.id) : onAddSection?.()
                                setShowAddMenu(false)
                              }}
                              className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            >
                              <Icon className="w-2.5 h-2.5" />
                              {type.name}
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* AI Help - Minimal */}
        <div className="px-2 py-2 border-t border-zinc-800/40">
          <button
            onClick={() => {
              if (isDemo && onSignUp) {
                onSignUp()
              } else {
                onOpenHatch?.()
              }
            }}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-zinc-400 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
          >
            <MessageSquare className="w-3 h-3" />
            AI Help
            <ChevronRight className="w-3 h-3 ml-auto" />
          </button>
          
          {/* Auto-fix indicator */}
          {(userTier === 'visionary' || userTier === 'singularity') && (
            <button
              onClick={onToggleHealing}
              className="mt-1 px-2 py-1 flex items-center gap-1.5 w-full rounded hover:bg-zinc-800/50 transition-colors"
              title={healingPaused ? 'Click to resume auto-healing' : 'Click to pause auto-healing'}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${healingPaused ? 'bg-amber-500' : 'bg-emerald-400 animate-pulse'}`} />
              <span className={`text-[9px] ${healingPaused ? 'text-amber-400/80' : 'text-emerald-400/60'}`}>
                {healingPaused ? 'Auto-fix paused (click to resume)' : 'Auto-fix active'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Design Controls */}
      <DesignPanel
        tokens={designTokens || defaultTokens}
        onChange={(tokens) => onDesignTokensChange?.(tokens)}
        isLocked={userTier === 'demo' || userTier === 'free'}
        onUpgrade={() => onUpgrade?.('visionary')}
      />

      {/* Footer */}
      <div className="p-2 border-t border-zinc-800/40">
        {isDemo && onSignUp ? (
          <button
            onClick={onSignUp}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-medium transition-colors"
          >
            Sign Up Free
            <ArrowRight className="w-3 h-3" />
          </button>
        ) : onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 transition-colors"
          >
            <Settings className="w-3 h-3" />
            Settings
          </button>
        )}
      </div>
    </div>
  )
}
