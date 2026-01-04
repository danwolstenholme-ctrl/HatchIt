// =============================================================================
// BUILDER UTILITIES
// Helper functions for the builder module
// =============================================================================

/**
 * Generate a random ID string
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Encode unescaped quotes inside Tailwind data-URI utilities to keep Babel/eval safe
 */
export const sanitizeSvgDataUrls = (input: string): string => {
  if (!input) return ''
  return input.replace(
    /bg-\[url\((['"])data:image\/svg\+xml,([\s\S]*?)\1\)\]/g, 
    (full, quote, data) => {
      const safe = data.replace(/"/g, '%22').replace(/'/g, '%27')
      return `bg-[url(${quote}data:image/svg+xml,${safe}${quote})]`
    }
  )
}

/**
 * Fix JSX text with literal < followed by non-tag characters (e.g., "< 3min")
 * Babel interprets `< 3` as the start of a JSX element, which breaks parsing
 */
export const sanitizeLessThanInText = (input: string): string => {
  // Match < followed by space or digit (not a valid tag start)
  return input.replace(/<\s+(\d)/g, '&lt; $1')
}

/**
 * Device sizes for responsive preview
 */
export const DEVICE_SIZES = {
  mobile: { width: '375px', label: 'Mobile' },
  tablet: { width: '768px', label: 'Tablet' },
  desktop: { width: '100%', label: 'Desktop' },
} as const

/**
 * Process section code for preview - strips imports and transforms exports
 */
export const processCodeForPreview = (code: string, index: number): string => {
  let processed = sanitizeSvgDataUrls(code || '')
  
  // Strip use client and imports
  processed = processed
    .replace(/'use client';?/g, '')
    .replace(/"use client";?/g, '')
    .replace(/import\s+.*?from\s+['"][^'"]+['"];?\s*/g, '')
  
  // Transform exports
  // Replace "export default function Name" -> "const Section_i = function Name"
  processed = processed.replace(/export\s+default\s+function\s+(\w+)?/g, (match, name) => {
    return `const Section_${index} = function ${name || ''}`
  })
  
  // Replace "export default" -> "const Section_i ="
  processed = processed.replace(/export\s+default\s+/g, `const Section_${index} = `)
  
  return processed
}

/**
 * Extract Lucide imports from code
 */
export const extractLucideImports = (code: string): Set<string> => {
  const imports = new Set<string>()
  const lucideImportRegex = /import\s+\{(.*?)\}\s+from\s+['"]lucide-react['"]/g
  let match
  while ((match = lucideImportRegex.exec(code)) !== null) {
    match[1].split(',').forEach(s => imports.add(s.trim()))
  }
  return imports
}

/**
 * Get tier config based on subscription
 */
export const getTierConfig = (tier: string | undefined) => {
  const configs: Record<string, { name: string; color: string; gradient: string; features: string[]; projectLimit: number }> = {
    architect: {
      name: 'Architect',
      color: 'emerald',
      gradient: 'from-emerald-500/20 to-teal-500/10',
      features: [
        'Unlimited AI generations',
        '10 projects',
        'Deploy to hatchit.dev subdomain',
        'Export clean React + Tailwind code'
      ],
      projectLimit: 10
    },
    visionary: {
      name: 'Visionary', 
      color: 'amber',
      gradient: 'from-amber-500/20 to-orange-500/10',
      features: [
        'Everything in Architect',
        'Unlimited projects',
        'Custom domain support',
        'Priority AI processing'
      ],
      projectLimit: Infinity
    },
    singularity: {
      name: 'Singularity',
      color: 'lime',
      gradient: 'from-lime-500/20 to-green-500/10',
      features: [
        'Everything in Visionary',
        'White-label deployments',
        'API access',
        'Priority support'
      ],
      projectLimit: Infinity
    }
  }
  
  return tier ? configs[tier] : null
}

/**
 * Assemble multiple sections into a single page component
 */
export const assembleSectionsToCode = (
  sectionCode: Record<string, string>,
  sectionOrder: string[]
): string => {
  const validSections = sectionOrder
    .filter(id => sectionCode[id])
    .map(id => ({ id, code: sectionCode[id] }))
  
  if (validSections.length === 0) return ''
  
  // Extract all imports
  const allImports = new Set<string>()
  allImports.add("'use client'")
  
  validSections.forEach(({ code }) => {
    const importMatches = code.matchAll(/import\s+.*?from\s+['"][^'"]+['"]/g)
    for (const match of importMatches) {
      allImports.add(match[0])
    }
  })
  
  // Process each section
  const processedSections = validSections.map(({ id, code }, index) => {
    let processed = code
      .replace(/'use client';?/g, '')
      .replace(/"use client";?/g, '')
      .replace(/import\s+.*?from\s+['"][^'"]+['"];?\s*/g, '')
      .replace(/export\s+default\s+function\s+(\w+)?/g, `function Section${index}`)
      .replace(/export\s+default\s+/g, `const Section${index} = `)
    
    return { id, code: processed, componentName: `Section${index}` }
  })
  
  // Build final component
  const imports = Array.from(allImports).join('\n')
  const sectionComponents = processedSections.map(s => s.code).join('\n\n')
  const renderCalls = processedSections.map(s => `      <${s.componentName} />`).join('\n')
  
  return `${imports}

${sectionComponents}

export default function Page() {
  return (
    <main>
${renderCalls}
    </main>
  )
}
`
}
