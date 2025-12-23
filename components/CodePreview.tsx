'use client'
import { useState } from 'react'

interface CodePreviewProps {
  code: string
}

export default function CodePreview({ code }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleCopy = async () => {
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    if (!code) return
    setDownloading(true)
    
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      
      if (!res.ok) throw new Error('Export failed')
      
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'hatchit-project.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-zinc-900">
      {/* Header with buttons */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-700">
        <span className="text-xs text-zinc-500">Generated Code</span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={!code}
            className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!code || downloading}
            className="px-3 py-1 text-xs bg-zinc-100 hover:bg-white text-zinc-900 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {downloading ? 'Exporting...' : 'Download'}
          </button>
        </div>
      </div>
      
      {/* Code display */}
      <div className="flex-1 overflow-auto">
        {code ? (
          <pre className="p-4 text-sm text-zinc-300 font-mono whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
        ) : (
          <div className="p-4 text-sm text-zinc-600">
            Generated code will appear here.
          </div>
        )}
      </div>
    </div>
  )
}