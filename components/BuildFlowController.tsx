'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import TemplateSelector, { BuildComplete } from './TemplateSelector'
import SectionProgress from './SectionProgress'
import SectionBuilder from './SectionBuilder'
import { Template, Section, getTemplateById, createInitialBuildState, BuildState } from '@/lib/templates'
import { DbProject, DbSection } from '@/lib/supabase'

// =============================================================================
// BUILD FLOW CONTROLLER
// Orchestrates the entire V3.0 build experience
// =============================================================================

type BuildPhase = 'select' | 'building' | 'complete'

interface BuildFlowControllerProps {
  existingProjectId?: string // For resuming builds
  demoMode?: boolean // Local testing without Supabase
}

// Generate mock IDs for demo mode
const generateId = () => Math.random().toString(36).substring(2, 15)

export default function BuildFlowController({ existingProjectId, demoMode: forceDemoMode }: BuildFlowControllerProps) {
  const { user } = useUser()
  
  // Auto-detect demo mode if Supabase isn't configured
  const [demoMode, setDemoMode] = useState(forceDemoMode ?? false)
  
  // Core state
  const [phase, setPhase] = useState<BuildPhase>('select')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [buildState, setBuildState] = useState<BuildState | null>(null)
  
  // Database state
  const [project, setProject] = useState<DbProject | null>(null)
  const [dbSections, setDbSections] = useState<DbSection[]>([])
  
  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuditRunning, setIsAuditRunning] = useState(false)

  // Load existing project if resuming
  useEffect(() => {
    if (existingProjectId) {
      loadExistingProject(existingProjectId)
    }
  }, [existingProjectId])

  // =========================================================================
  // PROJECT INITIALIZATION
  // =========================================================================

  const loadExistingProject = async (projectId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/project/${projectId}`)
      if (!response.ok) throw new Error('Failed to load project')
      
      const { project: proj, sections } = await response.json()
      
      const template = getTemplateById(proj.template_id)
      if (!template) throw new Error('Unknown template')

      setProject(proj)
      setDbSections(sections)
      setSelectedTemplate(template)
      
      // Rebuild build state from DB
      const state = createInitialBuildState(template.id)
      sections.forEach((s: DbSection) => {
        if (s.status === 'complete') {
          state.completedSections.push(s.section_id)
          if (s.code) state.sectionCode[s.section_id] = s.code
          if (s.refined) state.sectionRefined[s.section_id] = true
          if (s.refinement_changes) state.sectionChanges[s.section_id] = s.refinement_changes
        } else if (s.status === 'skipped') {
          state.skippedSections.push(s.section_id)
        }
      })
      
      // Find current section index
      const firstPending = sections.findIndex((s: DbSection) => s.status === 'pending' || s.status === 'building')
      state.currentSectionIndex = firstPending === -1 ? template.sections.length : firstPending
      
      setBuildState(state)
      
      // Determine phase
      const allDone = sections.every((s: DbSection) => s.status === 'complete' || s.status === 'skipped')
      setPhase(allDone ? 'complete' : 'building')
      
    } catch (err) {
      console.error('Error loading project:', err)
      setError('Failed to load project')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateSelect = async (template: Template, customizedSections?: Section[]) => {
    const sections = customizedSections || template.sections
    
    // Helper function to set up demo mode
    const setupDemoMode = () => {
      const mockProjectId = generateId()
      
      // Create mock project
      const mockProject: DbProject = {
        id: mockProjectId,
        user_id: 'demo-user',
        name: `${template.name} - ${new Date().toLocaleDateString()}`,
        slug: `demo-${mockProjectId}`,
        template_id: template.id,
        status: 'building',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      // Create mock sections
      const mockSections: DbSection[] = sections.map((s, index) => ({
        id: generateId(),
        project_id: mockProjectId,
        section_id: s.id,
        code: null,
        user_prompt: null,
        refined: false,
        refinement_changes: null,
        status: 'pending' as const,
        order_index: index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
      
      setProject(mockProject)
      setDbSections(mockSections)
      setSelectedTemplate(template)
      setBuildState(createInitialBuildState(template.id))
      setPhase('building')
      setDemoMode(true)
      setIsLoading(false)
    }
    
    // Demo mode - skip database, use local state
    if (demoMode || forceDemoMode || !user) {
      setupDemoMode()
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create project in database
      const response = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          name: `${template.name} - ${new Date().toLocaleDateString()}`,
          sections: sections,
        }),
      })

      if (!response.ok) {
        // Fall back to demo mode if API fails
        console.warn('API failed, falling back to demo mode')
        setupDemoMode()
        return
      }

      const { project: newProject, sections: dbSectionsData } = await response.json()

      setProject(newProject)
      setDbSections(dbSectionsData)
      setSelectedTemplate(template)
      setBuildState(createInitialBuildState(template.id))
      setPhase('building')

    } catch (err) {
      console.error('Error creating project:', err)
      // Fall back to demo mode
      console.warn('Falling back to demo mode')
      setupDemoMode()
    } finally {
      setIsLoading(false)
    }
  }

  // =========================================================================
  // SECTION MANAGEMENT
  // =========================================================================

  const getCurrentSection = useCallback((): Section | null => {
    if (!selectedTemplate || !buildState) return null
    return selectedTemplate.sections[buildState.currentSectionIndex] || null
  }, [selectedTemplate, buildState])

  const getCurrentDbSection = useCallback((): DbSection | null => {
    const section = getCurrentSection()
    if (!section) return null
    return dbSections.find(s => s.section_id === section.id) || null
  }, [getCurrentSection, dbSections])

  const handleSectionComplete = async (
    code: string,
    refined: boolean,
    refinementChanges?: string[]
  ) => {
    if (!buildState || !selectedTemplate || !project) return

    const currentSection = getCurrentSection()
    const dbSection = getCurrentDbSection()
    if (!currentSection || !dbSection) return

    // Update local state
    const newState: BuildState = {
      ...buildState,
      completedSections: [...buildState.completedSections, currentSection.id],
      sectionCode: { ...buildState.sectionCode, [currentSection.id]: code },
      sectionRefined: { ...buildState.sectionRefined, [currentSection.id]: refined },
      sectionChanges: refinementChanges 
        ? { ...buildState.sectionChanges, [currentSection.id]: refinementChanges }
        : buildState.sectionChanges,
      currentSectionIndex: buildState.currentSectionIndex + 1,
    }

    // Update DB sections state
    setDbSections(prev => 
      prev.map(s => 
        s.id === dbSection.id 
          ? { ...s, status: 'complete' as const, code, refined, refinement_changes: refinementChanges || null }
          : s
      )
    )

    setBuildState(newState)

    // Check if all sections are complete
    if (newState.currentSectionIndex >= selectedTemplate.sections.length) {
      setPhase('complete')
      // Create build
      await fetch(`/api/project/${project.id}/build`, { method: 'POST' })
    }
  }

  const handleSkipSection = async () => {
    if (!buildState || !selectedTemplate || !project) return

    const currentSection = getCurrentSection()
    const dbSection = getCurrentDbSection()
    if (!currentSection || !dbSection) return

    // Update database
    await fetch(`/api/section/${dbSection.id}/skip`, { method: 'POST' })

    // Update local state
    const newState: BuildState = {
      ...buildState,
      skippedSections: [...buildState.skippedSections, currentSection.id],
      currentSectionIndex: buildState.currentSectionIndex + 1,
    }

    setDbSections(prev => 
      prev.map(s => 
        s.id === dbSection.id 
          ? { ...s, status: 'skipped' as const }
          : s
      )
    )

    setBuildState(newState)

    // Check if all sections are complete
    if (newState.currentSectionIndex >= selectedTemplate.sections.length) {
      setPhase('complete')
      await fetch(`/api/project/${project.id}/build`, { method: 'POST' })
    }
  }

  const handleSectionClick = (sectionIndex: number) => {
    if (!buildState) return
    // Only allow clicking on completed or skipped sections (for review)
    // or the current section
    const section = selectedTemplate?.sections[sectionIndex]
    if (!section) return
    
    const isAccessible = 
      buildState.completedSections.includes(section.id) ||
      buildState.skippedSections.includes(section.id) ||
      sectionIndex === buildState.currentSectionIndex

    if (isAccessible) {
      setBuildState({ ...buildState, currentSectionIndex: sectionIndex })
    }
  }

  // =========================================================================
  // FINAL ACTIONS
  // =========================================================================

  const handleDeploy = async () => {
    if (!project) return
    // TODO: Integrate with existing deploy flow
    window.location.href = `/deploy/${project.id}`
  }

  const handleRunAudit = async () => {
    if (!project || !buildState) return

    setIsAuditRunning(true)

    try {
      const response = await fetch(`/api/project/${project.id}/audit`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Audit failed')

      const { auditChanges } = await response.json()

      setBuildState({
        ...buildState,
        finalAuditComplete: true,
        finalAuditChanges: auditChanges,
      })

    } catch (err) {
      console.error('Audit error:', err)
      setError('Audit failed. You can still deploy.')
    } finally {
      setIsAuditRunning(false)
    }
  }

  // =========================================================================
  // RENDER
  // =========================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <button
            onClick={() => setError(null)}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <AnimatePresence mode="wait">
        {/* PHASE 1: Template Selection */}
        {phase === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TemplateSelector onSelectTemplate={handleTemplateSelect} />
          </motion.div>
        )}

        {/* PHASE 2: Building */}
        {phase === 'building' && selectedTemplate && buildState && (
          <motion.div
            key="building"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {/* Progress Bar */}
            <SectionProgress
              template={selectedTemplate}
              buildState={buildState}
              onSectionClick={handleSectionClick}
              onSkip={handleSkipSection}
            />

            {/* Section Builder */}
            <div className="flex-1 flex">
              {getCurrentSection() && getCurrentDbSection() && project && (
                <SectionBuilder
                  section={getCurrentSection()!}
                  dbSection={getCurrentDbSection()!}
                  projectId={project.id}
                  onComplete={handleSectionComplete}
                  allSectionsCode={buildState.sectionCode}
                  demoMode={demoMode}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* PHASE 3: Complete */}
        {phase === 'complete' && buildState && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md">
              <BuildComplete
                onDeploy={handleDeploy}
                onRunAudit={handleRunAudit}
                isAuditRunning={isAuditRunning}
                auditComplete={buildState.finalAuditComplete}
                auditChanges={buildState.finalAuditChanges}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
