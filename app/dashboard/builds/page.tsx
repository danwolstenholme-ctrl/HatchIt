'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  ExternalLink, 
  Folder, 
  Globe, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  Rocket,
  Code2,
  BarChart3,
  Zap
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { DbProject } from '@/lib/supabase'

type ProjectWithProgress = DbProject & {
  total_sections?: number
  completed_sections?: number
  skipped_sections?: number
  deployed_url?: string
}

export default function DashboardBuildsPage() {
  const [projects, setProjects] = useState<ProjectWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const res = await fetch('/api/project/list')
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string }
          throw new Error(body.error || 'Failed to load projects')
        }
        const data = (await res.json()) as { projects?: ProjectWithProgress[] }
        if (!cancelled) setProjects(data.projects || [])
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load projects')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const rows = useMemo(() => {
    return [...projects].sort((a, b) => {
      const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0
      const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0
      return bTime - aTime
    })
  }, [projects])

  // Stats calculations
  const stats = useMemo(() => {
    const totalProjects = projects.length
    const deployed = projects.filter(p => p.status === 'deployed').length
    const inProgress = projects.filter(p => p.status === 'building').length
    const totalSections = projects.reduce((acc, p) => acc + (p.total_sections || 0), 0)
    const completedSections = projects.reduce((acc, p) => acc + (p.completed_sections || 0), 0)
    
    return { totalProjects, deployed, inProgress, totalSections, completedSections }
  }, [projects])

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <Folder className="w-4 h-4 text-zinc-500" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Projects</span>
          </div>
          <p className="text-xl font-semibold text-white tabular-nums">{stats.totalProjects}</p>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Deployed</span>
          </div>
          <p className="text-xl font-semibold text-white tabular-nums">{stats.deployed}</p>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Building</span>
          </div>
          <p className="text-xl font-semibold text-white tabular-nums">{stats.inProgress}</p>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="w-4 h-4 text-zinc-500" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Sections</span>
          </div>
          <p className="text-xl font-semibold text-white tabular-nums">
            {stats.completedSections}<span className="text-zinc-600 text-sm">/{stats.totalSections}</span>
          </p>
        </div>
      </div>

      {/* Projects List */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-medium text-zinc-300">All Projects</span>
          </div>
          <Link 
            href="/dashboard" 
            className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            New project <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="px-4 py-12 text-center">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center justify-center gap-2 text-xs text-zinc-500"
            >
              <Activity className="w-4 h-4" />
              Loading projects...
            </motion.div>
          </div>
        ) : error ? (
          <div className="px-4 py-8 text-center">
            <AlertCircle className="w-5 h-5 text-red-500 mx-auto mb-2" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-5 h-5 text-zinc-500" />
            </div>
            <p className="text-sm text-zinc-400 mb-2">No projects yet</p>
            <p className="text-xs text-zinc-500 mb-4">Start building your first website with AI</p>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors"
            >
              Create project <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            <AnimatePresence>
              {rows.map((project, index) => {
                const completed = project.completed_sections ?? 0
                const total = project.total_sections ?? 0
                const progress = total > 0 ? Math.round((completed / total) * 100) : 0
                const isDeployed = project.status === 'deployed'
                const isComplete = progress === 100
                
                return (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link 
                      href={`/dashboard/builds/${project.id}`}
                      className="block p-4 hover:bg-zinc-800/50 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Left: Project info */}
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isDeployed 
                              ? 'bg-emerald-500/10 border border-emerald-500/30' 
                              : 'bg-zinc-800 border border-zinc-700'
                          }`}>
                            {isDeployed ? (
                              <Globe className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Folder className="w-4 h-4 text-zinc-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-zinc-100 truncate group-hover:text-white transition-colors">
                                {project.name || 'Untitled'}
                              </h3>
                              {isDeployed && (
                                <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                                  <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                                  Live
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{project.slug}</p>
                            
                            {/* Progress bar */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  className={`h-full rounded-full ${
                                    isComplete ? 'bg-emerald-500' : 'bg-zinc-600'
                                  }`}
                                />
                              </div>
                              <span className="text-[10px] text-zinc-500 tabular-nums">
                                {completed}/{total} sections
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Meta + Actions */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          {/* Last updated */}
                          <div className="hidden md:flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <Clock className="w-3 h-3" />
                            {project.updated_at 
                              ? formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })
                              : 'Just created'
                            }
                          </div>

                          {/* Status badge */}
                          <span className={`hidden sm:inline text-[10px] px-2 py-1 rounded-md ${
                            isDeployed 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : isComplete
                              ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                              : 'bg-zinc-800/50 text-zinc-500 border border-zinc-800'
                          }`}>
                            {isDeployed ? 'Deployed' : isComplete ? 'Ready' : 'Building'}
                          </span>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {isDeployed && project.deployed_url && (
                              <a
                                href={project.deployed_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 text-zinc-500 hover:text-emerald-400 rounded transition-colors"
                                title="View live site"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <span
                              onClick={(e) => {
                                e.preventDefault()
                                window.location.href = `/builder?project=${project.id}`
                              }}
                              className="p-1.5 text-zinc-500 hover:text-white rounded transition-colors cursor-pointer"
                              title="Open in builder"
                            >
                              <Code2 className="w-3.5 h-3.5" />
                            </span>
                            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors ml-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Quick help */}
      {rows.length > 0 && (
        <p className="text-center text-[10px] text-zinc-600">
          Click a project to view build history, snapshots, and deployment details
        </p>
      )}
    </div>
  )
}
