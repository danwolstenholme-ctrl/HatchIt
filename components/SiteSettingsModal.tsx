import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Globe, Palette, Plug, Layout, Sparkles, Lock, ArrowRight, Cpu, Code2, Database, Zap } from 'lucide-react'
import { DbBrandConfig } from '@/lib/supabase'

interface SiteSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  currentBrand?: DbBrandConfig
  onSave: (settings: SiteSettings) => Promise<void>
  projectName?: string
  currentSectionName?: string
  thought?: string
  demoMode?: boolean
  promptsUsed?: number
  promptsLimit?: number
  onUpgrade?: () => void
}

export interface SiteSettings {
  seo: {
    title: string
    description: string
    keywords: string
  }
  brand: {
    primaryColor: string
    font: string
    mode: 'dark' | 'light'
  }
  integrations: {
    formspreeId: string
  }
}

export default function SiteSettingsModal({
  isOpen,
  onClose,
  projectId,
  currentBrand,
  onSave,
  projectName,
  currentSectionName,
  thought,
  demoMode,
  promptsUsed = 0,
  promptsLimit,
  onUpgrade
}: SiteSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'seo' | 'brand' | 'integrations'>('seo')
  const [isSaving, setIsSaving] = useState(false)
  
  const [settings, setSettings] = useState<SiteSettings>({
    seo: {
      title: '',
      description: '',
      keywords: ''
    },
    brand: {
      primaryColor: currentBrand?.colors?.primary || '#10b981',
      font: currentBrand?.fontStyle || 'Inter',
      mode: 'dark'
    },
    integrations: {
      formspreeId: ''
    }
  })

  const isDemoPreview = !projectId || !!demoMode
  const activeSectionLabel = currentSectionName || 'Live builder session'
  const limitedCredits = typeof promptsLimit === 'number' && promptsLimit > 0
  const creditsRemaining = limitedCredits ? Math.max(promptsLimit - promptsUsed, 0) : null
  const creditFill = limitedCredits && promptsLimit
    ? Math.min((promptsUsed / promptsLimit) * 100, 100)
    : 0
  const stackSummary = [
    { icon: Code2, label: 'React 18', meta: 'Components & hooks' },
    { icon: Cpu, label: 'Next.js 14', meta: 'App Router, streaming' },
    { icon: Database, label: 'Supabase', meta: 'Auth + data layer' }
  ]

  // Load settings from local storage or DB (mocked for now, would fetch from DB in real impl)
  useEffect(() => {
    if (isOpen) {
      // In a real app, fetch these from the DB based on projectId
      const savedSettings = localStorage.getItem(`site_settings_${projectId}`)
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      } else if (currentBrand) {
        setSettings(prev => ({
          ...prev,
          brand: {
            primaryColor: currentBrand.colors?.primary || prev.brand.primaryColor,
            font: currentBrand.fontStyle || prev.brand.font,
            mode: 'dark'
          }
        }))
      }
    }
  }, [isOpen, projectId, currentBrand])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to local storage for persistence across reloads
      localStorage.setItem(`site_settings_${projectId}`, JSON.stringify(settings))
      
      // Pass up to parent to handle DB saving / context updates
      await onSave(settings)
      onClose()
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl rounded-3xl border border-white/10 bg-zinc-950/95 shadow-[0_40px_140px_rgba(0,0,0,0.65)] overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6 border-b border-white/5 bg-gradient-to-r from-zinc-950 via-black to-zinc-950">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-500">Project console</p>
                  <h2 className="text-2xl font-semibold text-white mt-2">{projectName || 'Untitled Project'}</h2>
                  <p className="text-sm text-zinc-400 mt-2">
                    {thought || `Currently focused on ${activeSectionLabel}.`}
                  </p>
                </div>
                <button onClick={onClose} aria-label="Close settings" className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 bg-white/5 text-white/80">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Text to React factory
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                  <Layout className="w-3 h-3" />
                  {demoMode ? 'Demo sandbox' : 'Production build'}
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_0.8fr] divide-y lg:divide-y-0 lg:divide-x divide-white/5">
              <div className="p-6 space-y-5">
                <div className="rounded-2xl border border-white/5 bg-white/5 px-5 py-4">
                  <div className="flex items-center justify-between text-sm text-zinc-300">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Active step</p>
                      <p className="text-white text-lg font-semibold mt-1">{activeSectionLabel}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Status</p>
                      <p className="text-emerald-400 font-semibold mt-1">{demoMode ? 'Demo build' : 'Live project'}</p>
                    </div>
                  </div>
                </div>

                {!isDemoPreview ? (
                  <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
                    <div className="flex border-b border-white/5">
                      <button
                        onClick={() => setActiveTab('seo')}
                        className={`flex-1 py-3 text-sm font-semibold tracking-wide uppercase transition-all flex items-center justify-center gap-2 ${
                          activeTab === 'seo' ? 'text-white bg-white/5' : 'text-zinc-500 hover:text-zinc-200'
                        }`}
                      >
                        <Globe className="w-4 h-4" />
                        SEO & Meta
                      </button>
                      <button
                        onClick={() => setActiveTab('brand')}
                        className={`flex-1 py-3 text-sm font-semibold tracking-wide uppercase transition-all flex items-center justify-center gap-2 ${
                          activeTab === 'brand' ? 'text-white bg-white/5' : 'text-zinc-500 hover:text-zinc-200'
                        }`}
                      >
                        <Palette className="w-4 h-4" />
                        Brand & Style
                      </button>
                      <button
                        onClick={() => setActiveTab('integrations')}
                        className={`flex-1 py-3 text-sm font-semibold tracking-wide uppercase transition-all flex items-center justify-center gap-2 ${
                          activeTab === 'integrations' ? 'text-white bg-white/5' : 'text-zinc-500 hover:text-zinc-200'
                        }`}
                      >
                        <Plug className="w-4 h-4" />
                        Integrations
                      </button>
                    </div>
                    <div className="p-5 space-y-5">
                      {activeTab === 'seo' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Site title</label>
                            <input
                              type="text"
                              value={settings.seo.title}
                              onChange={e => setSettings({...settings, seo: {...settings.seo, title: e.target.value}})}
                              placeholder="My Awesome Website"
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent outline-none"
                            />
                            <p className="text-xs text-zinc-500 mt-1">Appears in browser tabs and search previews.</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Meta description</label>
                            <textarea
                              value={settings.seo.description}
                              onChange={e => setSettings({...settings, seo: {...settings.seo, description: e.target.value}})}
                              placeholder="A brief description of your site..."
                              rows={3}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent outline-none resize-none"
                            />
                            <p className="text-xs text-zinc-500 mt-1">Recommended length: 150-160 characters.</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Keywords</label>
                            <input
                              type="text"
                              value={settings.seo.keywords}
                              onChange={e => setSettings({...settings, seo: {...settings.seo, keywords: e.target.value}})}
                              placeholder="react, website, builder, ai"
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent outline-none"
                            />
                            <p className="text-xs text-zinc-500 mt-1">Comma separated keywords.</p>
                          </div>
                        </div>
                      )}

                      {activeTab === 'brand' && (
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Primary color</label>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={settings.brand.primaryColor}
                                onChange={e => setSettings({...settings, brand: {...settings.brand, primaryColor: e.target.value}})}
                                aria-label="Primary color picker"
                                className="w-12 h-12 rounded-xl cursor-pointer border border-white/10 bg-transparent"
                              />
                              <input
                                type="text"
                                value={settings.brand.primaryColor}
                                onChange={e => setSettings({...settings, brand: {...settings.brand, primaryColor: e.target.value}})}
                                aria-label="Primary color hex value"
                                placeholder="#10b981"
                                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono uppercase w-36"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Typography</label>
                            <select
                              value={settings.brand.font}
                              onChange={e => setSettings({...settings, brand: {...settings.brand, font: e.target.value}})}
                              aria-label="Typography font selection"
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/60 outline-none"
                            >
                              <option value="Inter">Inter (Clean, Modern)</option>
                              <option value="Playfair Display">Playfair Display (Elegant, Serif)</option>
                              <option value="Roboto Mono">Roboto Mono (Tech, Code)</option>
                              <option value="Montserrat">Montserrat (Bold, Geometric)</option>
                              <option value="Lato">Lato (Friendly, Humanist)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Theme mode</label>
                            <div className="flex gap-4">
                              <button
                                onClick={() => setSettings({...settings, brand: {...settings.brand, mode: 'dark'}})}
                                className={`flex-1 py-3 px-4 rounded-xl border ${
                                  settings.brand.mode === 'dark' 
                                    ? 'bg-zinc-900 border-emerald-500 text-white' 
                                    : 'bg-black/40 border-white/10 text-zinc-400 hover:border-white/30'
                                }`}
                              >
                                Dark Mode
                              </button>
                              <button
                                onClick={() => setSettings({...settings, brand: {...settings.brand, mode: 'light'}})}
                                className={`flex-1 py-3 px-4 rounded-xl border ${
                                  settings.brand.mode === 'light' 
                                    ? 'bg-white text-black border-emerald-500' 
                                    : 'bg-black/40 border-white/10 text-zinc-400 hover:border-white/30'
                                }`}
                              >
                                Light Mode
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'integrations' && (
                        <div className="space-y-4">
                          <div className="bg-black/40 p-5 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-red-500/15 rounded-xl flex items-center justify-center text-red-400 font-bold">F</div>
                              <div>
                                <h3 className="text-white font-semibold">Formspree</h3>
                                <p className="text-xs text-zinc-500">Handle contact form submissions</p>
                              </div>
                            </div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Form ID</label>
                            <input
                              type="text"
                              value={settings.integrations.formspreeId}
                              onChange={e => setSettings({...settings, integrations: {...settings.integrations, formspreeId: e.target.value}})}
                              placeholder="e.g., xnqloqpy"
                              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent outline-none"
                            />
                            <p className="text-xs text-zinc-500 mt-2">
                              Create a form at <a href="https://formspree.io" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">formspree.io</a> and paste your Form ID here.
                            </p>
                          </div>

                          <div className="bg-black/30 p-5 rounded-2xl border border-white/5 opacity-60 cursor-not-allowed">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-blue-500/15 rounded-xl flex items-center justify-center text-blue-400 font-bold">S</div>
                              <div>
                                <h3 className="text-white font-semibold">Stripe</h3>
                                <p className="text-xs text-zinc-500">Accept payments (Coming soon)</p>
                              </div>
                            </div>
                            <p className="text-xs text-zinc-500">
                              Product integration is currently in beta. Use Stripe Payment Links in your product descriptions for now.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-black/60 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-lg font-semibold text-white">Project console is a Pro feature</p>
                    <p className="text-sm text-emerald-100/80 mt-2">
                      Save SEO, brand, and integration settings across every deploy once you upgrade.
                    </p>
                    <button
                      onClick={() => onUpgrade?.()}
                      className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-white font-semibold hover:bg-emerald-500/30 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Unlock with Architect
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-5 bg-black/30">
                <div className="rounded-2xl border border-white/5 bg-black/30 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">Current focus</p>
                      <p className="text-white text-base font-semibold mt-1">{activeSectionLabel}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full border border-white/10 text-[11px] text-zinc-300">
                      {demoMode ? 'Demo' : 'Live'}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {thought || 'The builder is orchestrating layout, copy, and data bindings for the current module.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-black/30 p-5 space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">Stack snapshot</p>
                  {stackSummary.map(({ icon: Icon, label, meta }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{label}</p>
                        <p className="text-xs text-zinc-500">{meta}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {limitedCredits && creditsRemaining !== null && (
                  <div className="rounded-2xl border border-white/5 bg-black/30 p-5">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-zinc-500">
                      <span>Demo credits</span>
                      <span>{creditsRemaining} left</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-300"
                        style={{ width: `${creditFill}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                      Upgrade to remove generation limits and persist settings across sessions.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Close
              </button>
              {!isDemoPreview ? (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save changes
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => onUpgrade?.()}
                  className="px-6 py-2.5 bg-emerald-500/20 border border-emerald-400/50 text-white rounded-xl font-semibold flex items-center gap-2 justify-center hover:bg-emerald-500/30 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Upgrade to unlock
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
