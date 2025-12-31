'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Play, Code, Cpu, Zap, Layout, Type, Box } from 'lucide-react'
import { parseArchitect, compileToReact, ArchitectNode } from '@/lib/architect-lang'

// =============================================================================
// THE RENDERER
// Recursively renders the parsed Architect Node Tree into actual React components
// =============================================================================

const Renderer = ({ nodes }: { nodes: ArchitectNode[] }) => {
  return (
    <>
      {nodes.map((node, i) => {
        const key = `${node.type}-${i}`
        
        switch (node.type.toUpperCase()) {
          case 'SECTION':
            return (
              <section key={key} className="py-20 px-6 bg-zinc-950 text-white border-b border-zinc-900">
                <Renderer nodes={node.children} />
              </section>
            )
          case 'HERO':
            return (
              <header key={key} className="min-h-[60vh] flex flex-col justify-center items-center text-center bg-zinc-950 relative overflow-hidden border-b border-zinc-900 p-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent_50%)]" />
                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                  <Renderer nodes={node.children} />
                </div>
              </header>
            )
          case 'GRID':
            return (
              <div key={key} className={`grid grid-cols-1 md:grid-cols-${node.props.cols || '3'} gap-${node.props.gap || '6'} w-full max-w-6xl mx-auto my-8`}>
                <Renderer nodes={node.children} />
              </div>
            )
          case 'CARD':
            return (
              <motion.div 
                key={key}
                whileHover={{ y: -5 }}
                className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-colors group"
              >
                {node.props.title && <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">{node.props.title}</h3>}
                {node.content && <p className="text-zinc-400 text-sm">{node.content}</p>}
                <Renderer nodes={node.children} />
              </motion.div>
            )
          case 'TITLE':
            const size = node.props.size || '4xl'
            const isGradient = node.props.gradient
            return (
              <h2 key={key} className={`text-${size} font-bold mb-6 ${isGradient ? `bg-gradient-to-r from-${node.props.gradient}-400 to-teal-400 bg-clip-text text-transparent` : 'text-white'}`}>
                {node.content}
                <Renderer nodes={node.children} />
              </h2>
            )
          case 'SUB':
          case 'TEXT':
            return (
              <p key={key} className="text-zinc-400 leading-relaxed mb-6 max-w-2xl text-lg">
                {node.content}
                <Renderer nodes={node.children} />
              </p>
            )
          case 'ROW':
            return (
              <div key={key} className="flex flex-wrap gap-4 items-center justify-center my-6">
                <Renderer nodes={node.children} />
              </div>
            )
          case 'BTN':
            const variant = node.props.variant === 'ghost' 
              ? 'bg-transparent border border-zinc-700 hover:bg-zinc-800 text-zinc-300' 
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
            return (
              <button key={key} className={`px-6 py-3 rounded-lg font-medium transition-all active:scale-95 flex items-center gap-2 ${variant}`}>
                {node.props.icon && <span className="text-lg">⚡</span>}
                {node.content}
              </button>
            )
          case 'ICON':
             return (
               <div key={key} className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 text-emerald-400">
                 <Zap className="w-6 h-6" />
               </div>
             )
          default:
            return (
              <div key={key} className="text-red-500 text-xs border border-red-500/20 bg-red-500/10 p-2 rounded">
                Unknown Token: {node.type}
              </div>
            )
        }
      })}
    </>
  )
}

const DEFAULT_CODE = `HERO [h:screen] {
  TITLE "The Architect Language" [size:6xl gradient:emerald]
  SUB "A structural DSL for rapid interface synthesis. Type on the left, see reality on the right."
  ROW {
    BTN "Initialize System" [variant:primary icon:zap]
    BTN "Read Documentation" [variant:ghost]
  }
}

SECTION {
  TITLE "Core Primitives" [size:3xl]
  GRID [cols:3 gap:6] {
    CARD [title:"Structural"] "Define layout with GRID, ROW, and COL tags."
    CARD [title:"Visual"] "Style with props like [gradient:purple] or [size:xl]."
    CARD [title:"Interactive"] "Bind actions to BTN and INPUT elements."
  }
}`

export default function LanguagePage() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [tree, setTree] = useState<ArchitectNode[]>([])
  const [reactCode, setReactCode] = useState('')
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')

  useEffect(() => {
    try {
      const nodes = parseArchitect(code)
      setTree(nodes)
      setReactCode(compileToReact(nodes))
    } catch (e) {
      console.error("Parse error", e)
    }
  }, [code])

  return (
    <main className="h-screen w-full bg-zinc-950 flex flex-col md:flex-row overflow-hidden">
      {/* LEFT: EDITOR */}
      <div className="w-full md:w-1/2 flex flex-col border-r border-zinc-800">
        <div className="h-12 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-emerald-500 font-mono text-sm">
            <Terminal className="w-4 h-4" />
            <span>ARCHITECT_LANG // EDITOR</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-zinc-500">LIVE_COMPILATION_ACTIVE</span>
          </div>
        </div>
        
        <div className="flex-1 relative bg-zinc-950">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="absolute inset-0 w-full h-full bg-transparent text-zinc-300 font-mono text-sm p-6 resize-none focus:outline-none leading-relaxed selection:bg-emerald-500/30"
            spellCheck={false}
          />
        </div>

        {/* Quick Reference */}
        <div className="h-48 bg-zinc-900 border-t border-zinc-800 p-4 overflow-y-auto">
          <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Syntax Reference</h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-400"><Layout className="w-3 h-3" /> <span>SECTION {'{ ... }'}</span></div>
            <div className="flex items-center gap-2 text-zinc-400"><Box className="w-3 h-3" /> <span>GRID [cols:3] {'{ ... }'}</span></div>
            <div className="flex items-center gap-2 text-zinc-400"><Type className="w-3 h-3" /> <span>TITLE "Text" [size:xl]</span></div>
            <div className="flex items-center gap-2 text-zinc-400"><Zap className="w-3 h-3" /> <span>BTN "Label" [variant:ghost]</span></div>
          </div>
        </div>
      </div>

      {/* RIGHT: PREVIEW / OUTPUT */}
      <div className="w-full md:w-1/2 flex flex-col bg-black">
        <div className="h-12 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4">
          <div className="flex gap-1">
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 ${activeTab === 'preview' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Play className="w-3 h-3" /> Preview
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 ${activeTab === 'code' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Code className="w-3 h-3" /> Compiled JSX
            </button>
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            {tree.length} NODES RENDERED
          </div>
        </div>

        <div className="flex-1 overflow-y-auto relative">
          {activeTab === 'preview' ? (
            <div className="min-h-full bg-zinc-950">
              <Renderer nodes={tree} />
            </div>
          ) : (
            <div className="p-6">
              <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                {reactCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
