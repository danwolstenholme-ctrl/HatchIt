import { Project, Page, Version, Brand } from '@/types/builder'

// Generate unique ID
export const generateId = () => Math.random().toString(36).substring(2, 9)

// Project name suggestions
const projectNameSuggestions = [
  'Fresh Canvas',
  'Quick Build',
  'New Creation',
  'Blank Slate',
  'Fresh Start',
  'Quick Design',
  'New Project',
  'Fresh Idea',
  'Quick Sketch',
  'New Vision',
]

export const generateProjectName = (): string => {
  const suggestion = projectNameSuggestions[Math.floor(Math.random() * projectNameSuggestions.length)]
  const num = Math.floor(Math.random() * 999) + 1
  return `${suggestion} ${num}`
}

export const createNewProject = (name?: string): Project => {
  const homePage: Page = {
    id: generateId(),
    name: 'Home',
    path: '/',
    versions: [],
    currentVersionIndex: -1
  }
  
  return {
    id: generateId(),
    name: name || generateProjectName(),
    pages: [homePage],
    currentPageId: homePage.id,
    // Legacy fields for backward compatibility
    versions: [],
    currentVersionIndex: -1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Migrate old project format to new version-based format
export const migrateProject = (project: Project): Project => {
  if (project.versions && project.versions.length > 0) return project
  
  if (project.code || (project.codeHistory && project.codeHistory.length > 0)) {
    const versions: Version[] = []
    if (project.codeHistory) {
      project.codeHistory.forEach((code, index) => {
        versions.push({
          id: generateId(),
          code,
          timestamp: new Date(Date.now() - (project.codeHistory!.length - index) * 60000).toISOString(),
        })
      })
    }
    if (project.code) {
      versions.push({
        id: generateId(),
        code: project.code,
        timestamp: project.updatedAt || new Date().toISOString(),
      })
    }
    return { ...project, versions, currentVersionIndex: versions.length - 1, code: undefined, codeHistory: undefined }
  }
  
  return { ...project, versions: project.versions || [], currentVersionIndex: project.currentVersionIndex ?? -1 }
}

// Check if project uses new multi-page structure
export const isMultiPageProject = (project: Project): boolean => {
  return !!(project.pages && project.pages.length > 0)
}

// Get current page from project
export const getCurrentPage = (project: Project): Page | null => {
  if (!isMultiPageProject(project)) return null
  return project.pages!.find(p => p.id === project.currentPageId) || project.pages![0]
}

// Migrate single-page project to multi-page structure
export const migrateToMultiPage = (project: Project): Project => {
  if (isMultiPageProject(project)) return project
  
  // Convert single-page to multi-page with a home page
  const homePage: Page = {
    id: generateId(),
    name: 'Home',
    path: '/',
    versions: project.versions || [],
    currentVersionIndex: project.currentVersionIndex ?? 0
  }
  
  return {
    ...project,
    pages: [homePage],
    currentPageId: homePage.id
  }
}

// Extract brand (colors + font) from generated code
export const extractBrandFromCode = (code: string): Brand => {
  // Extract hex colors (prioritize bg- and text- colors)
  const hexMatches = code.match(/#[0-9A-Fa-f]{6}\b/g) || []
  const bgColorMatches = code.match(/bg-\[(#[0-9A-Fa-f]{6})\]/g) || []
  const textColorMatches = code.match(/text-\[(#[0-9A-Fa-f]{6})\]/g) || []
  
  // Also look for common Tailwind color classes and map to hex
  const tailwindToHex: Record<string, string> = {
    'blue-600': '#2563eb', 'blue-500': '#3b82f6', 'blue-700': '#1d4ed8',
    'purple-600': '#9333ea', 'purple-500': '#a855f7', 'purple-700': '#7c3aed',
    'green-600': '#16a34a', 'green-500': '#22c55e', 'emerald-600': '#059669',
    'red-600': '#dc2626', 'red-500': '#ef4444', 'orange-500': '#f97316',
    'pink-600': '#db2777', 'pink-500': '#ec4899', 'indigo-600': '#4f46e5',
    'cyan-500': '#06b6d4', 'teal-500': '#14b8a6', 'amber-500': '#f59e0b',
    'zinc-950': '#09090b', 'zinc-900': '#18181b', 'zinc-800': '#27272a',
  }
  
  const tailwindColorMatches = code.match(/(?:bg|text|from|to|border)-(?:blue|purple|green|red|orange|pink|indigo|cyan|teal|amber|emerald)-(?:500|600|700)/g) || []
  const tailwindHexColors = tailwindColorMatches.map(c => {
    const colorPart = c.replace(/^(?:bg|text|from|to|border)-/, '')
    return tailwindToHex[colorPart]
  }).filter(Boolean)
  
  // Combine all hex colors and get unique ones
  const allHexColors = [...hexMatches, ...bgColorMatches.map(m => m.match(/#[0-9A-Fa-f]{6}/)?.[0] || ''), ...textColorMatches.map(m => m.match(/#[0-9A-Fa-f]{6}/)?.[0] || ''), ...tailwindHexColors]
  const uniqueColors = [...new Set(allHexColors.filter(c => c && c !== '#000000' && c !== '#ffffff' && c !== '#FFFFFF'))]
  
  // Take top 3 most distinctive colors (skip grays)
  const nonGrayColors = uniqueColors.filter(c => {
    const r = parseInt(c.slice(1, 3), 16)
    const g = parseInt(c.slice(3, 5), 16)
    const b = parseInt(c.slice(5, 7), 16)
    const isGray = Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && Math.abs(r - b) < 20
    return !isGray
  })
  const brandColors = nonGrayColors.slice(0, 3)
  
  // Extract font family
  const fontMatch = code.match(/font-(?:sans|serif|mono)|font-\[['"]?([^'"\]]+)['"]?\]/i)
  let font = 'System Default'
  if (fontMatch) {
    if (fontMatch[1]) {
      font = fontMatch[1]
    } else if (fontMatch[0] === 'font-sans') {
      font = 'Sans Serif'
    } else if (fontMatch[0] === 'font-serif') {
      font = 'Serif'
    } else if (fontMatch[0] === 'font-mono') {
      font = 'Monospace'
    }
  }
  
  // Check for Google Fonts in code
  const googleFontMatch = code.match(/(?:Inter|Poppins|Roboto|Open Sans|Lato|Montserrat|Playfair Display|Raleway|Nunito|Outfit)/i)
  if (googleFontMatch) {
    font = googleFontMatch[0]
  }
  
  return {
    colors: brandColors.length > 0 ? brandColors : ['#3b82f6', '#9333ea'], // Default blue/purple
    font
  }
}

// Format relative time
export const formatRelativeTime = (timestamp: string): string => {
  const diffMs = Date.now() - new Date(timestamp).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`
  return new Date(timestamp).toLocaleDateString()
}

// Get device info from preview width
export const getDevice = (width: number): { name: string; icon: string } => {
  if (width < 375) return { name: 'iPhone SE', icon: '📱' }
  if (width < 430) return { name: 'iPhone', icon: '📱' }
  if (width < 640) return { name: 'Mobile', icon: '📱' }
  if (width < 768) return { name: 'iPad Mini', icon: '📱' }
  if (width < 1024) return { name: 'iPad', icon: '⬛' }
  if (width < 1280) return { name: 'Laptop', icon: '💻' }
  return { name: 'Desktop', icon: '🖥️' }
}
