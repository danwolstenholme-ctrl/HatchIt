'use client'

import { motion } from 'framer-motion'

export default function BuilderLoading() {
  return (
    <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-400 text-sm font-mono">Initializing The Architect...</p>
    </div>
  )
}
