'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { templates, Template, Section } from '@/lib/templates'

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template, customizedSections?: Section[]) => void
}

export default function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [editingSections, setEditingSections] = useState<Section[]>([])
  const [showSectionEditor, setShowSectionEditor] = useState(false)

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template)
    setEditingSections([...template.sections])
    setShowSectionEditor(true)
  }

  const handleStartBuilding = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate, editingSections)
    }
  }

  const handleBack = () => {
    setShowSectionEditor(false)
    setSelectedTemplate(null)
  }

  const toggleSection = (sectionId: string) => {
    const section = editingSections.find(s => s.id === sectionId)
    if (section?.required) return // Can't toggle required sections

    setEditingSections(prev => 
      prev.map(s => 
        s.id === sectionId 
          ? { ...s, required: !s.required } // Toggle included state via required field temporarily
          : s
      )
    )
  }

  const reorderSection = (sectionId: string, direction: 'up' | 'down') => {
    const index = editingSections.findIndex(s => s.id === sectionId)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === editingSections.length - 1)
    ) return

    const newSections = [...editingSections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]
    
    // Update order numbers
    newSections.forEach((s, i) => s.order = i + 1)
    setEditingSections(newSections)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!showSectionEditor ? (
          // Template Grid
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl"
          >
            <div className="text-center mb-8">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold text-white mb-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                What are you building?
              </motion.h1>
              <motion.p 
                className="text-zinc-400 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Choose a template to get started. You can customize sections next.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template, index) => (
                <motion.button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative text-left p-6 rounded-2xl border transition-all duration-200
                    ${template.isAdvanced
                      ? 'bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/30 hover:border-violet-500/50'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'
                    }
                  `}
                >
                  {/* Advanced badge */}
                  {template.isAdvanced && (
                    <div className="absolute top-3 right-3 text-xs bg-violet-500/20 text-violet-400 px-2 py-1 rounded-full">
                      Advanced
                    </div>
                  )}

                  {/* Icon */}
                  <div className="text-4xl mb-4">{template.icon}</div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {template.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-zinc-400 mb-4">
                    {template.description}
                  </p>

                  {/* Section count */}
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      {template.sections.filter(s => s.required).length} required
                    </span>
                    {template.sections.filter(s => !s.required).length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-zinc-500 rounded-full" />
                        {template.sections.filter(s => !s.required).length} optional
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Three-model callout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-2 text-sm">
                <span className="text-emerald-400">⚡ Sonnet builds</span>
                <span className="text-zinc-600">→</span>
                <span className="text-violet-400">✨ Opus refines</span>
                <span className="text-zinc-600">→</span>
                <span className="text-blue-400">🔍 Gemini audits</span>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Section Editor
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleBack}
                className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                ←
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedTemplate?.icon}</span>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedTemplate?.name}
                  </h2>
                </div>
                <p className="text-sm text-zinc-400">
                  Customize your sections below
                </p>
              </div>
            </div>

            {/* Section List */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
              {editingSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  layout
                  className={`
                    flex items-center gap-4 p-4 border-b border-zinc-800 last:border-b-0
                    ${section.required ? 'bg-zinc-800/30' : 'bg-transparent'}
                  `}
                >
                  {/* Order controls */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => reorderSection(section.id, 'up')}
                      disabled={index === 0}
                      className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => reorderSection(section.id, 'down')}
                      disabled={index === editingSections.length - 1}
                      className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Section number */}
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium text-zinc-400">
                    {index + 1}
                  </div>

                  {/* Section info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{section.name}</span>
                      {section.required && (
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {section.description}
                    </p>
                  </div>

                  {/* Toggle (for optional sections) */}
                  {!section.required && (
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="text-sm text-zinc-400 hover:text-white px-3 py-1 rounded hover:bg-zinc-800 transition-colors"
                    >
                      Skip
                    </button>
                  )}

                  {/* Time estimate */}
                  <div className="text-xs text-zinc-600">
                    {section.estimatedTime}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Estimated total time */}
            <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
              <span>
                {editingSections.length} sections
              </span>
              <span>
                Estimated: ~{Math.ceil(editingSections.length * 0.5)} minutes
              </span>
            </div>

            {/* Start Building Button */}
            <motion.button
              onClick={handleStartBuilding}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-shadow"
            >
              Start Building →
            </motion.button>

            {/* What happens next */}
            <div className="mt-6 p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
              <h4 className="text-sm font-medium text-zinc-300 mb-2">How it works:</h4>
              <ul className="text-xs text-zinc-500 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">1.</span>
                  Describe each section → Sonnet 4.5 generates the code
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">2.</span>
                  Opus 4.5 auto-refines (silent if perfect, shows changes if polished)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">3.</span>
                  Optional: Gemini 2.5 Pro runs a final audit for accessibility & performance
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// =============================================================================
// BUILD COMPLETE UI
// Shown when all sections are done
// =============================================================================
interface BuildCompleteProps {
  onDeploy: () => void
  onRunAudit: () => void
  isAuditRunning?: boolean
  auditComplete?: boolean
  auditChanges?: string[] | null
}

export function BuildComplete({
  onDeploy,
  onRunAudit,
  isAuditRunning = false,
  auditComplete = false,
  auditChanges = null,
}: BuildCompleteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.1 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center"
      >
        <span className="text-4xl">✅</span>
      </motion.div>

      <h2 className="text-2xl font-bold text-white mb-2">
        All sections complete!
      </h2>
      <p className="text-zinc-400 mb-8">
        Your site is ready to deploy
      </p>

      {/* Audit result (if run) */}
      {auditComplete && auditChanges && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-left"
        >
          <div className="flex items-center gap-2 text-blue-400 font-medium mb-2">
            <span>🔍</span>
            <span>Gemini Audit Complete</span>
          </div>
          {auditChanges.length > 0 ? (
            <ul className="text-sm text-zinc-300 space-y-1">
              {auditChanges.map((change, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-400">✓</span>
                  {change}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-400">No issues found. Your code passed the audit! ✨</p>
          )}
        </motion.div>
      )}

      {/* Deploy Button */}
      <motion.button
        onClick={onDeploy}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-shadow"
      >
        Deploy Now 🚀
      </motion.button>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-zinc-600 text-sm">or</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Audit Button */}
      {!auditComplete && (
        <motion.button
          onClick={onRunAudit}
          disabled={isAuditRunning}
          whileHover={{ scale: isAuditRunning ? 1 : 1.02 }}
          whileTap={{ scale: isAuditRunning ? 1 : 0.98 }}
          className={`
            w-full py-4 rounded-xl border transition-all
            ${isAuditRunning
              ? 'bg-zinc-800 border-zinc-700 text-zinc-400 cursor-wait'
              : 'bg-zinc-900 border-zinc-700 text-white hover:border-blue-500/50 hover:bg-blue-500/10'
            }
          `}
        >
          {isAuditRunning ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                🔍
              </motion.span>
              Running audit...
            </span>
          ) : (
            <span className="flex flex-col items-center">
              <span className="flex items-center gap-2 font-semibold">
                <span>🔍</span>
                Run final audit
              </span>
              <span className="text-xs text-zinc-500 mt-1">
                A different AI checks accessibility, performance, and consistency
              </span>
            </span>
          )}
        </motion.button>
      )}
    </motion.div>
  )
}
