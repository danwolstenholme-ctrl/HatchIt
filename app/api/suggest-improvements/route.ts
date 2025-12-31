import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { GoogleGenAI } from '@google/genai'
import { AccountSubscription } from '@/types/subscriptions'

// =============================================================================
// OPUS 4 - PROACTIVE SUGGESTIONS
// Analyzes completed sections and suggests improvements
// =============================================================================

const geminiApiKey = process.env.GEMINI_API_KEY
const genai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null

const SUGGESTER_SYSTEM_PROMPT = `You are a proactive UX consultant reviewing a React + Tailwind section. Your job is to suggest 3-5 SPECIFIC improvements that would enhance the section.

## SUGGESTION TYPES

1. **Visual Enhancements**
   - Gradient backgrounds, shadows, micro-animations
   - Better visual hierarchy
   - Whitespace and breathing room

2. **Conversion Optimizations**
   - Secondary CTAs for hesitant users
   - Trust signals (badges, guarantees, testimonials count)
   - Urgency elements (limited time, spots remaining)

3. **UX Improvements**
   - Loading states
   - Error handling
   - Mobile-specific tweaks

4. **Content Additions**
   - FAQ section
   - Social proof elements
   - Feature comparisons

## RULES

- Be SPECIFIC and ACTIONABLE
- Each suggestion should be implementable in one refinement
- Don't repeat what's already in the code
- Focus on HIGH IMPACT changes
- Keep suggestions concise (one sentence each)

## OUTPUT FORMAT

Return ONLY a JSON array of suggestion strings (no markdown, no explanation):

["Add a subtle gradient from zinc-950 to zinc-900 for depth", "Include a money-back guarantee badge near the CTA", "Add hover scale animation to feature cards"]

If the section is already excellent, return 1-2 minor polish suggestions.`

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check for active subscription - Opus API is expensive
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const accountSub = user.publicMetadata?.accountSubscription as AccountSubscription | undefined
    if (!accountSub || accountSub.status !== 'active') {
      return NextResponse.json({ error: 'Pro subscription required', requiresUpgrade: true }, { status: 403 })
    }

    const body = await request.json()
    const { code, sectionType, sectionName, userPrompt } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Missing required field: code' },
        { status: 400 }
      )
    }

    if (!genai) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    // Call Gemini for suggestions
    const response = await genai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      config: {
        maxOutputTokens: 1024,
        systemInstruction: SUGGESTER_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
      contents: [
        {
          role: 'user',
          parts: [{
            text: `Section: ${sectionName || sectionType || 'Unknown'}
User's goal: "${userPrompt || 'Not specified'}"

Review this code and suggest 3-5 specific improvements:

${code}`
          }]
        },
      ],
    })

    // Extract the response
    const responseText = response.text || '[]'

    // Parse JSON response
    let suggestions: string[] = []

    try {
      // Clean any markdown code blocks
      const cleanedResponse = responseText
        .replace(/^```(?:json)?\n?/gm, '')
        .replace(/\n?```$/gm, '')
        .trim()

      suggestions = JSON.parse(cleanedResponse)
      
      if (!Array.isArray(suggestions)) {
        // If it's not an array, try to extract array from it
        const arrayMatch = cleanedResponse.match(/\[[\s\S]*\]/)
        if (arrayMatch) {
          suggestions = JSON.parse(arrayMatch[0])
        } else {
          suggestions = []
        }
      }
    } catch (parseError) {
      console.error('[suggest-improvements] Failed to parse response:', parseError)
      console.error('[suggest-improvements] Raw response:', responseText.slice(0, 500))
      // Return empty suggestions on parse failure
      suggestions = []
    }

    return NextResponse.json({
      suggestions,
      model: 'gemini-2.0-flash-001',
    })

  } catch (error) {
    console.error('Error generating suggestions:', error)
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
  }
}
