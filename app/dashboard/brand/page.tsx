'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, Palette, RefreshCw, Type, Wand2 } from 'lucide-react'

export default function BrandSystemPage() {
  const [isRegenerating, setIsRegenerating] = useState(false)
  
  const handleRegenerate = () => {
    setIsRegenerating(true)
    setTimeout(() => setIsRegenerating(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-zinc-100">BRAND_SYSTEM_MATRIX</h1>
          <p className="text-zinc-400 text-sm mt-1">Visual identity parameters and assets.</p>
        </div>
        <button 
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-md font-mono text-sm font-bold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          {isRegenerating ? 'RECALCULATING...' : 'REGENERATE_ALL'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logo Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors">
                <Wand2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-32 h-32 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center mb-6 relative group-hover:border-emerald-500/50 transition-colors">
                <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500 relative z-10">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold font-mono tracking-widest">NEXUS_CORP</h2>
            </div>
          </div>

          {/* Typography */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Type className="w-5 h-5 text-purple-500" />
              <h3 className="font-mono font-bold">TYPOGRAPHY_STACK</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-xs font-mono text-zinc-500 uppercase">Primary (Headings)</span>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <p className="text-2xl font-bold font-mono">Space Mono</p>
                  <p className="text-zinc-500 text-sm mt-1">Aa Bb Cc 123</p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono text-zinc-500 uppercase">Secondary (Body)</span>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <p className="text-2xl font-sans">Inter</p>
                  <p className="text-zinc-500 text-sm mt-1">The quick brown fox jumps over the lazy dog.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 backdrop-blur-sm h-full">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="w-5 h-5 text-emerald-500" />
              <h3 className="font-mono font-bold">CHROMATIC_DATA</h3>
            </div>

            <div className="space-y-4">
              <ColorSwatch hex="#10B981" name="Emerald (Primary)" />
              <ColorSwatch hex="#09090B" name="Zinc 950 (Background)" />
              <ColorSwatch hex="#27272A" name="Zinc 800 (Border)" />
              <ColorSwatch hex="#A1A1AA" name="Zinc 400 (Text)" />
              <ColorSwatch hex="#F59E0B" name="Amber 500 (Warning)" />
              <ColorSwatch hex="#EF4444" name="Red 500 (Error)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ColorSwatch({ hex, name }: { hex: string; name: string }) {
  return (
    <div className="group flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer">
      <div 
        className="w-12 h-12 rounded-lg border border-zinc-700 shadow-lg"
        style={{ backgroundColor: hex }}
      />
      <div className="flex-1">
        <p className="font-mono font-bold text-sm text-zinc-200">{hex}</p>
        <p className="text-xs text-zinc-500">{name}</p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-white transition-all">
        <Copy className="w-4 h-4" />
      </button>
    </div>
  )
}
