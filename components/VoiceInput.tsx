'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isListening?: boolean
  onStateChange?: (isListening: boolean) => void
  className?: string
}

export default function VoiceInput({ onTranscript, onStateChange, className = '' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        onStateChange?.(true)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        // ignore
      }
      setIsListening(false)
      onStateChange?.(false)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition)) {
      setIsSupported(true)
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        onTranscript(transcript)
        stopListening()
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error)
        stopListening()
      }

      recognitionRef.current.onend = () => {
        stopListening()
      }
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isSupported) return null

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`relative p-2 rounded-full transition-all ${
        isListening 
          ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
          : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
      } ${className}`}
      title={isListening ? "Stop recording" : "Use voice command"}
    >
      <AnimatePresence mode="wait">
        {isListening ? (
          <motion.div
            key="listening"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <span className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-75"></span>
            <MicOff className="w-5 h-5 relative z-10" />
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <Mic className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
