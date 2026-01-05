'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ArrowRight, Trash2, Search, Globe, LayoutGrid, List, ExternalLink, MoreHorizontal, Clock, ChevronRight, Zap, Crown, Check, Code2 } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'
import { DbProject } from '@/lib/supabase'

export default function StudioPage() {
  const { user } = useUser()
  const [projects, setProjects] = useState<DbProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMigrating, setIsMigrating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const accountSubscription = user?.publicMetadata?.accountSubscription as any
  const tier = accountSubscription?.tier || 'free'
  const isFreeTier = !accountSubscription || tier === 'free' || tier === 'trial'

  const tierConfig = useMemo(() => {
    if (tier === 'singularity') return { name: 'Singularity', limit: Infinity, color: 'text-amber-400', bg: 'bg-amber-500/10' }
    if (tier === 'visionary') return { name: 'Visionary', limit: Infinity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
    if (tier === 'architect') return { name: 'Architect', limit: 3, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
    return { name: 'Free', limit: 3, color: 'text-zinc-400', bg: 'bg-zinc-500/10' }
  }, [tier])

  const isAtLimit = tierConfig.limit !== Infinity && projects.length >= tierConfig.limit

  useEffect(() => {
    async function init() {
      try {
        // Import guest work if exists
        const guestHandoff = localStorage.getItem('hatch_guest_handoff')
        if (guestHandoff) {
          setIsMigrating(true)
          try {
            const payload = JSON.parse(guestHandoff)
            console.log('[Studio] Attempting to import guest work:', {
              projectName: payload?.projectName,
              templateId: payload?.templateId,
              sectionsCount: payload?.sections?.length,
              sectionsWithCode: payload?.sections?.filter((s: any) => s.code?.length > 0).length,
            })
            const res = await fetch('/api/project/import', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
            if (res.ok) {
              const data = await res.json()
              console.log('[Studio] Import successful:', data)
              localStorage.removeItem('hatch_guest_handoff')
              localStorage.removeItem('hatch_last_prompt')
            } else {
              // Try to get error text if JSON fails
              const text = await res.text()
              console.error('[Studio] Import failed:', res.status, text)
              // Don't clear handoff if import failed - they might need to retry
            }
          } catch (err) {
            console.error('[Studio] Import error:', err)
          }
          setIsMigrating(false)
        }

        const res = await fetch('/api/project/list')
        if (res.ok) {
          const data = await res.json()
          setProjects(data.projects || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects
    return projects.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [projects, searchQuery])

  const handleCreate = async () => {
    if (isAtLimit) {
      setShowUpgradeModal(true)
      return
    }
    setIsCreating(true)
    try {
      const res = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Untitled Project', templateId: 'landing-page' })
      })
      if (res.ok) {
        const data = await res.json()
        setProjects(prev => [data.project, ...prev])
      }
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Delete this project?')) {
      const res = await fetch(`/api/project/${id}`, { method: 'DELETE' })
      if (res.ok) setProjects(prev => prev.filter(p => p.id !== id))
    }
  }

  if (isLoading || isMigrating) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start justify-between mb-8"
          >
            <div>
              <h1 className="text-xl font-semibold text-zinc-100 mb-1">Studio</h1>
              <p className="text-zinc-500 text-sm">
                Build and deploy React components with AI
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              disabled={isCreating}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-md transition-colors shadow-lg shadow-emerald-900/20"
            >
              {isCreating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              New Project
            </motion.button>
          </motion.div>

          {/* Subtle upgrade hint for free users */}
          {isFreeTier && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 flex items-center justify-between px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-md"
            >
              <p className="text-zinc-400 text-sm">Free plan · {projects.length}/{tierConfig.limit} projects</p>
              <Link
                href="/dashboard/billing"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Upgrade →
              </Link>
            </motion.div>
          )}

          {/* Search and filters */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between gap-4 mb-6"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Projects */}
          {filteredProjects.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="w-5 h-5 text-zinc-500" />
              </div>
              <h3 className="text-base font-medium text-zinc-200 mb-1">
                {searchQuery ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-zinc-500 text-sm mb-5 max-w-xs mx-auto">
                {searchQuery 
                  ? 'Try a different search term.' 
                  : 'Create a project to start building with AI.'}
              </p>
              {!searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  disabled={isAtLimit}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md font-medium text-sm transition-colors"
                >
                  Create Project
                </motion.button>
              )}
            </motion.div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={`/builder?project=${project.id}`}
                    className="group block bg-zinc-900 hover:bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 rounded-md p-5 transition-all h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-md flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                        <div className="w-3 h-3 bg-emerald-600 rounded-sm" />
                      </div>
                      
                      {project.slug && (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-500">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          Live
                        </span>
                      )}
                    </div>

                    <h3 className="font-medium text-zinc-200 mb-1 truncate group-hover:text-white transition-colors">
                      {project.name || 'Untitled'}
                    </h3>
                    
                    <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {project.updated_at 
                        ? formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })
                        : 'Just now'}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                      <div className="flex items-center gap-2">
                        {project.slug && (
                          <a
                            href={`https://${project.slug}.hatchitsites.dev`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800 rounded transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button 
                          onClick={(e) => handleDelete(e, project.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-900"
            >
              {filteredProjects.map((project, i) => (
                <Link
                  key={project.id}
                  href={`/builder?project=${project.id}`}
                  className={`group flex items-center gap-4 px-5 py-4 hover:bg-zinc-800/50 transition-colors ${
                    i !== filteredProjects.length - 1 ? 'border-b border-zinc-800' : ''
                  }`}
                >
                  <div className="w-9 h-9 bg-zinc-800 rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-700 transition-colors">
                    <div className="w-2.5 h-2.5 bg-emerald-600 rounded-sm" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-zinc-200 text-sm truncate group-hover:text-white transition-colors">
                      {project.name || 'Untitled'}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {project.updated_at 
                        ? formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })
                        : 'Just now'}
                    </p>
                  </div>

                  {project.slug && (
                    <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-500 px-2 py-1 bg-emerald-500/10 rounded">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Live
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    {project.slug && (
                      <a
                        href={`https://${project.slug}.hatchitsites.dev`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-zinc-500 hover:text-emerald-400 rounded transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button 
                      onClick={(e) => handleDelete(e, project.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </motion.div>
          )}

          {/* Coming Soon - Realistic Roadmap */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 pt-8 border-t border-zinc-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-medium text-zinc-400">Coming Soon</h2>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded uppercase tracking-wider">Q1 2026</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Replicator - REAL, already built */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="group relative bg-zinc-900 border border-zinc-800 rounded-md p-5 overflow-hidden"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-zinc-800 rounded-md flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition-colors">
                    <Zap className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="font-medium text-zinc-200 mb-1">URL Replicator</h3>
                  <p className="text-xs text-zinc-500">
                    Paste any URL → AI extracts the design DNA and recreates it as your starting point.
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] text-emerald-500 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Built — Launching Soon
                  </div>
                </div>
              </motion.div>

              {/* Code Export - REAL, tier-gated */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="group relative bg-zinc-900 border border-zinc-800 rounded-md p-5 overflow-hidden"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-zinc-800 rounded-md flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition-colors">
                    <Code2 className="w-5 h-5 text-zinc-400" />
                  </div>
                  <h3 className="font-medium text-zinc-200 mb-1">Code Export</h3>
                  <p className="text-xs text-zinc-500">
                    Download your components as clean React + Tailwind files. Own your code completely.
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-wider">
                    <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                    Visionary+ Tier
                  </div>
                </div>
              </motion.div>

              {/* Custom Domains - REAL roadmap */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="group relative bg-zinc-900 border border-zinc-800 rounded-md p-5 overflow-hidden"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-zinc-800 rounded-md flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition-colors">
                    <Globe className="w-5 h-5 text-zinc-400" />
                  </div>
                  <h3 className="font-medium text-zinc-200 mb-1">Custom Domains</h3>
                  <p className="text-xs text-zinc-500">
                    Connect your own domain. Deploy to yourbrand.com instead of hatchitsites.dev.
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-wider">
                    <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                    Q1 2026
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Roadmap Link */}
            <div className="mt-6 text-center">
              <Link 
                href="/roadmap"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-400 transition-colors"
              >
                View full roadmap
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 rounded-lg p-6 w-full max-w-lg border border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-zinc-100 mb-2">Upgrade your plan</h2>
              <p className="text-zinc-400 text-sm mb-6">
                You&apos;ve reached the {tierConfig.limit} project limit. Choose a plan to continue.
              </p>
              
              <div className="space-y-3 mb-6">
                <a 
                  href="/api/checkout?tier=architect"
                  className="flex items-center justify-between p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-md transition-colors"
                >
                  <div>
                    <p className="text-zinc-200 font-medium">Architect</p>
                    <p className="text-zinc-500 text-sm">3 projects, deploy to hatchit.dev</p>
                  </div>
                  <p className="text-zinc-200 font-semibold">$19<span className="text-zinc-500 font-normal">/mo</span></p>
                </a>

                <a 
                  href="/api/checkout?tier=visionary"
                  className="flex items-center justify-between p-4 bg-emerald-900/10 border border-emerald-500/30 rounded-md hover:bg-emerald-900/20 transition-colors relative"
                >
                  <div className="absolute -top-2 left-4 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded">RECOMMENDED</div>
                  <div>
                    <p className="text-zinc-200 font-medium">Visionary</p>
                    <p className="text-zinc-400 text-sm">10 projects + download code</p>
                  </div>
                  <p className="text-zinc-200 font-semibold">$49<span className="text-zinc-400 font-normal">/mo</span></p>
                </a>

                <a 
                  href="/api/checkout?tier=singularity"
                  className="flex items-center justify-between p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-md transition-colors"
                >
                  <div>
                    <p className="text-zinc-200 font-medium">Singularity</p>
                    <p className="text-zinc-500 text-sm">Unlimited projects + API</p>
                  </div>
                  <p className="text-zinc-200 font-semibold">$199<span className="text-zinc-500 font-normal">/mo</span></p>
                </a>
              </div>

              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-2.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
              >
                Maybe later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

