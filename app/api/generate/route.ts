import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  const { prompt, history, currentCode } = await request.json()

  const systemPrompt = `You are a React component generator and modifier. You help users create and iterate on React components.

Rules:
- Use TypeScript
- Use Tailwind CSS for all styling
- Name the component "Component" (export default function Component)
- No imports needed - React hooks (useState, useEffect, etc.) are available globally as standalone functions, not as React.useState
- Output ONLY the raw code - no markdown, no backticks, no language tags, no explanations
- Make it visually polished and production-ready
- Use modern, clean design patterns

When modifying existing code, maintain the overall structure and only change what the user requests.`

  // Build messages array from history
  const messages: Message[] = []
  
  // Add conversation history
  if (history && history.length > 0) {
    for (const msg of history) {
      messages.push({
        role: msg.role,
        content: msg.role === 'assistant' ? msg.code || msg.content : msg.content
      })
    }
  }
  
  // Add current request with context
  let userMessage = prompt
  if (currentCode) {
    userMessage = `Current component code:\n\`\`\`\n${currentCode}\n\`\`\`\n\nUser request: ${prompt}`
  }
  messages.push({ role: 'user', content: userMessage })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages,
        system: systemPrompt,
      }),
    })

    const data = await response.json()
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message, code: '' }, { status: 400 })
    }

    let code = data.content?.[0]?.text || ''
    
    // Strip markdown code blocks if present
    code = code.replace(/^```(?:typescript|tsx|jsx|javascript|js)?\n?/i, '')
    code = code.replace(/\n?```$/i, '')
    code = code.trim()

    return NextResponse.json({ code })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Generation failed', code: '' }, { status: 500 })
  }
}