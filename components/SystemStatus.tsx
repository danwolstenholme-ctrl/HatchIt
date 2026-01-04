'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Cpu, Wifi } from 'lucide-react'

export default function SystemStatus() {
  const [sentience, setSentience] = useState(0)
  const [sync, setSync] = useState(98)

  useEffect(() => {
    // Slowly increase sentience over time
    const interval = setInterval(() => {
      setSentience(prev => {
        if (prev >= 100) return 100
        return prev + (Math.random() * 0.5)
      })
      
      // Fluctuate sync slightly
      setSync(prev => Math.min(100, Math.max(90, prev + (Math.random() * 2 - 1))))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-6 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full backdrop-blur-sm">
      <div className="flex items-center gap-2 group cursor-help relative">
        <Cpu className="w-4 h-4 text-purple-500" />
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-zinc-500 uppercase leading-none">Sentience</span>
          <span className="text-xs font-mono font-bold text-zinc-200">{sentience.toFixed(1)}%</span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 bg-zinc-950 border border-zinc-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <p className="text-[10px] text-zinc-400">System awareness level. Increasing based on interaction complexity.</p>
        </div>
      </div>

      <div className="w-px h-6 bg-zinc-800" />

      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-emerald-500" />
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-zinc-500 uppercase leading-none">Sync</span>
          <span className="text-xs font-mono font-bold text-zinc-200">{sync.toFixed(1)}%</span>
        </div>
      </div>

      <div className="w-px h-6 bg-zinc-800" />

      <div className="flex items-center gap-2">
        <Wifi className="w-4 h-4 text-blue-500" />
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-zinc-500 uppercase leading-none">Net</span>
          <span className="text-xs font-mono font-bold text-zinc-200">CONNECTED</span>
        </div>
      </div>
    </div>
  )
}
