'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, GitBranch, History, RotateCcw, Save } from 'lucide-react'

interface Snapshot {
  id: string
  timestamp: string
  label: string
  changes: string[]
  hash: string
}

const SNAPSHOTS: Snapshot[] = [
  {
    id: 'snap-004',
    timestamp: 'Just now',
    label: 'CURRENT_REALITY',
    changes: ['System optimization', 'UI refinement'],
    hash: '8f4a2c1'
  },
  {
    id: 'snap-003',
    timestamp: '2 hours ago',
    label: 'BRAND_INTEGRATION',
    changes: ['Logo update', 'Color palette sync'],
    hash: '3b1d9e2'
  },
  {
    id: 'snap-002',
    timestamp: 'Yesterday, 14:30',
    label: 'CORE_SYSTEM_UPDATE',
    changes: ['Next.js migration', 'Performance boost'],
    hash: '7c2a5f8'
  },
  {
    id: 'snap-001',
    timestamp: '2 days ago',
    label: 'GENESIS_BLOCK',
    changes: ['Initial commit', 'Project scaffolding'],
    hash: '1a0b3c4'
  }
]

export default function ChronospherePage() {
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot>(SNAPSHOTS[0])
  const [isRestoring, setIsRestoring] = useState(false)

  const handleRestore = () => {
    setIsRestoring(true)
    setTimeout(() => setIsRestoring(false), 2000)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-mono font-bold text-zinc-100 flex items-center gap-3">
            <History className="w-6 h-6 text-purple-500" />
            CHRONOSPHERE
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Temporal manipulation and version control system.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-xs font-mono text-purple-400">TIMELINE_STABLE</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        {/* Timeline List */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 backdrop-blur-sm overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {SNAPSHOTS.map((snap) => (
              <button
                key={snap.id}
                onClick={() => setSelectedSnapshot(snap)}
                className={`w-full p-4 rounded-lg border text-left transition-all group relative overflow-hidden ${
                  selectedSnapshot.id === snap.id
                    ? 'bg-purple-500/10 border-purple-500/50'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-xs ${selectedSnapshot.id === snap.id ? 'text-purple-400' : 'text-zinc-500'}`}>
                    {snap.timestamp}
                  </span>
                  <span className="font-mono text-xs text-zinc-600">#{snap.hash}</span>
                </div>
                <h3 className={`font-bold font-mono mb-1 ${selectedSnapshot.id === snap.id ? 'text-zinc-100' : 'text-zinc-400'}`}>
                  {snap.label}
                </h3>
                
                {selectedSnapshot.id === snap.id && (
                  <motion.div
                    layoutId="active-glow"
                    className="absolute inset-0 bg-purple-500/5 pointer-events-none"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview / Details */}
        <div className="lg:col-span-2 flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-lg backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/30">
            <div className="flex items-center gap-3">
              <GitBranch className="w-5 h-5 text-zinc-500" />
              <span className="font-mono font-bold text-zinc-200">{selectedSnapshot.label}</span>
            </div>
            <span className="font-mono text-xs text-zinc-500">ID: {selectedSnapshot.id}</span>
          </div>

          <div className="flex-1 p-8 flex flex-col items-center justify-center relative">
            {/* Abstract Visualization */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="w-64 h-64 border border-purple-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute w-48 h-48 border border-emerald-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute w-32 h-32 border border-amber-500/30 rounded-full animate-[spin_20s_linear_infinite]" />
            </div>

            <div className="relative z-10 max-w-md w-full space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-mono text-zinc-500 uppercase tracking-wider">Recorded Variances</h4>
                <ul className="space-y-3">
                  {selectedSnapshot.changes.map((change, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-300 bg-zinc-950/50 p-3 rounded border border-zinc-800/50">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 border-t border-zinc-800/50">
                <button
                  onClick={handleRestore}
                  disabled={isRestoring || selectedSnapshot.id === SNAPSHOTS[0].id}
                  className="w-full py-4 bg-zinc-100 hover:bg-white text-zinc-950 font-bold font-mono rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isRestoring ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      REWRITING_TIMELINE...
                    </>
                  ) : selectedSnapshot.id === SNAPSHOTS[0].id ? (
                    <>
                      <Clock className="w-4 h-4" />
                      CURRENT_STATE_ACTIVE
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                      RESTORE_SNAPSHOT
                    </>
                  )}
                </button>
                {selectedSnapshot.id !== SNAPSHOTS[0].id && (
                  <p className="text-center text-xs text-red-400/70 mt-3 font-mono">
                    WARNING: This action will overwrite current reality.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
