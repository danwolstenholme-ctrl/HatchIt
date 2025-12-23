import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { prompt } = await request.json()

  const systemPrompt = `You are a React component generator. Given a description, output ONLY the code for a single React functional component.

Rules:
- Use TypeScript
- Use Tailwind CSS for all styling
- Name the component "Component" (export default function Component)
- No imports needed - React is available globally
- Output ONLY the raw code - no markdown, no backticks, no language tags, no explanations
- Make it visually polished and production-ready
- Use modern, clean design patterns`

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
        messages: [
          {
            role: 'user',
            content: `Generate a React component: ${prompt}`,
          },
        ],
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