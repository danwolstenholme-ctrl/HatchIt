# HATCHIT
> Tech stack, design system, and build rules.
> **Last Updated:** January 6, 2026

---

## AI Rules

1. **Stack is locked.** Do not suggest, reference, or use any libraries/tools not listed below.
2. **Modern syntax only.** Use patterns from 2025+. No deprecated APIs, no legacy approaches.
3. **Tailwind 4.** Uses `@theme` directive. No `tailwind.config.js`, no `@apply` in components.
4. **React 19.** Server components default. Use `'use client'` only when needed.
5. **No explanations unless asked.** Just write the code.
6. **Read this file completely before making changes.** All patterns, bans, and implementations are documented here.

---

## Philosophy: Match The Product

**"Build this into the same quality as our users' sites."**

HatchIt generates premium React components for users. Our own UI (homepage, welcome modal, navigation) must match that quality. No shortcuts, no lazy static SVGs, no mismatched aesthetics.

When users see HatchIt, they should think: *"This is what I'm getting."*

### The Architect's Method
1. Read `/app/api/build-section/route.ts` - see how we instruct Claude
2. Apply those same principles to our own components
3. Test at 60fps - no performance compromises
4. Layer gradients for depth (0.05-0.08 opacity)
5. Motion with purpose - shimmer, pulse, lift, stagger
6. One focal animation per section - the rest supports

If we wouldn't generate it for a user, we don't build it for ourselves.

---

## What Is It?

**Text to React.** Users describe what they want → we generate production-ready React + Tailwind with live preview.

---

## Stack (Locked)

| Layer | Tech | Version |
|-------|------|---------|
| Framework | Next.js | 16.1.1 |
| React | React | 19.2.3 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.1.18 |
| Animation | Framer Motion | 12.x |
| Auth | Clerk | 6.36.5 |
| Database | Supabase | 2.89.0 |
| Payments | Stripe | 20.1.0 |
| AI | Claude Sonnet 4.5 (build), Haiku 4.5 (witness), Gemini 2.0 Flash |
| Icons | Lucide React | 0.562.0 |
| Hosting | Vercel |

**Tailwind 4** uses `@theme` directive, not `tailwind.config.js`.

---

## Routes

| Route | Auth | Purpose |
|-------|------|---------|
| `/` | No | Homepage |
| `/demo` | No | Guest sandbox (localStorage) |
| `/builder` | Yes | Real builder (Supabase) |
| `/dashboard/studio` | Yes | Project list + migration |
| `/dashboard/billing` | Yes | Subscription |

---

## Critical Files

| File | Lines | Risk |
|------|-------|------|
| `BuildFlowController.tsx` | ~2100 | HIGH |
| `SectionBuilder.tsx` | ~2900 | HIGH |
| `SectionPreview.tsx` | ~800 | Medium |
| `app/page.tsx` | ~700 | Medium |

---

## Design System

### Philosophy
**Confident restraint.** Linear, Vercel, Stripe energy. Emerald is our accent - not our identity.

### Colors
```
# Surfaces
bg-zinc-950      # Primary background
bg-zinc-900      # Cards, panels
bg-zinc-800      # Inputs, hover states

# Text
text-white       # Headings
text-zinc-200    # Body
text-zinc-400    # Secondary
text-zinc-500    # Muted

# Borders
border-zinc-800  # Default
border-zinc-700  # Hover

# Accent (USE SPARINGLY)
bg-emerald-600   # Primary CTA only
bg-emerald-500   # CTA hover
text-emerald-400 # Success, active states

# Tier Colors
emerald-400      # Architect
violet-400       # Visionary
amber-500        # Singularity
```

### Emerald Rules

**Use for:** Primary CTA (1-2 per page), success states, active states, key indicators.

**Don't use for:** Every hover, background washes, multiple elements in same view, decorative.

```tsx
// BAD: Emerald overload
<div className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">

// GOOD: Restrained
<div className="border-zinc-800 bg-zinc-900 text-zinc-200">
  <button className="bg-emerald-600 hover:bg-emerald-500 text-white">
```

### Motion

Subtle, not showy.

```tsx
// GOOD: Subtle entrance
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}

// GOOD: Gentle hover
whileHover={{ y: -2 }}

// BAD: Over the top
whileHover={{ y: -8, scale: 1.05, rotate: 2 }}
```

### Components

```tsx
// Primary button
className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"

// Secondary button
className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"

// Card
className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg"

// Interactive card
className="p-6 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors"
```

---

## Design System Components

Use the Singularity component library:
```tsx
import { Button, Card, Input, Badge, Modal } from '@/components/singularity'
```

| Component | Variants |
|-----------|----------|
| Button | primary, secondary, ghost, danger |
| Card | default, elevated, interactive, glass |
| Input | With label, error, hint |
| Badge | default, success, warning, error, architect, visionary, singularity |
| Modal | sm, md, lg, xl sizes |

---

## Animation Hierarchy

When multiple elements need motion, follow this priority:
1. **Primary** - The most important interaction (1 element)
2. **Secondary** - Supporting motion (subtle)
3. **Tertiary** - Background/ambient (barely noticeable)
4. **Static** - CTAs should be confident, not desperate

```tsx
// BAD: Competing animations
<Logo animate={{ scale: [1, 1.1, 1] }} />
<Arrow animate={{ x: [0, 5, 0] }} />
<Button animate={{ glow: [...] }} />  // Too much!

// GOOD: Clear hierarchy
<Logo />  // Static or very subtle breathing
<Arrow className="text-zinc-500" />  // Static, neutral
<Text animate={...} />  // ONE animated element
<Button />  // Static, strong
```

---

## Hard Bans

```tsx
// BANNED: SCALE ON HOVER - feels cheap
whileHover={{ scale: 1.05 }}
hover:scale-105

// BANNED: GLOW SHADOWS - 2024 energy
shadow-[0_0_20px_rgba(16,185,129,0.3)]
shadow-emerald-500/30 (on large elements)

// BANNED: BLUR BACKGROUNDS (100px+) - performance killer
blur-[100px]
blur-[120px]

// BANNED: EMERALD WASH - not our identity
bg-emerald-500/10
bg-emerald-500/20
border-emerald-500/30 (unless tier badge)

// BANNED: WHITE OPACITY PATTERNS
bg-white/5
bg-white/10

// BANNED: OFF-BRAND COLORS
cyan, teal (not in palette)
bg-gradient-to-r from-emerald-400 via-cyan-400 (wrong)

// BANNED: gray-* (use zinc-*)
className="bg-gray-800"

// BANNED: Gradient borders everywhere
className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20"

// BANNED: Old Tailwind (v3 patterns)
tailwind.config.js
@apply in components

// BANNED: Deprecated React
useEffect for data fetching (use Server Components)
getServerSideProps / getStaticProps (use app router)
className={styles.x} (CSS modules - use Tailwind)

// BANNED: Wrong libraries
styled-components, emotion, sass, less
axios (use fetch)
moment (use date-fns or native)
lodash (use native methods)
redux (use zustand if needed, prefer server state)
```

---

## Premium Feel Without Flash

```tsx
// GOOD: Layered depth - multiple gradients stacked
<div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_50%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.05),transparent_60%)]" />
  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
  {/* Content here */}
</div>

// GOOD: Hero section backdrop - layered for depth
<section className="relative">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_50%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.05),transparent_60%)]" />
  <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-transparent to-zinc-950/80" />
  <div className="relative z-10">{/* Content */}</div>
</section>

// GOOD: Subtle card depth
className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50"

// GOOD: Top highlight for glass effect
<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

// GOOD: Button shimmer effect (perpetual)
<button className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-500">
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
    animate={{ x: ['-200%', '200%'] }}
    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
  />
  <span className="relative">Button Text</span>
</button>

// GOOD: Pulsing status badge
<div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full backdrop-blur-sm">
  <motion.span 
    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 2, repeat: Infinity }}
    className="w-1.5 h-1.5 bg-emerald-400 rounded-full" 
  />
  Status Text
</div>

// GOOD: Card lift on hover
whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
className="... hover:shadow-2xl hover:shadow-black/20 transition-all"

// GOOD: Staggered reveal
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    {item.content}
  </motion.div>
))}
```

---

## The Architect's Method (Treat Your Own UI Like User Components)

When building internal pages (homepage, welcome modal, etc), **use the same quality standards our AI generates for users**.

### Process:
1. **Read `/app/api/build-section/route.ts`** - See how we instruct Claude Sonnet 4.5
2. **Apply those principles** - Layered gradients, depth, premium feel, motion
3. **Test at 60fps** - No heavy animated orbs (blur-[120px] with scale/position animation = 4fps death)
4. **Layer gradients** - Stack 2-3 radial gradients at low opacity (0.05-0.08) for depth
5. **Add subtle overlays** - `from-white/[0.02]` or `from-zinc-950/50` for richness
6. **Motion with purpose** - Shimmer buttons, pulsing badges, lift on hover, staggered reveals

### Gradient Opacity Rules:
```
0.08 = Primary focal point (hero top gradient)
0.05 = Secondary depth layer
0.02-0.03 = Subtle overlay for texture
```

### Performance Rules:
- BAD: `animate={{ scale/x/y }}` on `blur-[100px+]` elements = FPS death
- GOOD: Static radial gradients with layering = 60fps + depth
- GOOD: Shimmer effects (translate only) on small elements = performant
- GOOD: `whileHover` lift on cards = smooth

### Motion Timing:
```tsx
// Entry animations - ease out
transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}

// Hover states - quick
transition={{ duration: 0.3 }}

// Perpetual shimmer - slow and linear
transition={{ duration: 3, repeat: Infinity, ease: "linear" }}

// Pulsing badge - breathing rhythm
transition={{ duration: 2, repeat: Infinity }}
```

### Glassmorphism (Apple/Google Style):
```tsx
// GOOD: Primary CTA with glassmorphism + shimmer (hero, demo, welcome modal only)
<button className="relative px-8 py-4 bg-emerald-500/15 backdrop-blur-2xl border border-emerald-500/40 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-white rounded-xl overflow-hidden">
  {/* Glass refraction overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent rounded-xl pointer-events-none" />
  {/* Shimmer effect - PRIMARY CTAs ONLY */}
  <motion.div
    animate={{ x: ['-200%', '200%'] }}
    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
  />
  <span className="relative">Button Text</span>
</button>

// GOOD: Secondary CTA (no shimmer - for less critical actions)
<button className="px-6 py-3 bg-zinc-800/50 backdrop-blur-xl hover:bg-zinc-800/60 text-zinc-200 border border-zinc-700/50 hover:border-zinc-600 rounded-xl transition-all">
  Button Text
</button>

// GOOD: Tertiary/Ghost button (navigation links)
<button className="px-4 py-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900/50 transition-all">

// GOOD: Feature pills with glass
<div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 hover:bg-zinc-900/50 hover:border-zinc-700/50 rounded-lg px-4 py-3">

// GOOD: Navigation bar with glass
<nav className="bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-800/50">

// GOOD: Tight button glow (PRIMARY only)
shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]

// GOOD: Arrow icon hover glow
<ArrowRight className="group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
```

**Button Hierarchy:**
- **Primary (shimmer):** "Try Demo", Welcome Modal CTAs, Final CTA - max 1-2 per page
- **Secondary (no shimmer):** "See how it works", "Get Started" on pricing, Portal button
- **Tertiary (ghost):** "Sign In", navigation links, less critical actions

**Glassmorphism Rules:**
- Background: `/15` base → `/20` hover (very low opacity)
- Blur: `backdrop-blur-2xl` for buttons, `backdrop-blur-xl` for cards
- Borders: `/40` base → `/50` hover (visible glass edge)
- Overlay: `from-white/[0.08]` gradient for refraction effect
- Glow: Custom shadows `[0_0_15px_rgba(...)]` - PRIMARY buttons only
- Shimmer: PRIMARY buttons only (hero, demo, welcome)

### Brand Animation Signature (2026):

#### Logo: Isometric Hatching Cube (replaces static SVG)
**Location:** [components/Navigation.tsx](components/Navigation.tsx)

4-layer animated isometric cube based on original "hatching egg" SVG:

```tsx
<div className="relative flex items-center gap-3 group">
  {/* LOGO: 4-layer isometric cube */}
  <div className="relative w-7 h-7" style={{ 
    transformStyle: 'preserve-3d',
    transform: 'rotateX(30deg) rotateZ(-45deg)'
  }}>
    {/* Layer 1: Outer glow (breathing pulse) */}
    <motion.div
      animate={{ 
        scale: [1, 1.15, 1],
        opacity: [0.2, 0.4, 0.2]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-emerald-400/20 rounded-sm blur-md"
    />

    {/* Layer 2: Left face (skewed left, pulsing opacity) */}
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 to-emerald-600/60 rounded-sm"
      style={{ 
        transformOrigin: 'left center',
        transform: 'skewY(-30deg) scaleX(0.866)'
      }}
    />

    {/* Layer 3: Right face (skewed right, pulsing opacity offset) */}
    <motion.div
      animate={{ opacity: [0.6, 0.9, 0.6] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute inset-0 bg-gradient-to-bl from-teal-500/50 to-emerald-500/70 rounded-sm"
      style={{ 
        transformOrigin: 'right center',
        transform: 'skewY(30deg) scaleX(0.866)'
      }}
    />

    {/* Center seam */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
    </div>

    {/* Layer 4: Lifting lid (top section with clip) */}
    <motion.div
      animate={{ 
        y: [-1, -2.5, -1],
        opacity: [0.6, 0.85, 0.6]
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-gradient-to-b from-emerald-400/70 via-emerald-500/50 to-transparent rounded-sm"
      style={{ 
        clipPath: 'polygon(0 0, 100% 0, 90% 40%, 10% 40%)'
      }}
    />

    {/* Core: Pulsing egg center */}
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-2 h-2.5 bg-gradient-to-b from-amber-300 to-amber-500 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.4)]"
        style={{ borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%' }}
      />
    </div>
  </div>

  {/* WORDMARK */}
  <div className="flex items-center gap-2">
    <span className="font-bold text-lg text-white">HatchIt</span>
    <div className="h-4 w-[1px] bg-zinc-700" />
    <motion.span 
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="text-sm font-medium text-emerald-400"
    >
      Text → React
    </motion.span>
  </div>
</div>
```

**Animation Timing:**
- Glow: 3s breathing
- Left face: 4s opacity pulse
- Right face: 4s opacity pulse (2s delay offset)
- Lid: 5s lift cycle (-1px → -2.5px → -1px)
- Core egg: 3s scale/opacity pulse

**Transforms:**
- Isometric view: `rotateX(30deg) rotateZ(-45deg)` on container
- Left face: `skewY(-30deg) scaleX(0.866)`
- Right face: `skewY(30deg) scaleX(0.866)`
- Lid: `clipPath: polygon(0 0, 100% 0, 90% 40%, 10% 40%)`

---

#### Logo Implementation Notes:
- New geometric "H" lettermark at `/public/icon.svg`
- Emerald gradient with diagonal slash representing code/build
- Three animated indicator dots for "output" metaphor
- Clean, minimal, professional design
- Favicon at `/public/favicon.svg`

---

#### Welcome Modal: Synchronized Text Loading
**Location:** [components/HomepageWelcome.tsx](components/HomepageWelcome.tsx)

**Problem:** Text loaded at different times (typewriter effect delayed "React" text)

**Solution:** All text wrapped in single motion.div, synchronized timing

```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1, duration: 0.6 }}
  className="space-y-6"
>
  {/* All text loads together - no phase state, no typewriter */}
  <div className="space-y-3">
    <h2 className="text-4xl font-bold text-white">
      Turn text into{' '}
      <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
        React
      </span>
    </h2>
    <p className="text-lg text-zinc-300">
      Describe what you want. We'll generate it.
    </p>
  </div>

  {/* Feature grid - slight stagger */}
  <motion.div 
    className="grid grid-cols-2 gap-3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
  >
    {features.map((feature, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + (i * 0.05), duration: 0.4 }}
        className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 hover:bg-zinc-900/50 hover:border-zinc-700/50 rounded-lg px-4 py-3"
      >
        {/* Feature content */}
      </motion.div>
    ))}
  </motion.div>

  {/* Buttons - load last */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
    className="flex flex-col gap-3"
  >
    {/* Primary button with shimmer */}
    <button className="relative overflow-hidden px-8 py-4 bg-emerald-500/15 backdrop-blur-2xl border border-emerald-500/40">
      {/* Glass refraction */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
      {/* Shimmer */}
      <motion.div
        animate={{ x: ['-200%', '200%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
      />
      <span className="relative">Get Started</span>
    </button>
    
    {/* Secondary button - no shimmer */}
    <button className="px-6 py-3 bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50">
      Learn More
    </button>
  </motion.div>
</motion.div>
```

**Key Changes (Jan 6, 2026):**
- Removed `TypewriterText` component (47 lines - useState, useEffect, cursor animation)
- Removed phase state (`'init' | 'ready'`) and conditional rendering
- Single motion wrapper at delay 0.1s, duration 0.6s
- Feature grid: delay 0.3s, items stagger 0.05s
- Buttons: delay 0.5s
- Glassmorphism on feature pills and buttons
- Primary button has shimmer (hero CTA), secondary does not

**Dead Code Removed:**
- TypewriterText function component (lines 9-48 in old version)
- Phase state management
- useEffect timers
- Cursor animation logic

---

#### Hero Text: Breathing "React" Animation
**Location:** [app/page.tsx](app/page.tsx)

```tsx
<motion.span
  animate={{ 
    textShadow: [
      '0 0 20px rgba(16,185,129,0.3)',
      '0 0 40px rgba(16,185,129,0.4)',
      '0 0 20px rgba(16,185,129,0.3)'
    ]
  }}
  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent"
>
  <motion.span
    animate={{ scale: [1, 1.02, 1] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    className="inline-block"
  >
    React
  </motion.span>
</motion.span>
```

**Synchronized:** Scale (1.02) + glow breathing, 3s cycle, subtle not showy

---

#### Floating Particles: Ambient Depth
**Location:** [app/page.tsx](app/page.tsx)

```tsx
{/* Floating particles */}
{[...Array(12)].map((_, i) => (
  <motion.div
    key={i}
    animate={{
      y: [0, -30, 0],
      x: [0, Math.sin(i) * 20, 0],
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.2, 1]
    }}
    transition={{
      duration: 8 + i,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.5
    }}
    className="absolute w-1 h-1 bg-emerald-400/40 rounded-full blur-sm"
    style={{ 
      left: `${10 + (i * 7)}%`, 
      top: `${20 + (i % 4) * 15}%` 
    }}
  />
))}
```

**12 particles:** Organic Y/X movement, 8-20s cycles, opacity 0.1-0.3, staggered 0.5s delays

---

#### Navigation CTAs: Clear Intent
**Location:** [components/Navigation.tsx](components/Navigation.tsx)

**Signed Out:**
- "Try Demo" - Primary button (bg-emerald-500/15, shimmer)
- "Sign In" - Ghost button (text-zinc-400 hover:text-white)

**Signed In:**
- "Portal" - Secondary button (bg-zinc-800/50, no shimmer)
- User button with subscription badge

**Logic:**
- Portal = Secure access to `/dashboard/studio` (Supabase projects)
- Demo = Guest sandbox `/demo` (localStorage)

---

// GOOD: Hero brand word breathing (synchronized scale + glow)
<motion.span
  animate={{ 
    textShadow: [
      '0 0 20px rgba(16,185,129,0.3)',
      '0 0 40px rgba(16,185,129,0.4)',
      '0 0 20px rgba(16,185,129,0.3)'
    ]
  }}
  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent"
>
  <motion.span
    animate={{ scale: [1, 1.02, 1] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    className="inline-block"
  >
    React
  </motion.span>
</motion.span>

// GOOD: Floating particles for ambient depth
{[...Array(12)].map((_, i) => (
  <motion.div
    key={i}
    animate={{
      y: [0, -30, 0],
      x: [0, Math.sin(i) * 20, 0],
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.2, 1]
    }}
    transition={{
      duration: 8 + i,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.5
    }}
    className="absolute w-1 h-1 bg-emerald-400/40 rounded-full blur-sm"
    style={{ left: `${10 + (i * 7)}%`, top: `${20 + (i % 4) * 15}%` }}
  />
))}

// GOOD: Navigation link micro-interactions
<motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
  <Link href="/demo" className="group">
    <Zap className="group-hover:text-emerald-400 transition-colors" />
    Demo
  </Link>
</motion.div>

// GOOD: Shimmer with rhythm (repeatDelay for pacing)
<motion.div
  animate={{ x: ['-200%', '200%'] }}
  transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
/>
```

**Brand Animation Identity:**
- Logo: 3s breathing cycle, emerald pulse blur
- Hero brand word: Synchronized scale (1.02) + glow breathing
- Particles: 8-16s cycles, staggered 0.5s delays, opacity 0.1-0.3
- Nav links: -1px lift, 0.98 tap scale
- Shimmer: 2-3s with 1s repeatDelay for rhythm
- All use `ease: "easeInOut"` for organic breathing feel
- Never more than ONE focal animation per screen section

---

## Premium Feel Without Flash

```tsx
// GOOD: Subtle card depth
className="bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-2xl shadow-black/50"

// GOOD: Top highlight for glass effect
<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

// GOOD: Subtle gradient overlay
<div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

// GOOD: Button with depth (not glow)
className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20"

// GOOD: Noise texture for premium feel
style={{ backgroundImage: 'url("data:image/svg+xml,...")' }}
```

---

## Quick Reference

```tsx
// Demo vs Auth
<BuildFlowController isDemo={true} />   // localStorage
<BuildFlowController />                  // Supabase

// Premium gate
if (isDemo) {
  setHatchModalReason('deploy')
  setShowHatchModal(true)
  return
}

// Import design system
import { Button, Card, Modal } from '@/components/singularity'
```

---

## Glass Style Audit (Jan 6, 2026)

**All public pages now use the CORRECT glass style:**
```tsx
// CORRECT - Use this for all cards/modals
bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/50 shadow-2xl shadow-black/50
```

**Pages FIXED:**
- `/faq` - FAQ cards
- `/features` - Core Modules, Neural Network, Tech Stack
- `/how-it-works` - System Architecture cards, CTA
- `/about` - Stats cards, founder quote, CTA
- `/roadmap` - Timeline cards, technical details
- `/changelog` - Entry cards, header icon
- `/manifesto` - Section icons, CTA card
- `/contact` - Form inputs, support channels

**BANNED patterns (removed):**
```tsx
// BANNED: NEVER USE
bg-white/5    // Use bg-zinc-900/70 instead
border-white/10   // Use border-zinc-800/50 instead
bg-zinc-900 (solid)  // Add /70 opacity + backdrop-blur
backdrop-blur-sm  // Use backdrop-blur-xl
```

**EXCEPTION:** Clerk sign-in/sign-up pages use `bg-white/5` for Clerk's internal styling. This is acceptable.

---

## Tech Debt

**Layout duplication:** SectionBuilder has separate demo/auth layouts. Should be ONE layout, `isDemo` changes behavior only.

---

*"God is in the details. Make it feel expensive."*
*This is the build truth.*
