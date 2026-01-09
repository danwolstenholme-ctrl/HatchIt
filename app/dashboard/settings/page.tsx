'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useGitHub } from '@/hooks/useGitHub'
import { Github, CreditCard, MessageCircle, CheckCircle2 } from 'lucide-react'

export default function DashboardSettingsPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const gitHub = useGitHub()

  const accountSubscription = user?.publicMetadata?.accountSubscription as { tier?: string; status?: string } | undefined
  const tier = accountSubscription?.tier || 'free'

  if (!isLoaded) return null

  return (
    <div className="space-y-6">
      <p className="text-xs text-zinc-500">Account connections and workspace configuration.</p>

      {/* Plan */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Plan</p>
              <p className="text-xs text-zinc-100 font-medium capitalize">{tier}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/billing')}
            className="px-3 py-1.5 text-[11px] text-zinc-400 border border-zinc-700 hover:border-zinc-600 hover:text-zinc-200 rounded-md transition-all"
          >
            Manage billing
          </button>
        </div>
      </div>

      {/* GitHub */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <Github className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">GitHub</p>
                {gitHub.connected && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-100">
                {gitHub.loading ? 'Checking connection…' : gitHub.connected ? `@${gitHub.username}` : 'Not connected'}
              </p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Required for pushing code to your repo.</p>
            </div>
          </div>
          {gitHub.connected ? (
            <button
              onClick={async () => {
                await gitHub.disconnect()
                await gitHub.refresh()
              }}
              className="px-3 py-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 border border-zinc-700 hover:border-zinc-600 rounded-md transition-all"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => gitHub.connect()}
              disabled={gitHub.loading}
              className="px-3 py-1.5 text-[11px] text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition-all disabled:opacity-50"
            >
              Connect GitHub
            </button>
          )}
        </div>
      </div>

      {/* Support */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Support</p>
              <p className="text-xs text-zinc-100">Need help?</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/contact')}
            className="px-3 py-1.5 text-[11px] text-zinc-400 border border-zinc-700 hover:border-zinc-600 hover:text-zinc-200 rounded-md transition-all"
          >
            Contact support
          </button>
        </div>
      </div>
    </div>
  )
}
