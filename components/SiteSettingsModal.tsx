import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Globe, Palette, Plug, Layout } from 'lucide-react'
import { DbBrandConfig } from '@/lib/supabase'

interface SiteSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  currentBrand?: DbBrandConfig
  onSave: (settings: SiteSettings) => Promise<void>
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

export default function SiteSettingsModal({ isOpen, onClose, projectId, currentBrand, onSave }: SiteSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'seo' | 'brand' | 'integrations'>('seo')
  const [isSaving, setIsSaving] = useState(false)
  
  const [settings, setSettings] = useState<SiteSettings>({
    seo: {
      title: '',
      description: '',
      keywords: ''
    },
    brand: {
      primaryColor: currentBrand?.colors?.[0] || '#10b981',
      font: currentBrand?.font || 'Inter',
      mode: 'dark'
    },
    integrations: {
      formspreeId: ''
    }
  })

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
            primaryColor: currentBrand.colors?.[0] || prev.brand.primaryColor,
            font: currentBrand.font || prev.brand.font,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layout className="w-5 h-5 text-emerald-500" />
                Site Settings
              </h2>
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
              <button
                onClick={() => setActiveTab('seo')}
                className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'seo' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-zinc-800/50' : 'text-zinc-400 hover:text-zinc-300'
                }`}
              >
                <Globe className="w-4 h-4" />
                SEO & Meta
              </button>
              <button
                onClick={() => setActiveTab('brand')}
                className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'brand' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-zinc-800/50' : 'text-zinc-400 hover:text-zinc-300'
                }`}
              >
                <Palette className="w-4 h-4" />
                Brand & Style
              </button>
              <button
                onClick={() => setActiveTab('integrations')}
                className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'integrations' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-zinc-800/50' : 'text-zinc-400 hover:text-zinc-300'
                }`}
              >
                <Plug className="w-4 h-4" />
                Integrations
              </button>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[300px]">
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Site Title</label>
                    <input
                      type="text"
                      value={settings.seo.title}
                      onChange={e => setSettings({...settings, seo: {...settings.seo, title: e.target.value}})}
                      placeholder="My Awesome Website"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-zinc-500 mt-1">Appears in browser tab and search results.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Meta Description</label>
                    <textarea
                      value={settings.seo.description}
                      onChange={e => setSettings({...settings, seo: {...settings.seo, description: e.target.value}})}
                      placeholder="A brief description of your site..."
                      rows={3}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                    />
                    <p className="text-xs text-zinc-500 mt-1">Recommended length: 150-160 characters.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Keywords</label>
                    <input
                      type="text"
                      value={settings.seo.keywords}
                      onChange={e => setSettings({...settings, seo: {...settings.seo, keywords: e.target.value}})}
                      placeholder="react, website, builder, ai"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-zinc-500 mt-1">Comma separated keywords.</p>
                  </div>
                </div>
              )}

              {activeTab === 'brand' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.brand.primaryColor}
                        onChange={e => setSettings({...settings, brand: {...settings.brand, primaryColor: e.target.value}})}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                      />
                      <input
                        type="text"
                        value={settings.brand.primaryColor}
                        onChange={e => setSettings({...settings, brand: {...settings.brand, primaryColor: e.target.value}})}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white font-mono uppercase w-32"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Typography</label>
                    <select
                      value={settings.brand.font}
                      onChange={e => setSettings({...settings, brand: {...settings.brand, font: e.target.value}})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="Inter">Inter (Clean, Modern)</option>
                      <option value="Playfair Display">Playfair Display (Elegant, Serif)</option>
                      <option value="Roboto Mono">Roboto Mono (Tech, Code)</option>
                      <option value="Montserrat">Montserrat (Bold, Geometric)</option>
                      <option value="Lato">Lato (Friendly, Humanist)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Theme Mode</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSettings({...settings, brand: {...settings.brand, mode: 'dark'}})}
                        className={`flex-1 py-3 px-4 rounded-lg border ${
                          settings.brand.mode === 'dark' 
                            ? 'bg-zinc-800 border-emerald-500 text-white' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        Dark Mode
                      </button>
                      <button
                        onClick={() => setSettings({...settings, brand: {...settings.brand, mode: 'light'}})}
                        className={`flex-1 py-3 px-4 rounded-lg border ${
                          settings.brand.mode === 'light' 
                            ? 'bg-white text-black border-emerald-500' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
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
                  <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-red-500/20 rounded flex items-center justify-center text-red-500 font-bold">F</div>
                      <div>
                        <h3 className="text-white font-medium">Formspree</h3>
                        <p className="text-xs text-zinc-500">Handle contact form submissions</p>
                      </div>
                    </div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Form ID</label>
                    <input
                      type="text"
                      value={settings.integrations.formspreeId}
                      onChange={e => setSettings({...settings, integrations: {...settings.integrations, formspreeId: e.target.value}})}
                      placeholder="e.g., xnqloqpy"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-zinc-500 mt-2">
                      Create a form at <a href="https://formspree.io" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">formspree.io</a> and paste your Form ID here.
                    </p>
                  </div>

                  <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800 opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center text-blue-500 font-bold">S</div>
                      <div>
                        <h3 className="text-white font-medium">Stripe</h3>
                        <p className="text-xs text-zinc-500">Accept payments (Coming Soon)</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Product integration is currently in beta. Use Stripe Payment Links in your product descriptions for now.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
