'use client'

import { forwardRef, ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

// =============================================================================
// CARD - Core design system component
// Follows "Confident Restraint" philosophy
// =============================================================================

type CardVariant = 'default' | 'elevated' | 'interactive' | 'glass'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: CardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
  animate?: boolean
  children: ReactNode
}

const variants: Record<CardVariant, string> = {
  default: 'bg-zinc-900 border border-zinc-800',
  elevated: 'bg-zinc-900 border border-zinc-800 shadow-xl shadow-black/50',
  interactive: 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer',
  // Glass: matches HomepageWelcome modal style
  glass: 'bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/50 shadow-2xl shadow-black/50',
}

const paddings: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  padding = 'md',
  animate = false,
  className = '',
  children,
  ...props
}, ref) => {
  const baseClasses = `rounded-xl ${variants[variant]} ${paddings[padding]} ${className}`

  if (animate) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div ref={ref} className={baseClasses} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card
