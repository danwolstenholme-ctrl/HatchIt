'use client'

import { ReactNode } from 'react'

// =============================================================================
// BADGE - Core design system component
// =============================================================================

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'architect' | 'visionary' | 'singularity'

interface BadgeProps {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  children: ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  error: 'bg-red-500/10 text-red-400 border-red-500/30',
  // Tier badges
  architect: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  visionary: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  singularity: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
}

const sizes: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export default function Badge({ 
  variant = 'default', 
  size = 'sm',
  children, 
  className = '' 
}: BadgeProps) {
  return (
    <span 
      className={`
        inline-flex items-center font-medium rounded-full border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
