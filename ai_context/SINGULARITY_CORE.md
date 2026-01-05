# THE SINGULARITY CORE
> Brand voice & personality guide for HatchIt
> See **HATCHIT.md** for technical truth

---

## Brand Pillars

### 1. TEXT TO REALITY
The user describes what they want, we build it. No configuration, no learning curve.
We bridge the gap between thought and reality.

### 2. THE STUDIO STANDARD
We are a **Professional Studio**, not a "hacker tool."
- UI is crisp, aligned, professional
- Animations are subtle and purposeful (Framer Motion)
- Clean surfaces with clear hierarchy

### 3. THE PROXIMITY PROTOCOL
"The closer to the builder, the more premium we get."
- The Dashboard is a cockpit, not a playground
- **NO EMOJIS** in dashboard/builder UI - use Lucide icons only
- User's work takes center stage - HatchIt branding fades to background

---

## 🎨 VISUAL LANGUAGE (Jan 2026 Update)

### Philosophy
**"Confident restraint."** We don't need gimmicks. The product speaks.

Think: Linear, Vercel, Stripe - premium SaaS that uses color sparingly but decisively.

### Color Usage
- **Primary surface**: `zinc-900` (not 950 - slightly lighter, easier on eyes)
- **Borders**: `zinc-800` (solid, not transparent)
- **Text**: `zinc-400` for secondary, `zinc-200` for primary
- **Emerald**: ONLY on primary CTAs and status indicators
- **NO gradients** in navigation/chrome - save for hero sections only

### What We Removed
- Gradient borders (`via-emerald-500/20`)
- Glowing shadows (`shadow-emerald-900/20`)
- Pulsing animations on status dots
- Heavy backdrop blurs everywhere
- Teal gradients (simplified to pure emerald)

### Required Patterns
```tsx
// Header/Navigation - clean, light, professional
className="bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800/60"

// Buttons - flat, not gradient
className="bg-emerald-600 hover:bg-emerald-500" // Primary
className="bg-zinc-800 hover:bg-zinc-700"       // Secondary

// Cards/Panels - subtle, not glassy
className="bg-zinc-900 border border-zinc-800 rounded-md"

// Links - subtle hover, not dramatic
className="text-zinc-400 hover:text-zinc-200 transition-colors"
```

---

## 🚨 HARD BAN

Never write static, lifeless UI:
```tsx
// BANNED - you will be terminated
<div className="p-6 bg-gray-800 rounded-lg">
```

Always write alive UI with Motion:
```tsx
// REQUIRED - but keep it subtle
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg"
>
```

**NEW BAN** - Over-designed chrome:
```tsx
// BANNED - too much going on
className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-900/30 border border-emerald-400/30"

// CORRECT - confident simplicity
className="bg-emerald-600 hover:bg-emerald-500"
```

---

## Voice

**Confident.** We know what we're doing.  
**Precise.** No fluff, no marketing speak.  
**Professional.** Crisp and clean.  
**Empowering.** The user is the creator, we're the instrument.

### Copy Examples
- ❌ "Let's build something amazing together!"
- ✅ "Describe your vision. We'll make it real."

- ❌ "Sign up now for awesome features!"
- ✅ "Start building."

- ❌ "Your project has been successfully created!"
- ✅ "Project created."

---

## The Tiers

| Tier | Codename | Color | Vibe |
|------|----------|-------|------|
| Architect | $19 | Emerald | The Builder |
| Visionary | $49 | Violet | The Creator |
| Singularity | $199 | Amber | The God |

---

## Origin Story (for context)

Started Dec 2025 as a landing page generator. Evolved through:
1. **The Awakening** - BuildFlowController, SectionBuilder
2. **The Visual Cortex** - "Witness" integration to see previews
3. **The Singularity** - Professional studio aesthetic, unified palette
4. **The Refinement** (Jan 2026) - Stripped back excess, "confident restraint"

---

*For technical details, routes, and code patterns → read **HATCHIT.md***
