'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Type, Palette, Box, Move, RotateCcw } from 'lucide-react'
import type { SelectedElement } from './FullSitePreviewFrame'

interface ElementEditorProps {
  element: SelectedElement | null
  onClose: () => void
  onStyleChange: (property: string, value: string) => void
  onRegenerateSection?: (sectionId: string, instructions: string) => void
}

export default function ElementEditor({ element, onClose, onStyleChange, onRegenerateSection }: ElementEditorProps) {
  const [activeTab, setActiveTab] = useState<'typography' | 'spacing' | 'colors'>('typography')
  const [localStyles, setLocalStyles] = useState<Record<string, string>>({})
  
  // Reset local styles when element changes
  useEffect(() => {
    if (element) {
      setLocalStyles({
        fontSize: element.computedStyles.fontSize,
        fontWeight: element.computedStyles.fontWeight,
        color: element.computedStyles.color,
        backgroundColor: element.computedStyles.backgroundColor,
        padding: element.computedStyles.padding,
        margin: element.computedStyles.margin,
        borderRadius: element.computedStyles.borderRadius,
      })
    }
  }, [element])
  
  const handleStyleChange = (property: string, value: string) => {
    setLocalStyles(prev => ({ ...prev, [property]: value }))
    onStyleChange(property, value)
  }
  
  // Parse pixel values for sliders
  const parsePixelValue = (value: string) => {
    const match = value?.match(/^(\d+(?:\.\d+)?)/)
    return match ? parseFloat(match[1]) : 16
  }
  
  if (!element) return null
  
  const isTextElement = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'li', 'label'].includes(element.tagName)
  const isContainer = ['div', 'section', 'article', 'main', 'header', 'footer', 'nav'].includes(element.tagName)
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute bottom-4 left-4 right-4 z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/95">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400">&lt;{element.tagName}&gt;</span>
            {element.textContent && (
              <span className="text-xs text-zinc-500 truncate max-w-[150px]">
                "{element.textContent.slice(0, 30)}{element.textContent.length > 30 ? '...' : ''}"
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded" title="Close editor">
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
          {isTextElement && (
            <button
              onClick={() => setActiveTab('typography')}
              className={`flex-1 px-3 py-2 text-xs flex items-center justify-center gap-1.5 ${
                activeTab === 'typography' ? 'text-white bg-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Type className="w-3 h-3" /> Text
            </button>
          )}
          <button
            onClick={() => setActiveTab('spacing')}
            className={`flex-1 px-3 py-2 text-xs flex items-center justify-center gap-1.5 ${
              activeTab === 'spacing' ? 'text-white bg-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Box className="w-3 h-3" /> Spacing
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex-1 px-3 py-2 text-xs flex items-center justify-center gap-1.5 ${
              activeTab === 'colors' ? 'text-white bg-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Palette className="w-3 h-3" /> Colors
          </button>
        </div>
        
        {/* Content */}
        <div className="p-3 space-y-3 max-h-[200px] overflow-y-auto">
          {activeTab === 'typography' && isTextElement && (
            <>
              {/* Font Size */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">
                  Font Size
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="72"
                    value={parsePixelValue(localStyles.fontSize)}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value + 'px')}
                    className="flex-1 h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer"
                    title="Adjust font size"
                  />
                  <span className="text-xs text-zinc-400 w-12 text-right font-mono">
                    {parsePixelValue(localStyles.fontSize)}px
                  </span>
                </div>
              </div>
              
              {/* Font Weight */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">
                  Font Weight
                </label>
                <div className="flex gap-1">
                  {[
                    { value: '400', label: 'Normal' },
                    { value: '500', label: 'Medium' },
                    { value: '600', label: 'Semi' },
                    { value: '700', label: 'Bold' },
                  ].map((w) => (
                    <button
                      key={w.value}
                      onClick={() => handleStyleChange('fontWeight', w.value)}
                      className={`flex-1 px-2 py-1.5 text-[10px] rounded border ${
                        localStyles.fontWeight === w.value
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'border-zinc-700 text-zinc-500 hover:border-zinc-600'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'spacing' && (
            <>
              {/* Padding */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">
                  Padding
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="64"
                    value={parsePixelValue(localStyles.padding)}
                    onChange={(e) => handleStyleChange('padding', e.target.value + 'px')}
                    className="flex-1 h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer"
                    title="Adjust padding"
                  />
                  <span className="text-xs text-zinc-400 w-12 text-right font-mono">
                    {parsePixelValue(localStyles.padding)}px
                  </span>
                </div>
              </div>
              
              {/* Margin */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">
                  Margin
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="64"
                    value={parsePixelValue(localStyles.margin)}
                    onChange={(e) => handleStyleChange('margin', e.target.value + 'px')}
                    className="flex-1 h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer"
                    title="Adjust margin"
                  />
                  <span className="text-xs text-zinc-400 w-12 text-right font-mono">
                    {parsePixelValue(localStyles.margin)}px
                  </span>
                </div>
              </div>
              
              {/* Border Radius */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">
                  Corners
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="32"
                    value={parsePixelValue(localStyles.borderRadius)}
                    onChange={(e) => handleStyleChange('borderRadius', e.target.value + 'px')}
                    className="flex-1 h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer"
                    title="Adjust corner radius"
                  />
                  <span className="text-xs text-zinc-400 w-12 text-right font-mono">
                    {parsePixelValue(localStyles.borderRadius)}px
                  </span>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'colors' && (
            <>
              {/* Text Color */}
              {isTextElement && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">
                    Text Color
                  </label>
                  <div className="flex gap-1.5">
                    {['#ffffff', '#a1a1aa', '#71717a', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleStyleChange('color', color)}
                        className="w-6 h-6 rounded border border-zinc-700 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                    <input
                      type="color"
                      value={localStyles.color?.startsWith('#') ? localStyles.color : '#ffffff'}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent"
                      title="Custom color"
                    />
                  </div>
                </div>
              )}
              
              {/* Background Color */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">
                  Background
                </label>
                <div className="flex gap-1.5">
                  {['transparent', '#09090b', '#18181b', '#27272a', '#10b981', '#3b82f6'].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleStyleChange('backgroundColor', color)}
                      className={`w-6 h-6 rounded border border-zinc-700 hover:scale-110 transition-transform ${
                        color === 'transparent' ? 'bg-[linear-gradient(45deg,#27272a_25%,transparent_25%,transparent_75%,#27272a_75%),linear-gradient(45deg,#27272a_25%,transparent_25%,transparent_75%,#27272a_75%)] bg-[length:8px_8px] bg-[position:0_0,4px_4px]' : ''
                      }`}
                      style={{ backgroundColor: color === 'transparent' ? undefined : color }}
                      title={color}
                    />
                  ))}
                  <input
                    type="color"
                    value={localStyles.backgroundColor?.startsWith('#') ? localStyles.backgroundColor : '#000000'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent"
                    title="Custom color"
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Footer with AI regenerate option */}
        {onRegenerateSection && element.sectionId && (
          <div className="px-3 py-2 border-t border-zinc-800 bg-zinc-900/50">
            <button
              onClick={() => onRegenerateSection(element.sectionId, `Modify the ${element.tagName} element to match my style changes`)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Bake changes into code
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
