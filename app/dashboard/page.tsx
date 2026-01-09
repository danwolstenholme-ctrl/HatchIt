'use client'

import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Search, 
  ExternalLink, 
  ChevronRight,
  X,
  Github,
  Folder,
  Globe,
  Download,
  Code2,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Layers,
  Activity,
  Rocket,
  Layout,
  Smartphone,
  Shield
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'
import { DbProject } from '@/lib/supabase'
import { LogoMark } from '@/components/Logo'
import { useGitHub } from '@/hooks/useGitHub'
import Badge from '@/components/singularity/Badge'

// =============================================================================
// DASHBOARD - Clean white glass, minimal, infrastructure-focused
// Follows "Confident Restraint" - sparse, quiet, professional
// =============================================================================

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const gitHub = useGitHub()
  const router = useRouter()
  const [projects, setProjects] = useState<DbProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const accountSubscription = user?.publicMetadata?.accountSubscription as { tier?: string } | undefined
  const tier = accountSubscription?.tier || 'free'

  const tierConfig = useMemo(() => {
    if (tier === 'singularity') return { name: 'Singularity', limit: Infinity, variant: 'singularity' as const }
    if (tier === 'visionary') return { name: 'Visionary', limit: Infinity, variant: 'visionary' as const }
    if (tier === 'architect') return { name: 'Architect', limit: 3, variant: 'architect' as const }
    return { name: 'Free', limit: 1, variant: 'default' as const }
  }, [tier])

  const isAtLimit = tierConfig.limit !== Infinity && projects.length >= tierConfig.limit
  const canDeploy = tier !== 'free'
  const canExport = tier !== 'free'

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.replace('/sign-in?redirect_url=/dashboard')
      return
    }

    let cancelled = false

    const bootstrap = async () => {
      try {
        const res = await fetch('/api/project/list')
        if (res.status === 401) {
          router.replace('/sign-in?redirect_url=/dashboard')
          return
        }

        if (res.ok) {
          const data = await res.json() as { projects?: DbProject[] }
          if (!cancelled) setProjects(data.projects || [])
        }
      } catch (error: unknown) {
        console.error('[Dashboard] Failed to load projects', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    bootstrap()

    return () => { cancelled = true }
  }, [isLoaded, isSignedIn, router])

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects
    const query = searchQuery.toLowerCase()
    return projects.filter(project => 
      (project.name || 'Untitled Project').toLowerCase().includes(query)
    )
  }, [projects, searchQuery])

  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0
      const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0
      return bTime - aTime
    })
  }, [filteredProjects])

  const deployedCount = projects.filter(p => p.status === 'deployed').length
  const inProgressCount = projects.filter(p => !['deployed', 'complete'].includes(p.status || '')).length
  const githubConnected = gitHub.connected && !gitHub.loading

  const handleCreate = async () => {
    if (isAtLimit) {
      router.push('/dashboard/billing')
      return
    }

    setIsCreating(true)
    setCreateError(null)
    try {
      const res = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Untitled Project', templateId: 'website' }),
      })

      const data = await res.json()
      
      if (res.ok && data.project) {
        setProjects(prev => [data.project, ...prev])
        router.push(`/builder?project=${data.project.id}`)
      } else {
        if (res.status === 403) {
          router.push('/dashboard/billing')
        } else {
          setCreateError(data.error || 'Failed to create project')
        }
      }
    } catch {
      setCreateError('Failed to create project')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.preventDefault()
    event.stopPropagation()
    if (!confirm('Delete this project?')) return
    const res = await fetch(`/api/project/${id}`, { method: 'DELETE' })
    if (res.ok) setProjects(prev => prev.filter(project => project.id !== id))
  }

  // Loading state - white theme
  if (!isLoaded || !isSignedIn || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <LogoMark size={24} />
          <div className="text-[10px] text-zinc-400 font-mono tracking-wider">LOADING</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Error Toast */}
      <AnimatePresence>
        {createError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{createError}</span>
            <button onClick={() => setCreateError(null)} className="text-red-400/60 hover:text-red-400" aria-label="Dismiss error">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - Minimal */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-white">Dashboard</h1>
          <Badge variant={tierConfig.variant}>{tierConfig.name}</Badge>
        </div>
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors disabled:opacity-50"
        >
          {isCreating ? (
            <div className="w-3 h-3 border border-zinc-600 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
          New
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column - Projects */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Projects Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Projects</span>
            {projects.length > 3 && (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 pr-2 py-1 text-[11px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 w-28"
                />
              </div>
            )}
          </div>

          {/* Projects List */}
          {projects.length === 0 ? (
            <div className="border border-dashed border-zinc-800 rounded-lg p-10 text-center bg-zinc-900/50">
              <Terminal className="w-6 h-6 text-zinc-500 mx-auto mb-3" />
              <p className="text-xs text-zinc-400 mb-4">No projects yet</p>
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors"
              >
                <Plus className="w-3 h-3" />
                Create
              </button>
            </div>
          ) : sortedProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-zinc-500">No results for &quot;{searchQuery}&quot;</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/builder?project=${project.id}`}
                  className="group flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/80 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                      project.status === 'deployed' 
                        ? 'bg-emerald-500/10 border border-emerald-500/30' 
                        : 'bg-zinc-800 border border-zinc-700'
                    }`}>
                      {project.status === 'deployed' ? (
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Folder className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-100 truncate group-hover:text-white transition-colors">
                        {project.name || 'Untitled'}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                        <span>
                          {project.updated_at 
                            ? formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })
                            : 'Just created'
                          }
                        </span>
                        {project.status === 'deployed' && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                            Live
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {project.status === 'deployed' && (project as DbProject & { deployed_url?: string }).deployed_url && (
                      <a
                        href={(project as DbProject & { deployed_url?: string }).deployed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-zinc-500 hover:text-white rounded transition-colors"
                        aria-label="Visit deployed site"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, project.id)}
                      className="p-1.5 text-zinc-600 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* The Stack */}
          <div className="pt-4">
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-3 block">Stack</span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'React 19', icon: Code2 },
                { name: 'Tailwind', icon: Layout },
                { name: 'TypeScript', icon: Terminal },
                { name: 'Motion', icon: Layers },
                { name: 'Responsive', icon: Smartphone },
                { name: 'Accessible', icon: CheckCircle2 },
                { name: 'SEO', icon: Globe },
                { name: 'Yours', icon: Shield },
              ].map((tech) => (
                <div 
                  key={tech.name}
                  className="flex items-center gap-2 px-2.5 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-[10px] text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all"
                >
                  <tech.icon className="w-3 h-3" />
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Status & Integrations */}
        <div className="space-y-4">
          
          {/* Status Card */}
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-3 block">Status</span>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">Projects</span>
                <span className="text-[11px] text-zinc-300 font-mono">
                  {projects.length}{tierConfig.limit !== Infinity ? `/${tierConfig.limit}` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">Deployed</span>
                <span className="text-[11px] text-zinc-300 font-mono">{deployedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">Building</span>
                <span className="text-[11px] text-amber-500 font-mono">{inProgressCount}</span>
              </div>
            </div>
          </div>

          {/* GitHub Card */}
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Github className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">GitHub</span>
              </div>
              {githubConnected && (
                <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Connected
                </span>
              )}
            </div>
            {githubConnected ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">Account</span>
                  <span className="text-[11px] text-zinc-300 font-mono">@{gitHub.username}</span>
                </div>
                <p className="text-[10px] text-zinc-500">Push code directly to your repos</p>
                <button
                  onClick={() => gitHub.disconnect().then(() => gitHub.refresh())}
                  className="w-full px-2 py-1.5 text-[10px] text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-[10px] text-zinc-500">Connect to push code to your repos</p>
                <button
                  onClick={() => gitHub.connect()}
                  disabled={gitHub.loading}
                  className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
                >
                  <Github className="w-3 h-3" />
                  Connect
                </button>
              </div>
            )}
          </div>

          {/* Capabilities Card */}
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-3 block">Your Plan</span>
            <div className="space-y-1.5">
              <Capability icon={Code2} label="AI Generation" enabled />
              <Capability icon={Layers} label="Live Preview" enabled />
              <Capability icon={Rocket} label="Deploy" enabled={canDeploy} />
              <Capability icon={Download} label="Export" enabled={canExport} />
              <Capability icon={GitBranch} label="GitHub Push" enabled={canExport} />
              <Capability icon={Globe} label="Custom Domain" enabled={tier === 'visionary' || tier === 'singularity'} />
            </div>
            {tier === 'free' && (
              <Link
                href="/dashboard/billing"
                className="flex items-center justify-center gap-1.5 w-full mt-3 px-2 py-1.5 text-[11px] font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
              >
                Upgrade
                <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {/* Quick Links */}
          <div className="flex gap-2">
            <Link
              href="/dashboard/builds"
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[10px] text-zinc-500 hover:text-zinc-300 bg-zinc-900 border border-zinc-800 rounded hover:border-zinc-700 transition-all"
            >
              <Activity className="w-3 h-3" />
              All Builds
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[10px] text-zinc-500 hover:text-zinc-300 bg-zinc-900 border border-zinc-800 rounded hover:border-zinc-700 transition-all"
            >
              <Github className="w-3 h-3" />
              GitHub
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}

// =============================================================================
// CAPABILITY ROW
// =============================================================================

function Capability({ 
  icon: Icon, 
  label, 
  enabled 
}: { 
  icon: typeof Code2
  label: string
  enabled: boolean
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <div className="flex items-center gap-2">
        <Icon className={`w-3 h-3 ${enabled ? 'text-zinc-500' : 'text-zinc-600'}`} />
        <span className={`text-[11px] ${enabled ? 'text-zinc-400' : 'text-zinc-600'}`}>{label}</span>
      </div>
      {enabled ? (
        <CheckCircle2 className="w-3 h-3 text-zinc-500" />
      ) : (
        <X className="w-3 h-3 text-zinc-700" />
      )}
    </div>
  )
}
