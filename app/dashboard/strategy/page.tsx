'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, Circle, Rocket, Target, TrendingUp } from 'lucide-react'

export default function StrategyPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-zinc-100">GTM_EXECUTION_PLAN</h1>
          <p className="text-zinc-400 text-sm mt-1">Tactical roadmap for market penetration.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-mono text-zinc-500">LAUNCH_DATE</p>
            <p className="font-mono font-bold text-emerald-400">T-MINUS 30 DAYS</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 backdrop-blur-sm">
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
              
              <TimelineItem 
                day="01-05"
                title="FOUNDATION_PHASE"
                description="Establish digital footprint and core messaging assets."
                status="completed"
                tasks={[
                  "Deploy landing page v1.0",
                  "Setup social media handles",
                  "Configure analytics tracking"
                ]}
              />

              <TimelineItem 
                day="06-15"
                title="AWARENESS_CAMPAIGN"
                description="Initial outreach to early adopters and beta testers."
                status="active"
                tasks={[
                  "Launch content marketing sequence",
                  "Engage with niche communities",
                  "Run targeted ad experiments"
                ]}
              />

              <TimelineItem 
                day="16-25"
                title="CONVERSION_OPTIMIZATION"
                description="Refine funnel based on initial data feedback."
                status="pending"
                tasks={[
                  "A/B test value propositions",
                  "Implement email nurture sequence",
                  "Optimize checkout flow"
                ]}
              />

              <TimelineItem 
                day="26-30"
                title="LAUNCH_SEQUENCE"
                description="Full-scale public release and PR push."
                status="pending"
                tasks={[
                  "Press release distribution",
                  "Product Hunt launch",
                  "Influencer activation"
                ]}
              />

            </div>
          </div>
        </div>

        {/* KPI Dashboard */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-emerald-500" />
              <h3 className="font-mono font-bold">PROJECTED_METRICS</h3>
            </div>

            <div className="space-y-6">
              <MetricCard label="Waitlist Signups" value="1,500" target="2,000" progress={75} />
              <MetricCard label="Conversion Rate" value="2.4%" target="3.5%" progress={68} />
              <MetricCard label="CAC" value="$12.50" target="$10.00" progress={80} inverse />
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-5 h-5 text-purple-500" />
              <h3 className="font-mono font-bold">QUICK_ACTIONS</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-sm font-mono text-left transition-colors flex items-center justify-between group">
                <span>Draft Press Release</span>
                <span className="opacity-0 group-hover:opacity-100 text-emerald-500">→</span>
              </button>
              <button className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-sm font-mono text-left transition-colors flex items-center justify-between group">
                <span>Schedule Social Posts</span>
                <span className="opacity-0 group-hover:opacity-100 text-emerald-500">→</span>
              </button>
              <button className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-sm font-mono text-left transition-colors flex items-center justify-between group">
                <span>Review Ad Creative</span>
                <span className="opacity-0 group-hover:opacity-100 text-emerald-500">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TimelineItem({ day, title, description, status, tasks }: { day: string; title: string; description: string; status: 'completed' | 'active' | 'pending'; tasks: string[] }) {
  const isCompleted = status === 'completed'
  const isActive = status === 'active'

  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-zinc-800 bg-zinc-950 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
        {isCompleted ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        ) : isActive ? (
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
        ) : (
          <Circle className="w-6 h-6 text-zinc-700" />
        )}
      </div>
      
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-zinc-950 border border-zinc-800 rounded-lg shadow-lg hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className={`font-mono text-xs font-bold px-2 py-1 rounded ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-900 text-zinc-500'}`}>
            DAY {day}
          </span>
          <span className="text-xs font-mono text-zinc-500 uppercase">{status}</span>
        </div>
        <h3 className="text-lg font-bold font-mono text-zinc-100 mb-1">{title}</h3>
        <p className="text-sm text-zinc-400 mb-4">{description}</p>
        
        <ul className="space-y-2">
          {tasks.map((task, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
              <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
              {task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MetricCard({ label, value, target, progress, inverse }: { label: string; value: string; target: string; progress: number; inverse?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono font-bold text-zinc-100">{value} <span className="text-zinc-600 text-xs">/ {target}</span></span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${inverse ? 'bg-amber-500' : 'bg-emerald-500'}`} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
