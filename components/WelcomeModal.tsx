'use client'

import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface WelcomeModalProps {
  trigger?: 'auto' | 'manual' | 'guest' | 'post-demo'
  isOpen?: boolean
  onClose?: () => void
}

export default function WelcomeModal({ trigger = 'auto', isOpen: externalIsOpen, onClose }: WelcomeModalProps) {
  const isOpen = (trigger === 'manual' || trigger === 'post-demo') ? (externalIsOpen ?? false) : false
  const router = useRouter()

  const handleClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  const handleSignup = () => {
    router.push('/sign-up')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-700">
                <Lock className="w-8 h-8 text-zinc-400" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">Save Your Masterpiece</h2>

              <p className="text-zinc-400 mb-8 leading-relaxed">
                You have built a great foundation. Create a free account to save progress and continue building the rest of the site.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleSignup}
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-xs text-zinc-500">
                  Already have an account?{' '}
                  <button onClick={() => router.push('/sign-in')} className="text-zinc-400 hover:text-white underline">
                    Sign in
                  </button>
                </p>
              </div>
            </div>

            <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 text-center">
              <p className="text-xs text-zinc-500">
                <span className="text-red-400">Warning:</span> Closing this window without signing up will lose your progress.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}