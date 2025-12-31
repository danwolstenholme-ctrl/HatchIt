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
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-violet-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
                  Contact Support
                </span>
              </h1>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                We're here to help. Whether you have a question about the platform, 
                need technical assistance, or want to discuss enterprise solutions, our team is ready to assist.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Email Support</h3>
                    <p className="text-sm text-zinc-400">support@hatchit.dev</p>
                    <p className="text-sm text-zinc-500 mt-1">Response time: &lt; 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Live Chat</h3>
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
                <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-violet-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent</h3>
                <p className="text-zinc-400">
                  We've received your message and will get back to you shortly.
                </p>
                <button 
                  onClick={() => setFormState('idle')}
                  className="mt-6 text-sm text-violet-400 hover:text-violet-300 underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="How can we assist you?"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState === 'sending'}
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formState === 'sending' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
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
