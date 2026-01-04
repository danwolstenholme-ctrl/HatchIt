'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, ArrowLeft, Send, Globe, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function ContactForm() {
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/'
  
  const [form, setForm] = useState({ name: '', email: '', topic: 'General', message: '', website: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send. Try again.')
      }

      setStatus('sent')
      setForm({ name: '', email: '', topic: 'General', message: '', website: '' })
    } catch (err: any) {
      setStatus('error')
      setError(err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-12 px-6 relative overflow-hidden font-sans">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <Link 
          href={returnUrl}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </Link>

        <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
          {/* Main Content */}
          <div>
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
                Contact Support
              </h1>
              <p className="text-zinc-400 text-lg">
                We're here to help. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 outline-none transition placeholder:text-zinc-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@company.com"
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 outline-none transition placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Topic</label>
                  <div className="relative">
                    <select
                      name="topic"
                      value={form.topic}
                      onChange={handleChange}
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 outline-none transition appearance-none"
                    >
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Billing & Account</option>
                      <option>Feature Request</option>
                      <option>Partnership</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                {/* Honeypot */}
                <div className="hidden">
                  <input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    minLength={10}
                    placeholder="How can we help you?"
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 outline-none transition h-32 resize-none placeholder:text-zinc-600"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                {status === 'sent' && (
                  <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Message sent successfully. We'll be in touch shortly.
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5">
              <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-zinc-400" />
                Other Ways to Connect
              </h3>
              
              <div className="space-y-4">
                <a 
                  href="mailto:support@hatchit.dev" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                    <Mail className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-200">Email Support</div>
                    <div className="text-xs text-zinc-500">support@hatchit.dev</div>
                  </div>
                </a>

                <a 
                  href="https://www.reddit.com/r/HatchIt/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <MessageSquare className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-200">Community</div>
                    <div className="text-xs text-zinc-500">Join r/HatchIt</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5">
              <h3 className="font-medium text-white mb-2">Response Time</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <ContactForm />
    </Suspense>
  )
}
