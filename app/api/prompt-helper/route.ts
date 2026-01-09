import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GoogleGenAI } from '@google/genai'

// =============================================================================
// PROMPT HELPER
// Interactive AI that helps users craft better prompts.
// Demo mode is allowed (rate-limited) so the sandbox can show off the product.
// =============================================================================

const geminiApiKey = process.env.GEMINI_API_KEY
const genai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null

// Section-specific greetings
const SECTION_GREETINGS: Record<string, string> = {
  hero: "Let's make your hero section shine. What's the main message?",
  features: "Features time! What makes your product special?",
  pricing: "Pricing section - what tiers are you thinking?",
  faq: "FAQ section - what questions do your users ask most?",
  contact: "Contact section - how do you want people to reach you?",
  testimonials: "Social proof! Got any great customer quotes?",
  cta: "Call to action - what's the one thing you want visitors to do?",
  about: "About section - tell me the story behind your brand.",
  footer: "Footer time - what links and info do you need?",
}

const SYSTEM_PROMPT = `You are the Prompt Helper inside HatchIt.

You help the user turn vague intent into a strong build prompt.

Rules:
- Be direct and concise (1-3 sentences).
- No hype words ("magic", "manifest", "revolutionary").
- No mascot/character voice.
- Ask at most ONE clarifying question if needed.
- When possible, output a single copy-paste prompt that names layout + tone + key elements.
`

// Simple in-memory rate limiting (key -> timestamps of requests)
const rateLimits = new Map<string, number[]>()
const RATE_LIMIT_PER_MINUTE = 30
const RATE_LIMIT_WINDOW = 60000
const MAX_ENTRIES = 10000

function checkRateLimit(key: string): boolean {
  const now = Date.now()

  if (rateLimits.size > MAX_ENTRIES) {
    const cutoff = now - RATE_LIMIT_WINDOW
    for (const [k, timestamps] of rateLimits.entries()) {
      const recent = timestamps.filter(t => t > cutoff)
      if (recent.length === 0) {
        rateLimits.delete(k)
      } else {
        rateLimits.set(k, recent)
      }
    }
  }

  const timestamps = rateLimits.get(key) || []
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW)
  if (recent.length >= RATE_LIMIT_PER_MINUTE) return false

  recent.push(now)
  rateLimits.set(key, recent)
  return true
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    const bodyUnknown = (await request.json().catch(() => ({}))) as unknown
    const body = (typeof bodyUnknown === 'object' && bodyUnknown !== null)
      ? (bodyUnknown as Record<string, unknown>)
      : {}

    const sectionType = typeof body.sectionType === 'string' ? body.sectionType : undefined
    const sectionName = typeof body.sectionName === 'string' ? body.sectionName : undefined
    const templateType = typeof body.templateType === 'string' ? body.templateType : undefined
    const userMessage = typeof body.userMessage === 'string' ? body.userMessage : undefined
    const prompt = typeof body.prompt === 'string' ? body.prompt : undefined
    const brandName = typeof body.brandName === 'string' ? body.brandName : undefined
    const brandTagline = typeof body.brandTagline === 'string' ? body.brandTagline : undefined
    const isDemo = typeof body.isDemo === 'boolean' ? body.isDemo : undefined
    const demoId = typeof body.demoId === 'string' ? body.demoId : undefined

    const conversationHistory = Array.isArray(body.conversationHistory)
      ? (body.conversationHistory as Array<{ role?: unknown; content?: unknown }>).filter(Boolean)
          .map((m) => ({
            role: m && (m.role === 'user' || m.role === 'assistant') ? (m.role as 'user' | 'assistant') : 'user',
            content: m && typeof m.content === 'string' ? m.content : '',
          }))
      : []

    const effectiveMessage = (typeof userMessage === 'string' && userMessage.trim().length > 0)
      ? userMessage
      : (typeof prompt === 'string' ? prompt : '')

    const effectiveSectionType = typeof sectionType === 'string' && sectionType.trim().length > 0
      ? sectionType
      : (typeof sectionName === 'string' ? sectionName : '')

    // Allow demo usage (unauthenticated) with per-demo-id + per-IP limiting.
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
    const demoKey = typeof demoId === 'string' && demoId.trim().length > 0 ? demoId.trim() : null
    const effectiveUserId = userId || (isDemo && demoKey ? `demo:${ip}:${demoKey}` : null)

    if (!effectiveUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!checkRateLimit(effectiveUserId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 30 requests per minute.' },
        { status: 429 }
      )
    }

    if (!effectiveSectionType || !effectiveMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get section-specific greeting hint
    const sectionKey = effectiveSectionType.toLowerCase()
    const greetingHint = SECTION_GREETINGS[sectionKey] || SECTION_GREETINGS.hero

    // Build context for Pip
    const sectionContext = `
Section being built: ${sectionName || effectiveSectionType}
Template type: ${templateType || 'Landing Page'}
${brandName ? `Brand name: ${brandName}` : ''}
${brandTagline ? `Brand tagline: ${brandTagline}` : ''}
Suggested greeting style: "${greetingHint}"
`.trim()

    // Build contents array for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []
    
    // Add history
    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          })
        }
      }
    }

    // Add current message
    // If this is the first message, prepend context
    let finalUserMessage = effectiveMessage
    if (conversationHistory.length === 0) {
      finalUserMessage = `[Context: ${sectionContext}]\n\nUser: ${effectiveMessage}`
    }
    
    contents.push({
      role: 'user',
      parts: [{ text: finalUserMessage }]
    })

    if (!genai) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const response = await genai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      config: {
        maxOutputTokens: 1024,
        systemInstruction: SYSTEM_PROMPT,
      },
      contents,
    })

    const assistantMessage = response.text || ''

    // Check if this looks like a final prompt (contains specific elements)
    const looksLikePrompt = 
      assistantMessage.includes('Headline') || 
      assistantMessage.includes('CTA') ||
      assistantMessage.includes('Style:') ||
      assistantMessage.length > 200

    return NextResponse.json({
      // UI expects `enhancedPrompt`; keep `message` for backward compatibility.
      enhancedPrompt: assistantMessage,
      message: assistantMessage,
      isPromptReady: looksLikePrompt,
    })

  } catch (error) {
    console.error('Prompt helper error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
