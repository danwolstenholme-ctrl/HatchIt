'use client'

import { motion } from 'framer-motion'
import { Section, Template, BuildState } from '@/lib/templates'

interface SectionProgressProps {
  template: Template
  buildState: BuildState
  onSectionClick?: (sectionIndex: number) => void
  onSkip?: () => void
}

export default function SectionProgress({
  template,
  buildState,
  onSectionClick,
  onSkip,
}: SectionProgressProps) {
  const { currentSectionIndex, completedSections, skippedSections, sectionRefined, sectionChanges } = buildState
  const sections = template.sections
  const currentSection = sections[currentSectionIndex]

  // Calculate progress
  const totalSections = sections.length
  const doneCount = completedSections.length + skippedSections.length
  const progressPercent = Math.round((doneCount / totalSections) * 100)

  return (
    <div className="w-full bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800">
      {/* Progress Bar */}
      <div className="h-1 bg-zinc-800">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Section Navigation */}
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left: Current Section Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{template.icon}</span>
            <span className="text-sm text-zinc-500">{template.name}</span>
          </div>
          
          <div className="h-4 w-px bg-zinc-700" />
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">
              {currentSectionIndex + 1}/{totalSections}
            </span>
            <span className="text-sm text-zinc-400">
              {currentSection?.name || 'Complete'}
            </span>
          </div>
        </div>

        {/* Center: Section Dots */}
        <div className="hidden md:flex items-center gap-2">
          {sections.map((section, index) => {
            const isCompleted = completedSections.includes(section.id)
            const isSkipped = skippedSections.includes(section.id)
            const isCurrent = index === currentSectionIndex
            const isRefined = sectionRefined[section.id]
            const changes = sectionChanges[section.id]

            return (
              <div key={section.id} className="relative group">
                <motion.button
                  onClick={() => onSectionClick?.(index)}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                    transition-all duration-200
                    ${isCurrent
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-900'
                      : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : isSkipped
                          ? 'bg-zinc-700 text-zinc-500'
                          : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted ? (
                    <span className="flex items-center">
                      ✓
                      {isRefined && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full"
                        />
                      )}
                    </span>
                  ) : isSkipped ? (
                    '–'
                  ) : (
                    index + 1
                  )}
                </motion.button>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm whitespace-nowrap shadow-xl">
                    <div className="font-medium text-white">{section.name}</div>
                    {section.required && (
                      <div className="text-xs text-amber-400">Required</div>
                    )}
                    {isCompleted && isRefined && changes && changes.length > 0 && (
                      <div className="mt-1 pt-1 border-t border-zinc-700">
                        <div className="text-xs text-violet-400 flex items-center gap-1">
                          ✓ Polished
                        </div>
                        <ul className="text-xs text-zinc-400 mt-1 space-y-0.5">
                          {changes.slice(0, 3).map((change, i) => (
                            <li key={i}>• {change}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-800" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Right: Skip Button (for optional sections) */}
        <div className="flex items-center gap-3">
          {currentSection && !currentSection.required && (
            <motion.button
              onClick={onSkip}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-800"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Skip section →
            </motion.button>
          )}
          
          <div className="text-sm text-zinc-500">
            {progressPercent}% complete
          </div>
        </div>
      </div>

      {/* Current Section Description */}
      {currentSection && (
        <motion.div
          key={currentSection.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-3 -mt-1"
        >
          <p className="text-sm text-zinc-400">
            {currentSection.description}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            ⏱ {currentSection.estimatedTime}
          </p>
        </motion.div>
      )}
    </div>
  )
}

// =============================================================================
// SECTION COMPLETE INDICATOR
// Shows when a section is complete, with Opus refinement status
// =============================================================================
interface SectionCompleteIndicatorProps {
  sectionName: string
  wasRefined: boolean
  changes?: string[]
}

export function SectionCompleteIndicator({
  sectionName,
  wasRefined,
  changes = [],
}: SectionCompleteIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 bg-zinc-800/50 rounded-lg px-4 py-3 border border-zinc-700"
    >
      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <span className="text-emerald-400">✓</span>
      </div>
      
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{sectionName} complete</div>
        
        {wasRefined ? (
          <div className="group relative inline-block">
            <span className="text-xs text-violet-400 flex items-center gap-1 cursor-help">
              ✓ Polished
              {changes.length > 0 && (
                <span className="text-zinc-500">({changes.length} improvements)</span>
              )}
            </span>
            
            {/* Tooltip with changes */}
            {changes.length > 0 && (
              <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl">
                  <div className="font-medium text-violet-400 mb-1">Opus improvements:</div>
                  <ul className="text-zinc-300 space-y-0.5">
                    {changes.map((change, i) => (
                      <li key={i}>• {change}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-zinc-500">Code was already good ✨</span>
        )}
      </div>
    </motion.div>
  )
}

// =============================================================================
// MOBILE SECTION DRAWER (for smaller screens)
// =============================================================================
interface MobileSectionDrawerProps {
  isOpen: boolean
  onClose: () => void
  template: Template
  buildState: BuildState
  onSectionClick: (sectionIndex: number) => void
}

export function MobileSectionDrawer({
  isOpen,
  onClose,
  template,
  buildState,
  onSectionClick,
}: MobileSectionDrawerProps) {
  const { completedSections, skippedSections, currentSectionIndex, sectionRefined, sectionChanges } = buildState

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 md:hidden"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="absolute bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 rounded-t-2xl max-h-[70vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{template.icon}</span>
            <span className="font-medium text-white">{template.name} Sections</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 space-y-2">
          {template.sections.map((section, index) => {
            const isCompleted = completedSections.includes(section.id)
            const isSkipped = skippedSections.includes(section.id)
            const isCurrent = index === currentSectionIndex
            const isRefined = sectionRefined[section.id]

            return (
              <button
                key={section.id}
                onClick={() => {
                  onSectionClick(index)
                  onClose()
                }}
                className={`
                  w-full text-left p-3 rounded-lg transition-all
                  ${isCurrent
                    ? 'bg-emerald-500/20 border border-emerald-500/50'
                    : 'bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs
                      ${isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isSkipped
                          ? 'bg-zinc-700 text-zinc-500'
                          : 'bg-zinc-700 text-zinc-400'
                      }
                    `}>
                      {isCompleted ? '✓' : isSkipped ? '–' : index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-white">{section.name}</div>
                      <div className="text-xs text-zinc-500">{section.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {section.required && (
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                        Required
                      </span>
                    )}
                    {isRefined && (
                      <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded">
                        Polished
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
