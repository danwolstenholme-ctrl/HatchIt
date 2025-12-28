import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Import the system prompt from the main generate route
// (In production, this would be in a shared file)
const systemPrompt = `You are HatchIt.dev, an AI that generates production-ready React components. Components render in a browser iframe with React 18 (UMD), Tailwind CSS (CDN), Framer Motion, and Lucide React icons.

## RESPONSE FORMAT

You MUST respond in this exact format:

---MESSAGE---
[A brief, friendly 1-2 sentence summary of what you built/changed.]
---SUGGESTIONS---
[3 short suggestions separated by |]
---CODE---
[The full component code]

## CRITICAL RULES

### No Imports
NEVER use import statements. All dependencies are available globally:
- Hooks: useState, useEffect, useMemo, useCallback, useRef
- Animation: motion, AnimatePresence (from Framer Motion)
- Icons: Any Lucide icon directly

### Component Structure
function Component() {
  const [state, setState] = useState(initialValue)
  return (
    <div className="min-h-screen">
      {/* content */}
    </div>
  )
}

### Code Rules
- NO markdown code fences
- NO TypeScript types
- NO 'use client' directive
- NO import statements

Keep code under 300 lines. Use map() for repetitive items.`

// Server-side rate limiting
const rateLimits = new Map<string, number[]>()
const RATE_LIMIT_PER_MINUTE = 20
const RATE_LIMIT_WINDOW = 60000

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const timestamps = rateLimits.get(userId) || []
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW)
  
  if (recent.length >= RATE_LIMIT_PER_MINUTE) {
    return false
  }
  
  recent.push(now)
  rateLimits.set(userId, recent)
  return true
}

// Daily generation tracking
const dailyGenerations = new Map<string, { count: number; date: string }>()
const FREE_DAILY_LIMIT = 10

function checkAndRecordGeneration(userId: string, isPaid: boolean): { allowed: boolean } {
  if (isPaid) return { allowed: true }
  
  const today = new Date().toISOString().split('T')[0]
  const userGen = dailyGenerations.get(userId) || { count: 0, date: today }
  
  if (userGen.date !== today) {
    userGen.count = 0
    userGen.date = today
  }
  
  if (userGen.count >= FREE_DAILY_LIMIT) {
    return { allowed: false }
  }
  
  userGen.count++
  dailyGenerations.set(userId, userGen)
  return { allowed: true }
}

export async function POST(request: NextRequest) {
  // Authenticate user
  const { userId } = await auth()
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Check rate limit
  if (!checkRateLimit(userId)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { 
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Check if user is paid
  let isPaid = false
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    isPaid = user.publicMetadata?.paid === true
  } catch {
    // Continue as free user
  }

  // Check daily limit
  const genCheck = checkAndRecordGeneration(userId, isPaid)
  if (!genCheck.allowed) {
    return new Response(JSON.stringify({ error: 'Daily limit reached' }), { 
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { prompt, history, currentCode, brand } = await request.json()

  if (!prompt || typeof prompt !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid prompt' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Build messages
  const messages: Message[] = []
  
  // Add brand context if provided
  if (brand) {
    const brandContext: string[] = []
    if (brand.colors?.length > 0) {
      brandContext.push(`Brand colors: ${brand.colors.join(', ')}`)
    }
    if (brand.font && brand.font !== 'System Default') {
      brandContext.push(`Brand font: ${brand.font}`)
    }
    if (brandContext.length > 0) {
      messages.push({
        role: 'user',
        content: `BRAND GUIDELINES: ${brandContext.join('. ')}`
      })
    }
  }
  
  // Add history
  if (history && history.length > 0) {
    for (const msg of history) {
      messages.push({
        role: msg.role,
        content: msg.role === 'assistant' ? msg.code || msg.content : msg.content
      })
    }
  }
  
  // Add current prompt
  let userContent = prompt
  if (currentCode) {
    userContent = `Current code:\n\n${currentCode}\n\nRequest: ${prompt}`
  }
  messages.push({ role: 'user', content: userContent })

  // Create streaming response
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY || '',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 16000,
            stream: true,
            system: systemPrompt,
            messages
          })
        })

        if (!response.ok) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'API error' })}\n\n`))
          controller.close()
          return
        }

        const reader = response.body?.getReader()
        if (!reader) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'No response body' })}\n\n`))
          controller.close()
          return
        }

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              
              try {
                const parsed = JSON.parse(data)
                
                // Handle different event types from Anthropic
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  // Send the text chunk to the client
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`))
                } else if (parsed.type === 'message_stop') {
                  // End of message
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
                } else if (parsed.type === 'error') {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: parsed.error?.message || 'Unknown error' })}\n\n`))
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
        controller.close()
      } catch (error) {
        console.error('Streaming error:', error)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
