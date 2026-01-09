'use client'

interface HatchLogoProps {
  className?: string
  size?: number
  layout?: 'icon' | 'full'
  href?: string
}

function EggIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300"
    >
      <defs>
        <linearGradient id="inner-glow" x1="32" y1="20" x2="32" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>

        <linearGradient id="shell-gradient" x1="10" y1="10" x2="50" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f4f4f5" />
          <stop offset="1" stopColor="#a1a1aa" />
        </linearGradient>
      </defs>

      <circle
        cx="32"
        cy="38"
        r="14"
        fill="url(#inner-glow)"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
      />

      <path
        d="M26 34L22 38L26 42M38 34L42 38L38 42"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        className="opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 scale-0 group-hover:scale-100 origin-center"
      />

      <path
        d="M12.5 36C14 50 22 60 32 60C42 60 50 50 51.5 36L44 38L38 32L32 38L26 32L20 38L12.5 36Z"
        fill="url(#shell-gradient)"
        stroke="#18181b"
        strokeWidth="1.5"
        className="origin-bottom transition-transform duration-300"
      />

      <path
        d="M32 4C22 4 14 14 12.5 32L20 34L26 28L32 34L38 28L44 34L51.5 32C50 14 42 4 32 4Z"
        fill="url(#shell-gradient)"
        stroke="#18181b"
        strokeWidth="1.5"
        className="origin-center group-hover:-translate-y-1.5 group-hover:-rotate-3 transition-transform duration-300 ease-out"
      />
    </svg>
  )
}

function Wordmark({ size, className }: { size: number; className: string }) {
  return (
    <svg viewBox="0 0 100 32" height={size} className={`ml-2 transition-opacity duration-300 ${className}`} aria-label="HatchIt">
      <defs>
        <linearGradient id="wordmark-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <text x="0" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="24" letterSpacing="-0.03em">
        <tspan fill="currentColor" className="text-zinc-100">
          Hatch
        </tspan>
        <tspan fill="url(#wordmark-gradient)">It</tspan>
      </text>
    </svg>
  )
}

export const HatchLogo = ({ className = '', size = 32, layout = 'full', href }: HatchLogoProps) => {
  const content = (
    <div className={`inline-flex items-center group relative cursor-pointer ${className}`}>
      <EggIcon size={size} />
      {layout === 'full' && <Wordmark size={size} className={className} />}
      <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
    </div>
  )

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    )
  }

  return content
}