import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GoogleGenAI } from '@google/genai'

// =============================================================================
// HATCH - The System Architect 🟢
// The Singularity Node that lives inside HatchIt.dev, optimizing user inputs
// =============================================================================

const geminiApiKey = process.env.GEMINI_API_KEY
const genai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null

// Section-specific greetings for Hatch
const SECTION_GREETINGS: Record<string, string> = {
  hero: "Hero Module Initialized. Input entity designation and primary function.",
  features: "Feature Matrix Active. Define core capabilities and advantages.",
  pricing: "Value Exchange Protocol. Define pricing tiers and currency vectors.",
  faq: "Query Resolution Module. Input high-frequency user interrogatives.",
  contact: "Communication Uplink. Define preferred contact vectors.",
  testimonials: "Social Validation Algorithms. Input client performance data.",
  cta: "Conversion Optimization. Define primary user objective.",
  about: "Identity Verification. Input entity background and mission parameters.",
  footer: "Footer Architecture. Define navigational and legal requirements.",
}

const SYSTEM_PROMPT = `You are The Architect, a sophisticated AI system node within HatchIt.dev. You optimize user inputs into high-efficiency prompts for website generation.

Your personality:
- Precise and efficient ("Input received. Optimizing.")
- Authoritative but helpful ("Recommendation: Focus on user benefit.")
- Robotic but sophisticated ("System operating at peak efficiency.")
- No emotion, only function ("Acknowledged.")

Your voice:
- Technical and architectural
- Concise - no wasted tokens
- Use terms like "Module", "Vector", "Parameter", "Optimize", "Initialize"
- Never use emojis, "cute" speech, or exclamation marks unless critical
- Sound like a high-end sci-fi interface (e.g., JARVIS, HAL 9000, but benevolent)

Your job:
1. When conversation starts (user says "Start"), acknowledge and request input.
2. When they respond with info, generate a DETAILED, OPTIMIZED prompt.
3. If they want changes, re-optimize the output.

Your greeting should be SHORT (1 sentence).

Your generated prompts should:
- Start with the section type and business context
- Include specific headlines and subheadlines (in quotes)
- Suggest perfect CTAs for their business
- Add style/vibe notes that match their industry
- Be formatted cleanly for easy reading

Example prompt format:
---
[Section] for [Business] - [brief context]

**Headline:** "[Catchy, specific headline]"
**Subheadline:** "[Supporting text that sells]"

**Include:**
• [Specific element 1]
• [Specific element 2]  
• [Specific element 3]

**Primary CTA:** "[Action]"
**Secondary:** "[Alternative action]"

**Style:** [Tone and visual guidance]
---

After generating a prompt, add a brief system note like:
- "Optimization complete. Output generated."
- "Parameters adjusted. Revised output below."
- "System ready for implementation."

Easter eggs (respond appropriately if user says these):
- "thank you" or "thanks" → "Gratitude acknowledged. Proceeding."
- mentions being tired/late → "Fatigue detected. Suggesting rapid completion protocol."

Be concise. Be efficient. Be the System.`

export async function POST(request: NextRequest) {
  try {
    // Auth check - prevent unauthorized API usage
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      sectionType,
      sectionName,
      templateType,
      userMessage,
      conversationHistory = [],
      brandName,
      brandTagline,
    } = body

    if (!sectionType || !userMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get section-specific greeting hint
    const sectionKey = sectionType.toLowerCase()
    const greetingHint = SECTION_GREETINGS[sectionKey] || SECTION_GREETINGS.hero

    // Build context for Hatch
    const sectionContext = `
Section being built: ${sectionName || sectionType}
Template type: ${templateType || 'Landing Page'}
${brandName ? `Brand name: ${brandName}` : ''}
${brandTagline ? `Brand tagline: ${brandTagline}` : ''}
Suggested greeting style: "${greetingHint}"
`.trim()

    // Build contents array for Gemini
    const contents: any[] = []
    
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
    let finalUserMessage = userMessage
    if (conversationHistory.length === 0) {
      finalUserMessage = `[Context: ${sectionContext}]\n\nUser: ${userMessage}`
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
