'use client'

import { useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import Chat from '@/components/Chat'
import CodePreview from '@/components/CodePreview'
import LivePreview from '@/components/LivePreview'

export default function Home() {
  const [code, setCode] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      if (data.code) {
        setCode(data.code)
      }
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-screen bg-zinc-950 !p-4">
      <Group orientation="horizontal" className="h-full rounded-xl overflow-hidden border border-zinc-700">
        {/* Chat Panel - Left */}
        <Panel id="chat" defaultSize={30} minSize={20}>
          <div className="h-full flex flex-col bg-zinc-900">
            <div className="p-4 border-b border-zinc-800">
              <h1 className="text-xl font-semibold text-zinc-100">Hatch</h1>
              <p className="text-sm text-zinc-500">Code you can maintain</p>
            </div>
            <Chat onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>
        </Panel>

        <Separator className="w-2 bg-zinc-800 hover:bg-zinc-600 transition-colors cursor-col-resize" />

        {/* Right Panels - Code + Preview */}
        <Panel id="right" defaultSize={70} minSize={40}>
          <Group orientation="vertical" className="h-full">
            {/* Code Preview - Top Right */}
            <Panel id="code" defaultSize={50} minSize={20}>
              <div className="h-full flex flex-col bg-zinc-900">
                <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Generated Code</span>
                  {code && (
                    <button
                      onClick={handleCopy}
                      className="text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded transition-colors text-zinc-300"
                    >
                      {copied ? '✓ Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <CodePreview code={code} />
              </div>
            </Panel>

            <Separator className="h-2 bg-zinc-800 hover:bg-zinc-600 transition-colors cursor-row-resize" />

            {/* Live Preview - Bottom Right */}
            <Panel id="preview" defaultSize={50} minSize={20}>
              <div className="h-full flex flex-col bg-zinc-900">
                <div className="p-3 border-b border-zinc-800">
                  <span className="text-sm text-zinc-400">Live Preview</span>
                </div>
                <LivePreview code={code} />
              </div>
            </Panel>
          </Group>
        </Panel>
      </Group>
    </div>
  )
}