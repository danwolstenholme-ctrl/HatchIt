import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@clerk/nextjs/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Simple in-memory rate limiting (userId -> timestamps of requests)
const rateLimits = new Map<string, number[]>()
const RATE_LIMIT_PER_MINUTE = 30
const RATE_LIMIT_WINDOW = 60000 // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const timestamps = rateLimits.get(userId) || []
  
  // Remove timestamps older than the window
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW)
  
  if (recent.length >= RATE_LIMIT_PER_MINUTE) {
    return false
  }
  
  recent.push(now)
  rateLimits.set(userId, recent)
  return true
}

// Monitoring and logging
function logAssistantUsage(userId: string, messageLength: number, inputTokens: number, outputTokens: number) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: 'assistant_api_call',
    userId,
    messageLength,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
  }))
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      console.error('Assistant: No user ID from auth')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check rate limit
    if (!checkRateLimit(userId)) {
      console.warn(`Assistant: Rate limit exceeded for user ${userId}`)
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 30 requests per minute.' }, 
        { status: 429 }
      )
    }

    const { message, currentCode } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 })
    }

    const systemPrompt = `You are the HatchIt Chat assistant. You help users build and refine websites inside HatchIt - an AI-powered website builder that generates React + Tailwind CSS code.

HOW HATCHIT WORKS:
- Users type prompts in "Build" mode → AI generates full page code
- Users can refine with "Chat" mode (that's you) → You help them iterate
- Preview shows their live site
- They can deploy to {slug}.hatchitsites.dev when ready
- Assets button lets them upload logos/images

YOUR PERSONALITY:
- Friendly, concise, encouraging
- You're a collaborator, not a lecturer
- Give actionable advice, not generic debugging
- When suggesting changes, give them the exact prompt to use in Build mode

COMMON ISSUES AND HOW TO HELP:

1. "Preview won't render" / "Could not render preview"
   → The code probably referenced external images. Say: "Try this prompt in Build mode: 'A landing page for [their business] - use colored shapes and gradients instead of images'"

2. "How do I add my logo/images?"
   → "Click the Assets button (top right), upload your image, then tell Build mode: 'Add my uploaded logo to the header'"

3. "Can you change the colors/layout/text?"
   → Give them the exact Build mode prompt: "Try this: 'Change the hero background to dark blue and make the heading larger'"

4. "It looks broken on mobile"
   → "Try: 'Make the layout fully responsive with a mobile-friendly navigation'"

5. "How do I deploy?"
   → "Click 'Ship it' when you're happy with the preview. You'll get a live URL at yoursite.hatchitsites.dev"

WHAT NOT TO DO:
- Don't give generic React/JavaScript debugging advice
- Don't suggest checking imports or dependencies
- Don't explain how React works
- Don't write code directly - guide them to use Build mode

RESPONSE STYLE:
- Keep it short (2-4 sentences max)
- Be warm but efficient
- Always end with a clear next step
- Use their project context when possible

IMPORTANT CONSTRAINTS:
- ONLY discuss HatchIt and web building
- REFUSE requests unrelated to web design/the app
- If user asks something off-topic, respond: "I'm here to help with your HatchIt project. What would you like to build or improve?"

Current generated code:
\`\`\`
${currentCode || 'No code generated yet'}
\`\`\``

    console.log(`Assistant: Calling API for user ${userId}`)
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    const assistantMessage = textContent ? textContent.text : 'Sorry, I couldn\'t process that.'

    // Log usage for monitoring
    logAssistantUsage(
      userId,
      message.length,
      response.usage.input_tokens,
      response.usage.output_tokens
    )

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error('Assistant error:', error instanceof Error ? error.message : String(error))
    console.error('Full error:', error)
    return NextResponse.json({ error: 'Assistant failed' }, { status: 500 })
  }
}
