# AI CONTEXT — SINGLE SOURCE OF TRUTH
> **MANDATORY READ BEFORE ANY WORK**
> Last Updated: January 6, 2026

---

## DEVIATION TRIGGERS

If ANY of these are violated, STOP and re-read this file:

| Trigger | Check |
|---------|-------|
| Wrong route | Guest → `/demo`, Auth → `/builder` |
| Wrong tier names | Must be: Architect, Visionary, Singularity |
| Wrong prices | $19, $49, $199 |
| Wrong model | Claude Sonnet 4.5 (not GPT, not 3.5) |
| Wrong colors | emerald-400/500, zinc-*, NO cyan/teal |
| Glass style wrong | `bg-zinc-900/70 backdrop-blur-xl border-zinc-800/50` |
| Button style wrong | Primary = shimmer glass, Secondary = solid zinc |
| Using /memory folder | DELETED. Only /ai_context exists |

**If memory feels fuzzy → Re-read HATCHIT.md**

---

## Quick Reference

### Stack
- Next.js 16.1.1, React 19, TypeScript, Tailwind 4
- Clerk auth, Supabase DB, Stripe payments
- Claude Sonnet 4.5 (build), Haiku 4.5 (witness)

### Routes

**PUBLIC (No Auth):**
```
/              → Homepage
/demo          → Guest sandbox (localStorage)
/how-it-works  → Product explanation
/features      → Capabilities
/pricing       → Dedicated pricing page
/about         → Company
/contact       → Contact form
/faq           → FAQ
/roadmap       → Future plans
/changelog     → Updates
/manifesto     → Vision/philosophy
/privacy       → Legal
/terms         → Legal
/sign-in       → Clerk
/sign-up       → Clerk
```

**PROTECTED (Clerk Gate):**
```
/builder       → Auth builder (Supabase)
/dashboard/*   → Project list, billing
/api/project/* → Project CRUD
/api/build-section
/api/refine-section
/api/export
/api/deploy
/api/generate
```

### Navigation Structure
**Nav Bar:** How It Works | Features | Pricing | [Try Demo] [Sign In/Dashboard]
**Footer:** Product, Resources, Company, Legal, Connect

### Tiers
| Tier | Price | Projects | Deploy | Export |
|------|-------|----------|--------|--------|
| Free | $0 | 3 | No | No |
| Architect | $19 | 3 | Yes | Yes |
| Visionary | $49 | Unlimited | Yes | Yes |
| Singularity | $199 | Unlimited | Yes | Yes |

### User Flow
```
GUEST: Homepage → /demo → Build → Deploy CTA → Signup → /dashboard/studio
AUTH:  Homepage → /builder OR /dashboard
```

### localStorage Keys
| Key | Purpose |
|-----|---------|
| `hatch_guest_handoff` | Project data for migration |
| `hatch_guest_builds` | Build count |
| `hatch_guest_refinements` | Refine count |
| `hatch_intro_v2_seen` | Welcome modal shown |

---

## Design Tokens (LOCKED)

### Glass Style (all modals/cards)
```tsx
bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/50 shadow-2xl shadow-black/50
```

### Primary Button (shimmer, 1-2 per page)
```tsx
bg-emerald-500/15 backdrop-blur-2xl border border-emerald-500/40 
hover:bg-emerald-500/20 hover:border-emerald-500/50 
text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]
+ shimmer animation + gradient overlay
```

### Secondary Button
```tsx
bg-zinc-800/50 backdrop-blur-xl hover:bg-zinc-800/60 
text-zinc-200 border border-zinc-700/50 hover:border-zinc-600
```

### Geometric H Mark (brand icon)
```tsx
<div className="w-X h-X relative">
  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
  <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" />
</div>
```

---

## Critical Files (HIGH RISK)

| File | Lines | DO NOT touch without full context |
|------|-------|-----------------------------------|
| BuildFlowController.tsx | ~2100 | Phase management, routing |
| SectionBuilder.tsx | ~2900 | AI generation, preview |
| SectionPreview.tsx | ~800 | Live rendering |

---

## Component Library

```tsx
import { Button, Card, Input, Badge, Modal } from '@/components/singularity'
```

All follow "Confident Restraint" philosophy. See HATCHIT.md for variants.

---

## Dead Code Policy

If a component isn't imported anywhere → DELETE IT.
No "maybe later" files. Clean codebase = fast development.

Deleted today (Jan 6):
- `/memory/` entire folder (outdated, conflicted with this file)
- `BottomBar.tsx` (never imported)
- `VoidTransition.tsx` (exported, never used)
- `ThinkingLog.tsx` (exported, never used)

---

## Glass Style Audit (Jan 6, 2026)

**FIXED - All public pages now use proper glass style:**
- FAQ, Features, How-It-Works, About, Roadmap, Changelog, Manifesto, Contact

**Banned patterns REMOVED:**
- `bg-white/5` → `bg-zinc-900/70 backdrop-blur-xl`
- `border-white/10` → `border-zinc-800/50`
- `bg-zinc-900` (solid) → `bg-zinc-900/70 backdrop-blur-xl`
- Missing `shadow-2xl shadow-black/50` → Added

**EXCEPTION - Clerk components:**
- Sign-in/Sign-up pages use `bg-white/5` for Clerk's internal styling
- This is acceptable as Clerk controls its own component appearance

**Pattern Verification:**
```powershell
# Run to verify no banned patterns remain:
Get-ChildItem -Path "app" -Recurse -Filter "page.tsx" | Select-String -Pattern "bg-white/[0-9]"
# Should only return dashboard/* and sign-in/sign-up (acceptable)
```

---

## Update Protocol

When changing ANY of the following, update this file IMMEDIATELY:
- Route structure
- Tier names/prices
- Auth flow
- Design tokens
- Component library

**This file is the contract. Code must match this file.**
