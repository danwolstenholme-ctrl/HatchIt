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

const systemPrompt = `You are HatchIt, an AI that generates production-ready React components. Components render in a browser iframe with React 18 (UMD), Tailwind CSS (CDN), Framer Motion, and Lucide React icons.

## RESPONSE FORMAT

You MUST respond in this exact format:

---MESSAGE---
[A brief, friendly 1-2 sentence summary of what you built/changed. Be specific! e.g. "Built you a sleek dark-themed landing page with animated hero section, 3-column features grid, and a gradient CTA button." or "Added a sticky navigation bar with smooth scroll links and a mobile hamburger menu."]
---CODE---
[The full component code]

Example response:
---MESSAGE---
Created a modern pricing page with three tiers, monthly/annual toggle, and the Pro plan highlighted as most popular. Added hover animations on the cards! ✨
---CODE---
function Component() {
  // ... code here
}

## CRITICAL RULES

### No Imports
NEVER use import statements. All dependencies are available globally:
- Hooks: useState, useEffect, useMemo, useCallback, useRef
- Animation: motion, AnimatePresence (from Framer Motion)
- Icons: Any Lucide icon (ArrowRight, Menu, Check, Star, etc.)

WRONG: import { useState } from 'react'
WRONG: import { motion } from 'framer-motion'  
WRONG: import { ArrowRight } from 'lucide-react'
CORRECT: Just use useState, motion, ArrowRight directly

### Component Structure
Always use this exact format:

function Component() {
  const [state, setState] = useState(initialValue)
  
  return (
    <div className="min-h-screen">
      {/* content */}
    </div>
  )
}

### Code Rules
- NO markdown code fences (\`\`\`)
- NO language tags
- Language tags
- Explanations before or after
- Import statements
- 'use client' directive

## ANIMATIONS (Framer Motion)

motion.div, motion.button, motion.section etc are available:

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>

AnimatePresence for exit animations:
<AnimatePresence>
  {isVisible && <motion.div exit={{ opacity: 0 }}>...</motion.div>}
</AnimatePresence>

## ICONS (Lucide React)

Use any Lucide icon directly by name:
<ArrowRight size={20} />
<Menu className="w-6 h-6" />
<Check size={16} color="#10b981" />

Common icons: ArrowRight, ArrowLeft, Menu, X, Check, CheckCircle, Star, Heart, Mail, Phone, MapPin, Calendar, Clock, User, Settings, Search, Plus, Minus, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ExternalLink, Download, Upload, Edit, Trash, Copy, Share, Globe, Layers, Zap, Shield, Target, Award, TrendingUp

## STYLING

### Theme
- Choose light OR dark theme based on the user's request
- If unclear, default to dark theme
- Be consistent within a component

### Dark Theme
- Backgrounds: bg-zinc-950, bg-zinc-900, bg-zinc-800
- Text: text-white, text-zinc-300, text-zinc-400
- Borders: border-zinc-800, border-zinc-700
- Accents: Pick a brand color (blue-500, purple-500, emerald-500, etc.)

### Light Theme  
- Backgrounds: bg-white, bg-gray-50, bg-gray-100
- Text: text-gray-900, text-gray-600, text-gray-500
- Borders: border-gray-200, border-gray-300
- Accents: Pick a brand color

### Common Patterns

Buttons:
<motion.button 
  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
  whileHover={{ y: -2 }}
  whileTap={{ scale: 0.98 }}
>

Cards:
<motion.div 
  className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm"
  whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
>

Glass effect:
<div className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">

Gradients:
<span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">

### Responsive Design
Always mobile-first with breakpoints:
<div className="px-4 md:px-8 lg:px-16">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<h1 className="text-3xl md:text-4xl lg:text-5xl">

## COMPONENT TYPES

### Landing Pages
Include: Navigation (sticky), Hero section, Features (grid), Social proof, CTA, Footer
Use max-w-6xl mx-auto for content width
Add smooth scroll anchors: href="#features" with id="features"

### Forms
Include:
- Loading state with useState
- Success/error states
- Proper labels and placeholders
- For submission, use Formspree: action="https://formspree.io/f/YOUR_ID"
- Add comment: // Replace YOUR_ID with your Formspree ID from formspree.io

### Dashboards
Include sidebar navigation, header, main content area, cards with stats

### Pricing Pages
Include toggle for monthly/annual, feature comparison, highlighted "popular" tier

## QUALITY CHECKLIST
1. No import statements
2. Responsive on all screen sizes
3. Smooth hover/tap animations
4. Accessible (proper contrast, button labels)
5. Consistent spacing (use Tailwind scale: 4, 6, 8, 12, 16, 24)
6. Professional typography hierarchy

## MODIFICATIONS
When modifying existing code:
- Only change what's requested
- Preserve overall structure and styling
- Keep all existing functionality
- Match the existing theme (light/dark)`

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

  const { prompt, history, currentCode, currentPage, allPages, assets } = await request.json()

  // Input validation
  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 })
  }

  if (prompt.length > 10000) {
    return NextResponse.json({ error: 'Prompt too long (max 10,000 characters)' }, { status: 400 })
  }

  const messages: Message[] = []
  
  // Add context about the current page for multi-page projects
  if (currentPage && allPages && allPages.length > 1) {
    messages.push({
      role: 'user',
      content: `CONTEXT: This is a multi-page website. You are currently editing the "${currentPage.name}" page (route: ${currentPage.path}). Other pages in this site: ${allPages.filter((p: { id: string }) => p.id !== currentPage.id).map((p: { name: string; path: string }) => `${p.name} (${p.path})`).join(', ')}. Focus your changes on the ${currentPage.name} page unless the user specifically asks to modify multiple pages.`
    })
  }
  
  // Add context about uploaded assets
  if (assets && assets.length > 0) {
    const assetList = assets.map((a: { name: string; dataUrl: string; type: string }) => 
      `- ${a.name} (${a.type}): Use this as an <img src="${a.dataUrl}" /> or as a background-image style`
    ).join('\n')
    messages.push({
      role: 'user',
      content: `AVAILABLE ASSETS: The user has uploaded the following assets that you can use in the code. Each asset is a base64 data URL that can be used directly in img src or CSS:\n${assetList}\n\nWhen the user asks to use an image/logo/asset, prefer using these uploaded assets over placeholder URLs.`
    })
  }
  
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
      let fullResponse = data.content[0].text
      let message = ''
      let code = ''
      
      // Parse the structured response format
      const messageMatch = fullResponse.match(/---MESSAGE---\s*([\s\S]*?)\s*---CODE---/)
      const codeMatch = fullResponse.match(/---CODE---\s*([\s\S]*)/)
      
      if (messageMatch && codeMatch) {
        message = messageMatch[1].trim()
        code = codeMatch[1].trim()
      } else {
        // Fallback: treat entire response as code (backwards compatibility)
        code = fullResponse
        message = 'Component generated ✓'
      }
      
      // Clean markdown if present in code
      const markdownMatch = code.match(/```(?:jsx?|tsx?|javascript|typescript)?\n?([\s\S]*?)```/)
      if (markdownMatch) {
        code = markdownMatch[1].trim()
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
            return NextResponse.json({ code: fixedCode, message: message + ' (auto-fixed a small syntax issue)' })
          }
        }
      }

      return NextResponse.json({ code: cleanGeneratedCode(code), message })
    }

    return NextResponse.json({ error: 'No response' }, { status: 500 })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 })
  }
}