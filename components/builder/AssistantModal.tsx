'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageSquare, Bot, User, Copy, Check, Code, Lightbulb, Bug, Palette } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AssistantModalProps {
  isOpen: boolean
  onClose: () => void
  currentCode?: string
  sectionName?: string
  projectName?: string
}

export default function AssistantModal({
  isOpen,
  onClose,
  currentCode,
  sectionName,
  projectName,
}: AssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Reset messages when modal opens
  useEffect(() => {
    if (isOpen) {
      setMessages([])
      setInput('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          currentCode,
          projectName,
          sectionType: sectionName,
          conversationHistory: messages.slice(-6),
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Assistant error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const copyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const quickActions = [
    { icon: Bug, label: 'Debug', prompt: 'Why isn\'t this working? Can you spot any issues?' },
    { icon: Palette, label: 'Design tips', prompt: 'How can I improve the visual design of this section?' },
    { icon: Code, label: 'Explain code', prompt: 'Can you explain what this code does?' },
    { icon: Lightbulb, label: 'Suggestions', prompt: 'What features could I add to make this better?' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal - Slide up on mobile, centered on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="relative w-full sm:max-w-2xl h-[85vh] sm:h-[600px] bg-zinc-950 sm:border border-zinc-800 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header - BLUE theme */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-blue-950/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Assistant</h2>
                  <p className="text-[10px] text-blue-400/70">Chat · Debug · Learn</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-base font-medium text-white mb-1">How can I help?</h3>
                  <p className="text-xs text-zinc-500 mb-6 max-w-xs">
                    I can debug issues, explain code, suggest improvements, or answer questions about your site.
                  </p>
                  
                  {/* Quick actions */}
                  <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(action.prompt)}
                        className="flex items-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-left hover:border-blue-500/30 hover:bg-blue-950/20 transition-all group"
                      >
                        <action.icon className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition-colors" />
                        <span className="text-xs text-zinc-400 group-hover:text-white transition-colors">{action.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  {currentCode && (
                    <p className="text-[10px] text-blue-500/50 mt-4">
                      ● Context: {sectionName || 'Current section'}
                    </p>
                  )}
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                      msg.role === 'user' 
                        ? 'bg-zinc-800' 
                        : 'bg-blue-500/20'
                    }`}>
                      {msg.role === 'user' 
                        ? <User className="w-3.5 h-3.5 text-zinc-400" />
                        : <Bot className="w-3.5 h-3.5 text-blue-400" />
                      }
                    </div>
                    <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-zinc-800 text-zinc-200 rounded-bl-md'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => copyMessage(msg.content, i)}
                          className="mt-1 text-[10px] text-zinc-600 hover:text-zinc-400 flex items-center gap-1"
                        >
                          {copiedIndex === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedIndex === i ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-zinc-800 bg-zinc-900/30">
              <div className="flex items-end gap-2 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  rows={1}
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50 resize-none max-h-32"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-3 text-blue-400 hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
