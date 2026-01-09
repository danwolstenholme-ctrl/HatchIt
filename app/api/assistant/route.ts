import { NextRequest, NextResponse } from 'next/server'

// =============================================================================
// AI ASSISTANT API - Help with design, debugging, and prompts
// Uses Claude Haiku for fast, helpful responses
// =============================================================================

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { 
      message, 
      currentCode, 
      projectName, 
      sectionType,
      conversationHistory = []
    } = body

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // Build context
    const context = []
    if (projectName) context.push(`Project: ${projectName}`)
    if (sectionType) context.push(`Current section: ${sectionType}`)
    if (currentCode) context.push(`Current code preview:\n\`\`\`tsx\n${currentCode.slice(0, 1500)}\n\`\`\``)

    const systemPrompt = `You are a helpful AI assistant for HatchIt, a website builder that generates React/Tailwind code.

Your role is to help users:
1. Write better prompts for generating sections
2. Debug issues with their generated code
3. Suggest design improvements
4. Answer questions about web design best practices

Keep responses concise and actionable. If suggesting code changes, provide specific examples.

${context.length > 0 ? `\nContext:\n${context.join('\n')}` : ''}`

    // Build messages array for Claude
    const messages = [
      ...conversationHistory.map((msg: Message) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      return NextResponse.json({ error: 'AI service error' }, { status: 500 })
    }

    const data = await response.json()
    const assistantResponse = data.content?.[0]?.text || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response: assistantResponse })

  } catch (error) {
    console.error('Assistant API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
