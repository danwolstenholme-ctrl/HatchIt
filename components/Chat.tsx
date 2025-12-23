'use client'

import { useState, FormEvent } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatProps {
  onGenerate: (prompt: string) => Promise<void>
  isGenerating: boolean
}

export default function Chat({ onGenerate, isGenerating }: ChatProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    await onGenerate(userMessage)

    setMessages(prev => [...prev, { role: 'assistant', content: 'Component generated.' }])
  }

  return (
    <Group orientation="vertical" className="flex-1">
      {/* Messages */}
      <Panel id="messages" defaultSize={70} minSize={30}>
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-zinc-500 text-sm">
              Describe a component and I'll generate clean React + Tailwind code.
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-sm ${
                msg.role === 'user' ? 'text-zinc-100' : 'text-zinc-400'
              }`}
            >
              <span className="font-medium">
                {msg.role === 'user' ? 'You: ' : 'Hatch: '}
              </span>
              {msg.content}
            </div>
          ))}
          {isGenerating && (
            <div className="text-sm text-zinc-500">Generating...</div>
          )}
        </div>
      </Panel>

      <Separator className="h-2 bg-zinc-800 hover:bg-zinc-600 transition-colors cursor-row-resize" />

      {/* Input */}
      <Panel id="input" defaultSize={30} minSize={15}>
        <form onSubmit={handleSubmit} className="h-full p-4 flex flex-col">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="A pricing card with three tiers..."
            className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 resize-none"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={isGenerating || !input.trim()}
            className="mt-3 px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg text-sm font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Generate
          </button>
        </form>
      </Panel>
    </Group>
  )
}