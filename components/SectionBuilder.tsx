'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from '@/lib/templates'
import { DbSection } from '@/lib/supabase'
import { SectionCompleteIndicator } from './SectionProgress'
import SectionPreview from './SectionPreview'

// =============================================================================
// SECTION BUILDER
// The actual interface for building one section at a time
// =============================================================================

interface SectionBuilderProps {
  section: Section
  dbSection: DbSection
  projectId: string
  onComplete: (code: string, refined: boolean, refinementChanges?: string[]) => void
  allSectionsCode: Record<string, string> // For preview context
  demoMode?: boolean // Local testing without API
}

type BuildStage = 'input' | 'generating' | 'refining' | 'complete'

// Demo mode mock code generator
const generateMockCode = (sectionType: string, sectionName: string, userPrompt: string): string => {
  return `{/* ${sectionName} Section */}
<section className="py-20 px-6 bg-zinc-950">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
      ${sectionName}
    </h2>
    <p className="text-xl text-zinc-400 max-w-2xl">
      ${userPrompt.slice(0, 200)}${userPrompt.length > 200 ? '...' : ''}
    </p>
    <div className="mt-10 grid md:grid-cols-3 gap-6">
      <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
          <span className="text-2xl">✨</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Feature One</h3>
        <p className="text-zinc-400 text-sm">Demo content for ${sectionType}</p>
      </div>
      <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
        <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4">
          <span className="text-2xl">🚀</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Feature Two</h3>
        <p className="text-zinc-400 text-sm">Placeholder for your content</p>
      </div>
      <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
          <span className="text-2xl">💡</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Feature Three</h3>
        <p className="text-zinc-400 text-sm">AI will generate real content</p>
      </div>
    </div>
  </div>
</section>`
}

export default function SectionBuilder({
  section,
  dbSection,
  projectId,
  onComplete,
  allSectionsCode,
  demoMode = false,
}: SectionBuilderProps) {
  const [prompt, setPrompt] = useState(dbSection.user_prompt || '')
  const [stage, setStage] = useState<BuildStage>(
    dbSection.status === 'complete' ? 'complete' : 'input'
  )
  const [generatedCode, setGeneratedCode] = useState(dbSection.code || '')
  const [refined, setRefined] = useState(dbSection.refined)
  const [refinementChanges, setRefinementChanges] = useState<string[]>(
    dbSection.refinement_changes || []
  )
  const [error, setError] = useState<string | null>(null)
  const [showCode, setShowCode] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus textarea on mount
  useEffect(() => {
    if (stage === 'input' && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [stage, section.id])

  // Reset when section changes
  useEffect(() => {
    setPrompt(dbSection.user_prompt || '')
    setStage(dbSection.status === 'complete' ? 'complete' : 'input')
    setGeneratedCode(dbSection.code || '')
    setRefined(dbSection.refined)
    setRefinementChanges(dbSection.refinement_changes || [])
    setError(null)
  }, [dbSection.id])

  const handleBuildSection = async () => {
    if (!prompt.trim()) {
      setError('Please describe what you want for this section')
      return
    }

    setError(null)
    setStage('generating')

    // Demo mode - simulate generation with mock code
    if (demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate delay
      const mockCode = generateMockCode(section.id, section.name, prompt)
      setGeneratedCode(mockCode)
      setStage('refining')
      
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate Opus
      const mockChanges = Math.random() > 0.5 
        ? ['Added focus states to buttons', 'Improved color contrast'] 
        : []
      
      setRefined(mockChanges.length > 0)
      setRefinementChanges(mockChanges)
      setStage('complete')
      onComplete(mockCode, mockChanges.length > 0, mockChanges)
      return
    }

    try {
      // Stage 1: Sonnet generates the section
      const generateResponse = await fetch('/api/build-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          sectionId: dbSection.id,
          sectionType: section.id,
          sectionName: section.name,
          userPrompt: prompt,
          previousSections: allSectionsCode,
        }),
      })

      if (!generateResponse.ok) {
        throw new Error('Generation failed')
      }

      const { code: sonnetCode } = await generateResponse.json()
      setGeneratedCode(sonnetCode)
      setStage('refining')

      // Stage 2: Opus refines the section
      const refineResponse = await fetch('/api/refine-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: dbSection.id,
          code: sonnetCode,
          sectionType: section.id,
          sectionName: section.name,
          userPrompt: prompt,
        }),
      })

      if (!refineResponse.ok) {
        // Refinement failed, but generation succeeded - continue with original
        console.error('Refinement failed, using original code')
        setRefined(false)
        setStage('complete')
        onComplete(sonnetCode, false)
        return
      }

      const { refined: wasRefined, code: finalCode, changes } = await refineResponse.json()

      setGeneratedCode(finalCode)
      setRefined(wasRefined)
      setRefinementChanges(changes || [])
      setStage('complete')

      // Notify parent
      onComplete(finalCode, wasRefined, changes)

    } catch (err) {
      console.error('Build error:', err)
      setError('Failed to build section. Please try again.')
      setStage('input')
    }
  }

  const handleRebuild = () => {
    setStage('input')
    setGeneratedCode('')
    setRefined(false)
    setRefinementChanges([])
  }

  return (
    <div className="flex-1 flex">
      {/* Left: Input Panel */}
      <div className="w-1/2 border-r border-zinc-800 flex flex-col">
        {/* Section Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{section.name}</h2>
              <p className="text-sm text-zinc-500">{section.estimatedTime}</p>
            </div>
          </div>
          <p className="text-zinc-400 mt-3">{section.description}</p>
        </div>

        {/* Input Area */}
        <div className="flex-1 p-6 flex flex-col">
          <label className="text-sm font-medium text-zinc-300 mb-2">
            {section.prompt}
          </label>
          
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={stage !== 'input'}
            placeholder="Describe what you want..."
            className="flex-1 min-h-[200px] bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 disabled:opacity-50"
          />

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2"
            >
              {error}
            </motion.div>
          )}

          {/* Action Button */}
          <div className="mt-4">
            <AnimatePresence mode="wait">
              {stage === 'input' && (
                <motion.button
                  key="build"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleBuildSection}
                  disabled={!prompt.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/20 transition-shadow"
                >
                  Build Section →
                </motion.button>
              )}

              {stage === 'generating' && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full py-3 rounded-xl bg-zinc-800 text-center"
                >
                  <div className="flex items-center justify-center gap-3 text-zinc-300">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block"
                    >
                      ⚡
                    </motion.span>
                    <span>Sonnet is building...</span>
                  </div>
                </motion.div>
              )}

              {stage === 'refining' && (
                <motion.div
                  key="refining"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full py-3 rounded-xl bg-violet-500/20 border border-violet-500/30 text-center"
                >
                  <div className="flex items-center justify-center gap-3 text-violet-300">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="inline-block"
                    >
                      ✨
                    </motion.span>
                    <span>Opus is polishing...</span>
                  </div>
                </motion.div>
              )}

              {stage === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <SectionCompleteIndicator
                    sectionName={section.name}
                    wasRefined={refined}
                    changes={refinementChanges}
                  />
                  
                  <button
                    onClick={handleRebuild}
                    className="w-full py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Rebuild this section
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 bg-zinc-900/30 border-t border-zinc-800">
          <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
            Tips for better results
          </h4>
          <ul className="text-xs text-zinc-600 space-y-1">
            <li>• Be specific about colors, style, and tone</li>
            <li>• Mention your brand or product name</li>
            <li>• Include real content when possible</li>
          </ul>
        </div>
      </div>

      {/* Right: Preview Panel */}
      <div className="w-1/2 flex flex-col bg-zinc-900/30">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-medium text-zinc-400">
              {showCode ? 'Code' : 'Preview'}
            </h3>
            {generatedCode && (
              <button
                onClick={() => setShowCode(!showCode)}
                className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
              >
                {showCode ? '← Preview' : 'View Code →'}
              </button>
            )}
          </div>
          {generatedCode && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-400">⚡ Sonnet</span>
              {refined && <span className="text-violet-400">+ ✨ Opus</span>}
            </div>
          )}
        </div>

        <div className="flex-1 flex overflow-hidden">
          {showCode && generatedCode ? (
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap bg-zinc-950 rounded-xl p-4">
                {generatedCode}
              </pre>
            </div>
          ) : (
            <SectionPreview 
              code={generatedCode} 
              allSectionsCode={allSectionsCode}
              darkMode={true}
            />
          )}
        </div>
      </div>
    </div>
  )
}
