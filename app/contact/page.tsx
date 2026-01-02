'use client'

import { motion } from 'framer-motion'
import { Mail, MessageSquare, ArrowLeft, Rocket, Heart } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-8 px-6">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors mb-6 group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Header with Early Days badge */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
              Let's Talk
            </span>
          </h1>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
            <Rocket className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-medium">Early Access — Your feedback shapes everything</span>
          </div>
        </div>

        <p className="text-zinc-400 mb-6 text-sm">
          Small team, big ears. Bugs, features, or just saying hi — we're listening.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Reddit - Primary */}
          <motion.a
            href="https://www.reddit.com/r/HatchIt/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 hover:border-orange-500/50 rounded-xl p-4 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white">r/HatchIt</h3>
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">Best</span>
                </div>
                <p className="text-xs text-zinc-400">Community, builds, features, help</p>
              </div>
            </div>
          </motion.a>

          {/* Email */}
          <motion.a
            href="mailto:support@hatchit.dev"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="group bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 rounded-xl p-4 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white">Email</h3>
                <p className="text-xs text-emerald-400">support@hatchit.dev</p>
              </div>
            </div>
          </motion.a>

          {/* Feature Requests */}
          <motion.a
            href="https://www.reddit.com/r/HatchIt/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="group bg-zinc-900/50 border border-zinc-800 hover:border-violet-500/30 rounded-xl p-4 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-violet-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white">Feature Requests</h3>
                <p className="text-xs text-zinc-400">Post & vote on Reddit</p>
              </div>
            </div>
          </motion.a>

          {/* Bug Reports */}
          <motion.a
            href="https://www.reddit.com/r/HatchIt/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="group bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/30 rounded-xl p-4 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white">Bug Reports</h3>
                <p className="text-xs text-zinc-400">We fix fast</p>
              </div>
            </div>
          </motion.a>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-6">Built by humans who actually respond</p>
      </div>
    </div>
  )
}
