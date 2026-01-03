'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Box, ArrowRight, Trash2, ExternalLink, Calendar, Clock, Crown, Zap, Star, Lock, Terminal } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { formatDistanceToNow } from 'date-fns'

export default function ProjectsPage() {
  const { projects, createProject, deleteProject, switchProject, accountSubscription } = useProjects()
  const [isCreating, setIsCreating] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)

  // Tier config for display
  const tierConfig = useMemo(() => {
    const tier = accountSubscription?.tier
    if (tier === 'singularity') return { name: 'Singularity', color: 'amber', icon: Crown, limit: Infinity, gradient: 'from-amber-500 to-orange-500' }
    if (tier === 'visionary') return { name: 'Visionary', color: 'violet', icon: Zap, limit: Infinity, gradient: 'from-violet-500 to-purple-500' }
    if (tier === 'architect') return { name: 'Architect', color: 'emerald', icon: Terminal, limit: 3, gradient: 'from-emerald-500 to-teal-500' }
    return { name: 'No Plan', color: 'zinc', icon: Terminal, limit: 0, gradient: 'from-zinc-500 to-zinc-600' }
  }, [accountSubscription?.tier])

  const projectsRemaining = tierConfig.limit === Infinity ? '∞' : Math.max(0, tierConfig.limit - projects.length)
  const isAtLimit = tierConfig.limit !== Infinity && projects.length >= tierConfig.limit

  const handleCreate = () => {
    if (isAtLimit) {
      setShowLimitModal(true)
      return
    }
    setIsCreating(true)
    const success = createProject()
    if (!success) {
      setShowLimitModal(true)
      setIsCreating(false)
    }
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this construct? This cannot be undone.')) {
      deleteProject(id)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with tier info */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Terminal</h1>
          <div className="flex items-center gap-3">
            <p className="text-zinc-400">Manage your digital constructs.</p>
            
            {/* Project counter */}
            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
              <span className="text-sm text-zinc-400">
                {projects.length} / {tierConfig.limit === Infinity ? '∞' : tierConfig.limit}
              </span>
              <span className="text-xs text-zinc-600">constructs</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Tier badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border`}
               style={{ 
                 backgroundColor: tierConfig.color === 'amber' ? 'rgba(245,158,11,0.1)' : 
                                  tierConfig.color === 'emerald' ? 'rgba(16,185,129,0.1)' : 
                                  tierConfig.color === 'lime' ? 'rgba(163,230,53,0.1)' : 'rgba(63,63,70,0.5)',
                 borderColor: tierConfig.color === 'amber' ? 'rgba(245,158,11,0.3)' : 
                              tierConfig.color === 'emerald' ? 'rgba(16,185,129,0.3)' : 
                              tierConfig.color === 'lime' ? 'rgba(163,230,53,0.3)' : 'rgba(63,63,70,0.5)'
               }}>
            <tierConfig.icon className="w-3.5 h-3.5" 
                            style={{ color: tierConfig.color === 'amber' ? '#fbbf24' : 
                                           tierConfig.color === 'emerald' ? '#34d399' : 
                                           tierConfig.color === 'lime' ? '#a3e635' : '#a1a1aa' }} />
            <span className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: tierConfig.color === 'amber' ? '#fbbf24' : 
                                 tierConfig.color === 'emerald' ? '#34d399' : 
                                 tierConfig.color === 'lime' ? '#a3e635' : '#a1a1aa' }}>
              {tierConfig.name}
            </span>
          </div>
          
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isAtLimit 
                ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isCreating ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isAtLimit ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isAtLimit ? 'Upgrade Access' : 'New Construct'}
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
          <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
            <Terminal className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No constructs yet</h3>
          <p className="text-zinc-400 mb-6 max-w-md text-center">
            Initialize your first digital construct to begin building.
          </p>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Initialize Construct
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const isLocked = tierConfig.name === 'No Plan'
            
            return (
              <div
                key={project.id}
                onClick={() => isLocked && setShowLimitModal(true)}
                className={`group relative block p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl transition-all ${
                  isLocked 
                    ? 'cursor-pointer' 
                    : 'hover:border-emerald-500/50 hover:bg-zinc-900 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                }`}
              >
                {!isLocked && (
                  <Link href={`/builder?project=${project.id}`} className="absolute inset-0 z-0" />
                )}

                {/* Lock Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/60 backdrop-blur-[2px] rounded-xl transition-opacity group-hover:bg-zinc-950/50">
                    <div className="flex flex-col items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl transform group-hover:scale-105 transition-transform">
                      <Lock className="w-5 h-5 text-zinc-500" />
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Locked</span>
                    </div>
                  </div>
                )}

                {/* Delete button */}
                {!isLocked && (
                  <button
                    onClick={(e) => handleDelete(e, project.id)}
                    className="absolute top-4 right-4 z-20 p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <div className="flex items-start justify-between mb-4 relative">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform ${
                    isLocked ? 'bg-zinc-800 border border-zinc-700' : 'bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110'
                  }`}>
                    <Terminal className={`w-5 h-5 ${isLocked ? 'text-zinc-600' : 'text-emerald-500'}`} />
                  </div>
                  <div className="flex items-center gap-2 pr-8">
                    {project.deployedSlug && (
                      <span className="px-2 py-1 rounded text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Live
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                      project.status === 'published' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {project.status || 'draft'}
                    </span>
                  </div>
                </div>

                <h3 className={`text-lg font-bold mb-2 transition-colors ${isLocked ? 'text-zinc-500' : 'text-white group-hover:text-emerald-400'}`}>
                  {project.name || 'Untitled Construct'}
                </h3>
                <p className="text-sm text-zinc-500 mb-6 line-clamp-2">
                  {project.description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between text-xs text-zinc-600 border-t border-zinc-800 pt-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {project.updatedAt 
                        ? formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })
                        : 'Just now'}
                    </span>
                  </div>
                  {!isLocked && (
                    <div className="flex items-center gap-1 text-emerald-500/0 group-hover:text-emerald-500 transition-colors transform translate-x-2 group-hover:translate-x-0">
                      <span className="font-medium">Open Builder</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* Limit reached modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLimitModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Lock className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
              <p className="text-zinc-400 text-sm">
                Select an access protocol to initialize your constructs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* Architect */}
              <Link href="/api/checkout?priceId=price_architect" className="group p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all">
                <div className="text-xs font-mono text-emerald-500 mb-2">ARCHITECT</div>
                <div className="text-2xl font-bold text-white mb-1">$19<span className="text-sm text-zinc-500 font-normal">/mo</span></div>
                <p className="text-xs text-zinc-400">Standard Access. 3 Constructs.</p>
              </Link>

              {/* Visionary */}
              <Link href="/api/checkout?priceId=price_visionary" className="group p-4 rounded-xl border border-violet-500/30 bg-violet-500/5 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-violet-500 text-[10px] font-bold text-white">POPULAR</div>
                <div className="text-xs font-mono text-violet-400 mb-2">VISIONARY</div>
                <div className="text-2xl font-bold text-white mb-1">$49<span className="text-sm text-zinc-500 font-normal">/mo</span></div>
                <p className="text-xs text-zinc-400">Priority Access. Unlimited Constructs.</p>
              </Link>

              {/* Singularity */}
              <Link href="/api/checkout?priceId=price_singularity" className="group p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all">
                <div className="text-xs font-mono text-amber-400 mb-2">SINGULARITY</div>
                <div className="text-2xl font-bold text-white mb-1">$199<span className="text-sm text-zinc-500 font-normal">/mo</span></div>
                <p className="text-xs text-zinc-400">Full System Access. White Label.</p>
              </Link>
            </div>

            <button
              onClick={() => setShowLimitModal(false)}
              className="w-full py-2.5 text-zinc-500 hover:text-white transition-colors text-sm"
            >
              Return to Terminal
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
