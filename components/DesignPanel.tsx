'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sliders, ChevronDown, Lock, Check } from 'lucide-react'
import { DesignTokens, defaultTokens, tokenPresets } from '@/lib/tokens'

interface DesignPanelProps {
  tokens: DesignTokens
  onChange: (tokens: DesignTokens) => void
  isLocked?: boolean
  onUpgrade?: () => void
}

// Detect which preset matches current tokens (if any)
function detectActivePreset(tokens: DesignTokens): string | null {
  for (const [name, preset] of Object.entries(tokenPresets)) {
    let matches = true
    for (const [key, value] of Object.entries(preset)) {
      if (tokens[key as keyof DesignTokens] !== value) {
        matches = false
        break
      }
    }
    if (matches) return name
  }
  return null
}

export default function DesignPanel({ tokens, onChange, isLocked = false, onUpgrade }: DesignPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [justApplied, setJustApplied] = useState<string | null>(null)
  const presetsRef = useRef<HTMLDivElement>(null)

  // Detect active preset when tokens change
  useEffect(() => {
    setActivePreset(detectActivePreset(tokens))
  }, [tokens])

  const updateToken = <K extends keyof DesignTokens>(key: K, value: DesignTokens[K]) => {
    if (isLocked) return
    onChange({ ...tokens, [key]: value })
  }

  const applyPreset = (presetName: string) => {
    if (isLocked) return
    const preset = tokenPresets[presetName]
    if (preset) {
      onChange({ ...tokens, ...preset })
      setJustApplied(presetName)
      setTimeout(() => setJustApplied(null), 600)
    }
  }

  return (
    <div className="border-t border-zinc-800/40">
      {/* Toggle Header - More compact */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-zinc-900/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sliders className="w-3 h-3 text-zinc-500" />
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">Design</span>
          {isLocked && <Lock className="w-2.5 h-2.5 text-amber-400" />}
        </div>
        <ChevronDown className={`w-3 h-3 text-zinc-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Panel Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {isLocked ? (
              <div className="px-3 py-4 text-center">
                <Lock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-xs text-zinc-500 mb-2">Unlock with Visionary</p>
                <button
                  onClick={onUpgrade}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-medium rounded transition-colors"
                >
                  Upgrade
                </button>
              </div>
            ) : (
              <div className="px-3 pb-3 space-y-3">
                {/* Presets - Compact */}
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1.5 block">Presets</label>
                  <div 
                    ref={presetsRef}
                    className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {Object.keys(tokenPresets).map((name) => {
                      const isActive = activePreset === name
                      const wasJustApplied = justApplied === name
                      
                      return (
                        <motion.button
                          key={name}
                          onClick={() => applyPreset(name)}
                          whileTap={{ scale: 0.95 }}
                          animate={wasJustApplied ? { scale: [1, 1.05, 1], transition: { duration: 0.3 } } : {}}
                          className={`relative flex-shrink-0 px-2 py-1 text-[10px] rounded border transition-all capitalize ${
                            isActive
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                              : 'bg-zinc-800/60 border-zinc-700/40 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400'
                          }`}
                        >
                          {isActive && <Check className="w-2 h-2 inline mr-1" />}
                          {name}
                          {wasJustApplied && (
                            <motion.div
                              initial={{ opacity: 0.6, scale: 1 }}
                              animate={{ opacity: 0, scale: 1.4 }}
                              transition={{ duration: 0.4 }}
                              className="absolute inset-0 rounded bg-emerald-500/30"
                            />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Sliders - Compact */}
                <SliderControl
                  label="Padding"
                  value={tokens.sectionPadding}
                  min={32}
                  max={128}
                  step={1}
                  unit="px"
                  onChange={(v) => updateToken('sectionPadding', v)}
                />

                <SliderControl
                  label="Radius"
                  value={tokens.borderRadius}
                  min={0}
                  max={32}
                  step={1}
                  unit="px"
                  onChange={(v) => updateToken('borderRadius', v)}
                />

                <SliderControl
                  label="Gap"
                  value={tokens.componentGap}
                  min={4}
                  max={48}
                  step={1}
                  unit="px"
                  onChange={(v) => updateToken('componentGap', v)}
                />

                <SliderControl
                  label="Headings"
                  value={tokens.headingSizeMultiplier}
                  min={0.7}
                  max={1.6}
                  step={0.05}
                  unit="x"
                  onChange={(v) => updateToken('headingSizeMultiplier', Math.round(v * 100) / 100)}
                  formatValue={(v) => v.toFixed(2)}
                />

                <SliderControl
                  label="Body Text"
                  value={tokens.bodySizeMultiplier ?? 1}
                  min={0.8}
                  max={1.3}
                  step={0.05}
                  unit="x"
                  onChange={(v) => updateToken('bodySizeMultiplier', Math.round(v * 100) / 100)}
                  formatValue={(v) => v.toFixed(2)}
                />

                <SliderControl
                  label="Buttons"
                  value={tokens.buttonScale ?? 1}
                  min={0.7}
                  max={1.4}
                  step={0.05}
                  unit="x"
                  onChange={(v) => updateToken('buttonScale', Math.round(v * 100) / 100)}
                  formatValue={(v) => v.toFixed(2)}
                />

                <SliderControl
                  label="Icons"
                  value={tokens.iconScale ?? 1}
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  unit="x"
                  onChange={(v) => updateToken('iconScale', Math.round(v * 100) / 100)}
                  formatValue={(v) => v.toFixed(2)}
                />

                {/* Shadow - Inline */}
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1 block">Shadow</label>
                  <div className="flex gap-1">
                    {(['none', 'subtle', 'medium', 'strong'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => updateToken('shadowIntensity', level)}
                        className={`flex-1 px-1.5 py-1 text-[10px] rounded border transition-all capitalize ${
                          tokens.shadowIntensity === level
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                            : 'bg-zinc-800/60 border-zinc-700/40 text-zinc-600 hover:text-zinc-400'
                        }`}
                      >
                        {level === 'none' ? '—' : level.charAt(0).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Weight - Inline */}
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1 block">Weight</label>
                  <div className="flex gap-1">
                    {(['normal', 'medium', 'semibold', 'bold'] as const).map((weight) => (
                      <button
                        key={weight}
                        onClick={() => updateToken('fontWeight', weight)}
                        className={`flex-1 px-1.5 py-1 text-[10px] rounded border transition-all ${
                          tokens.fontWeight === weight
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                            : 'bg-zinc-800/60 border-zinc-700/40 text-zinc-600 hover:text-zinc-400'
                        }`}
                      >
                        {weight.charAt(0).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Compact slider with custom styling
function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  formatValue,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (value: number) => void
  formatValue?: (value: number) => string
}) {
  const percentage = ((value - min) / (max - min)) * 100
  const displayValue = formatValue ? formatValue(value) : value.toString()

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[9px] uppercase tracking-wider text-zinc-600">{label}</label>
        <span className="text-[10px] text-emerald-400/70 font-mono tabular-nums">{displayValue}{unit}</span>
      </div>
      <div className="relative h-4 flex items-center">
        <div className="absolute inset-x-0 h-1 bg-zinc-800 rounded-full" />
        <div 
          className="absolute left-0 h-1 bg-emerald-500/80 rounded-full transition-all duration-75"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label={label}
        />
        <div 
          className="absolute w-3 h-3 bg-emerald-500 rounded-full shadow pointer-events-none transition-all duration-75"
          style={{ left: `calc(${percentage}% - 6px)` }}
        />
      </div>
    </div>
  )
}
