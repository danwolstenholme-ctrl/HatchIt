'use client'

import { motion } from 'framer-motion'
import { Mail, MessageSquare, ArrowLeft, Send, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('sending')
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500))
    setFormState('sent')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Base</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column: Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-4 tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                  Establish Connection
                </span>
              </h1>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                The Architect is always listening. Whether you have a question about the Singularity, 
                need technical assistance, or want to discuss enterprise solutions, we are ready to receive your transmission.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Direct Line</h3>
                    <p className="text-sm text-zinc-400">support@hatchit.dev</p>
                    <p className="text-sm text-zinc-500 mt-1">Response time: &lt; 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Live Channels</h3>
                    <p className="text-sm text-zinc-400">Available for Enterprise Clients</p>
                    <p className="text-sm text-zinc-500 mt-1">Mon-Fri, 09:00 - 18:00 UTC</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8"
          >
            {formState === 'sent' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Transmission Received</h3>
                <p className="text-zinc-400">
                  Your message has been logged in the matrix. Our team will decode it shortly.
                </p>
                <button 
                  onClick={() => setFormState('idle')}
                  className="mt-6 text-sm text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                >
                  Send another transmission
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                    Identity
                  </label>
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                    Frequency (Email)
                  </label>
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                    Transmission Data
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="How can we assist you?"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState === 'sending'}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formState === 'sending' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Initiate Transmission</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
