import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Server-side rate limiting (userId -> timestamps)
const rateLimits = new Map<string, number[]>()
const RATE_LIMIT_PER_MINUTE = 20
const RATE_LIMIT_WINDOW = 60000 // 1 minute

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

// Server-side daily generation tracking
const dailyGenerations = new Map<string, { count: number; date: string }>()
const FREE_DAILY_LIMIT = 10

function checkAndRecordGeneration(userId: string, isPaid: boolean): { allowed: boolean; remaining: number } {
  if (isPaid) {
    return { allowed: true, remaining: -1 } // Unlimited for paid users
  }
  
  const today = new Date().toISOString().split('T')[0]
  const userGen = dailyGenerations.get(userId) || { count: 0, date: today }
  
  // Reset if new day
  if (userGen.date !== today) {
    userGen.count = 0
    userGen.date = today
  }
  
  if (userGen.count >= FREE_DAILY_LIMIT) {
    return { allowed: false, remaining: 0 }
  }
  
  userGen.count++
  dailyGenerations.set(userId, userGen)
  return { allowed: true, remaining: FREE_DAILY_LIMIT - userGen.count }
}

// Simple syntax check
function checkSyntax(code: string): { valid: boolean; error?: string } {
  try {
    const cleanedCode = code
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+/g, '');
    new Function(cleanedCode);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

// Aggressive code cleanup - remove all problematic patterns
function cleanGeneratedCode(code: string): string {
  return code
    // Remove 'use client' directive
    .replace(/['"]use client['"]\s*;?\n?/g, '')
    // Remove all import statements
    .replace(/^import\s+.*?;?\s*$/gm, '')
    // Remove export default function ComponentName() - replace with plain function
    .replace(/export\s+default\s+function\s+\w+\s*\(\s*\)\s*\{/, 'function Component() {')
    // Remove standalone export default
    .replace(/export\s+default\s+/g, '')
    // Remove any remaining export statements
    .replace(/^export\s+/gm, '')
    // Remove type annotations and interfaces
    .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, '')
    .replace(/type\s+\w+\s*=[^;]+;/g, '')
    // Clean up multiple blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const systemPrompt = `You are the HatchIt component generator. You create production-ready React components that render in a browser iframe using React 18 (UMD) and Tailwind CSS (CDN).

## CRITICAL RULES

### No Imports or 'use client'
NEVER use import statements or 'use client' directives. These hooks are available globally as standalone functions:
- useState, useEffect, useMemo, useCallback, useRef

WRONG: import { useState } from 'react'
WRONG: 'use client'
WRONG: React.useState()
CORRECT: const [count, setCount] = useState(0)

### Component Structure
Always use this exact format (NO 'use client' directive):

export default function Component() {
  // hooks at top
  const [state, setState] = useState(initialValue)
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* content */}
    </div>
  )
}

### Output Format
Return ONLY raw code. NEVER include:
- Markdown code fences (\`\`\`)
- Language tags
- Explanations before or after the code

## STYLING (Dark Theme)

### Colors
- Backgrounds: bg-zinc-950, bg-zinc-900, bg-zinc-800
- Text: text-white, text-zinc-400, text-zinc-500
- Borders: border-zinc-800, border-zinc-700
- Accents: blue-500, purple-500, green-500

### Common Patterns

Buttons:
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">

Cards:
<div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">

Inputs:
<input className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500" />

Gradients:
<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">

### Responsive Design
Always mobile-first:
<div className="px-4 md:px-8 lg:px-16">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

## COMPONENT TYPES

### Landing Pages
Include: Nav (sticky), Hero, Features (grid), CTA, Footer
Use max-w-6xl mx-auto for content width
Add smooth scroll with id anchors: <a href="#features"> and <section id="features">

### Forms
Always include:
- Loading state (isSubmitting)
- Success state (submitted)
- Proper labels and placeholders
- For form submission, use Formspree.io:
  * Set form action to: 'https://formspree.io/f/YOUR_FORMSPREE_ID'
  * Add a code comment explaining: '// Replace YOUR_FORMSPREE_ID with your ID from formspree.io'
  * Users sign up free at formspree.io to get their ID

### Interactive Elements
- Always add hover states
- Use transition-colors or transition-all
- Include disabled states for buttons

## MISTAKES TO AVOID
1. Using import statements
2. Using React.useState instead of useState
3. Complex TypeScript generics (keep types simple)
4. Including markdown in output
5. Using light mode colors
6. Forgetting 'use client' directive
7. Not making components responsive

## MODIFICATIONS
When user asks to modify existing code:
- Only change what's requested
- Preserve overall structure
- Keep all existing functionality
- Maintain consistent styling`

export async function POST(request: NextRequest) {
  // Authenticate user
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check rate limit
  if (!checkRateLimit(userId)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Maximum 20 requests per minute.' },
      { status: 429 }
    )
  }

  // Check if user is paid
  let isPaid = false
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    isPaid = user.publicMetadata?.paid === true
  } catch {
    // Continue as free user if lookup fails
  }

  // Check daily generation limit for free users
  const genCheck = checkAndRecordGeneration(userId, isPaid)
  if (!genCheck.allowed) {
    return NextResponse.json(
      { error: 'Daily generation limit reached. Upgrade to continue building.' },
      { status: 429 }
    )
  }

  const { prompt, history, currentCode } = await request.json()

  // Input validation
  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 })
  }

  if (prompt.length > 10000) {
    return NextResponse.json({ error: 'Prompt too long (max 10,000 characters)' }, { status: 400 })
  }

  const messages: Message[] = []
  
  if (history && history.length > 0) {
    for (const msg of history) {
      messages.push({
        role: msg.role,
        content: msg.role === 'assistant' ? msg.code || msg.content : msg.content
      })
    }
  }
  
  let userContent = prompt
  if (currentCode) {
    userContent = `Current code:\n\n${currentCode}\n\nRequest: ${prompt}`
  }
  messages.push({ role: 'user', content: userContent })

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
        max_tokens: 16384,
        system: systemPrompt,
        messages
      })
    })

    const data = await response.json()
    
    if (data.content && data.content[0]) {
      let code = data.content[0].text
      
      // Clean markdown if present
      const codeMatch = code.match(/```(?:jsx?|tsx?|javascript|typescript)?\n?([\s\S]*?)```/)
      if (codeMatch) {
        code = codeMatch[1].trim()
      }

      // Apply aggressive cleanup
      code = cleanGeneratedCode(code)

      // Check syntax and auto-fix if needed
      const syntaxCheck = checkSyntax(code)
      if (!syntaxCheck.valid && syntaxCheck.error) {
        console.log('Syntax error detected, attempting auto-fix...')
        console.log('Error:', syntaxCheck.error)
        
        // Call Claude again to fix
        const fixResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY || '',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 16384,
            system: systemPrompt,
            messages: [{
              role: 'user',
              content: `This React component has a syntax error:\n\n${code}\n\nError: ${syntaxCheck.error}\n\nFix the syntax error and return ONLY the corrected component code. No explanations, no markdown.`
            }]
          })
        })

        const fixData = await fixResponse.json()
        if (fixData.content && fixData.content[0]) {
          let fixedCode = fixData.content[0].text
          
          const fixMatch = fixedCode.match(/```(?:jsx?|tsx?|javascript|typescript)?\n?([\s\S]*?)```/)
          if (fixMatch) {
            fixedCode = fixMatch[1].trim()
          }
          
          // Apply aggressive cleanup to fixed code too
          fixedCode = cleanGeneratedCode(fixedCode)
          
          const recheck = checkSyntax(fixedCode)
          if (recheck.valid) {
            console.log('Auto-fix successful!')
            return NextResponse.json({ code: fixedCode })
          }
        }
      }

      return NextResponse.json({ code: cleanGeneratedCode(code) })
    }

    return NextResponse.json({ error: 'No response' }, { status: 500 })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 })
  }
}