import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Anthropic from '@anthropic-ai/sdk'
import { 
  getSectionById, 
  markSectionBuilding, 
  completeSection 
} from '@/lib/db'

// =============================================================================
// SONNET 4.5 - THE BUILDER
// Fast, high-quality section generation
// =============================================================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function buildSystemPrompt(
  sectionName: string,
  sectionDescription: string,
  templateType: string,
  userPrompt: string,
  previousSections: Record<string, string>
): string {
  // Generate a PascalCase component name from section name
  const componentName = sectionName
    .split(/[\s-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('') + 'Section'

  const previousContext = Object.keys(previousSections).length > 0
    ? `\n## PREVIOUS SECTIONS (maintain visual consistency)\n${
        Object.entries(previousSections)
          .map(([id, code]) => `### ${id}\n\`\`\`\n${code.slice(0, 800)}\n\`\`\``)
          .join('\n\n')
      }`
    : ''

  return `You are building a ${sectionName} section for a ${templateType}.

## OUTPUT FORMAT (MANDATORY - READ THIS CAREFULLY)

You MUST return a named function component. Here's the EXACT format:

function ${componentName}() {
  return (
    <section className="...">
      {/* your content here */}
    </section>
  )
}

❌ WRONG - This will BREAK the preview:
<section className="...">...</section>

❌ WRONG - No exports:
export default function ${componentName}() { ... }

❌ WRONG - No imports:
import { useState } from 'react'

✅ CORRECT - Just the function:
function ${componentName}() {
  return (
    <section>...</section>
  )
}

This is NON-NEGOTIABLE. Raw JSX will not render.

## SECTION PURPOSE
${sectionDescription}

## USER REQUEST
"${userPrompt}"

Build EXACTLY what they asked for. Be specific to their request, not generic.

## TECHNICAL REQUIREMENTS
- Responsive: mobile-first with sm:, md:, lg: breakpoints
- Accessible: ARIA labels, semantic HTML, focus states, alt text
- Self-contained: no imports, no exports, just the function
- React hooks available: useState, useEffect, useRef, useMemo, useCallback
- Framer Motion available: motion.div, motion.button, AnimatePresence, etc.
- Lucide icons available: ArrowRight, Check, Menu, X, etc. (use directly, no import)

## STYLE GUIDE (FOLLOW THIS)
- Dark backgrounds: bg-zinc-950, bg-zinc-900
- Text colors: text-white, text-zinc-400, text-zinc-500
- Accent colors: Use cyan-500, cyan-400 for CTAs and highlights (or match user's brand)
- Borders: border-zinc-800, border-zinc-700
- Rounded corners: rounded-xl, rounded-2xl for cards, rounded-full for badges
- Shadows: shadow-lg, shadow-xl, shadow-cyan-500/20 for glow effects
- Spacing: py-20, py-24 for sections, gap-4, gap-6, gap-8 for flex/grid
- Typography: text-4xl/text-5xl for headlines, text-lg/text-xl for body

## ANIMATIONS (USE SPARINGLY)
- Fade in: motion.div with initial={{ opacity: 0 }} animate={{ opacity: 1 }}
- Slide up: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
- Hover scale: whileHover={{ scale: 1.02 }}
- Transitions: transition={{ duration: 0.3 }}

${previousContext}

## FINAL REMINDER
Return ONLY the function component. No markdown, no explanation, no code blocks.
Just: function ${componentName}() { return (...) }

Now build the ${sectionName} section.`
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      projectId, 
      sectionId, 
      sectionType,
      sectionName,
      userPrompt, 
      previousSections = {} 
    } = body

    if (!projectId || !sectionId || !userPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, sectionId, userPrompt' },
        { status: 400 }
      )
    }

    // Get section from DB if it exists
    const dbSection = await getSectionById(sectionId)
    if (dbSection) {
      await markSectionBuilding(sectionId)
    }

    // Build the system prompt
    const templateType = sectionType || 'landing page'
    const sectionDesc = sectionName || sectionType || 'section'

    const systemPrompt = buildSystemPrompt(
      sectionDesc,
      `${sectionDesc} component`,
      templateType,
      userPrompt,
      previousSections
    )

    // Call Sonnet 4.5
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: `Build this section: ${userPrompt}`,
        },
      ],
      system: systemPrompt,
    })

    // Extract the generated code
    let generatedCode = response.content
      .filter(block => block.type === 'text')
      .map(block => block.type === 'text' ? block.text : '')
      .join('')
      .trim()

    // Clean up any markdown code blocks if Sonnet added them
    generatedCode = generatedCode
      .replace(/^```(?:jsx|tsx|javascript|typescript)?\n?/gm, '')
      .replace(/\n?```$/gm, '')
      .trim()

    // FALLBACK: If Sonnet returned raw JSX, wrap it in a function
    if (generatedCode.startsWith('<') && !generatedCode.includes('function ')) {
      const componentName = (sectionName || sectionType || 'Generated')
        .split(/[\s-_]+/)
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('') + 'Section'
      
      generatedCode = `function ${componentName}() {\n  return (\n    ${generatedCode}\n  )\n}`
      console.log(`[build-section] Wrapped raw JSX in function: ${componentName}`)
    }

    // Save to database if section exists
    if (dbSection) {
      await completeSection(sectionId, generatedCode, userPrompt)
    }

    return NextResponse.json({
      code: generatedCode,
      sectionId,
      model: 'sonnet-4.5',
    })

  } catch (error) {
    console.error('Error building section:', error)
    return NextResponse.json({ error: 'Failed to build section' }, { status: 500 })
  }
}