'use client'

import { forwardRef, InputHTMLAttributes } from 'react'

// =============================================================================
// INPUT - Core design system component
// Follows "Confident Restraint" philosophy
// =============================================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`
          w-full px-4 py-3 
          bg-zinc-900 border rounded-lg
          text-white placeholder-zinc-500
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-emerald-500/20
          ${error 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-zinc-800 hover:border-zinc-700 focus:border-zinc-700'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-2 text-sm text-zinc-500">{hint}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
