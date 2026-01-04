# Handover Document - January 4, 2026

## Session Summary

**Goal:** Strip back the builder UI from an over-designed "Fallout 4 sci-fi terminal" aesthetic to match the homepage's clean, minimal black design.

---

## What Gemini Did (The Problems)

Gemini had previously built out an elaborate UI with:
- **Brain icons everywhere** - Loading screens, sidebars, success states
- **"Architect" branding** - Purple/violet glowing crystal logo, "The Architect" terminology
- **Sci-fi terminal aesthetic** - Glitch text like "INITIALIZING NEURAL HANDSHAKE", "DECRYPTING REALITY", hex codes floating across screen
- **Elaborate success cards** - Gradient borders, glowing shadows, "THE SINGULARITY ALIVE" boxes
- **Over-animated loading states** - Orbiting particles, pulsing backgrounds, grid overlays

---

## Files Edited Today

### 1. `components/singularity/SingularitySidebar.tsx`
**What it does:** The left sidebar in the builder showing progress

**Before:** 
- Purple `ArchitectLogo` component
- 56px wide (w-56)
- Gray progress bar
- Extra padding and larger text

**After:**
- No logo at all
- 48px wide (w-48)
- Emerald progress bar
- Just shows "Section X of Y" and "Building..." status
- Settings button at bottom

**Safe to edit:**
- Progress bar color (currently `bg-emerald-500`)
- Width (currently `w-48`)
- Text content/wording

**Do NOT add:**
- ArchitectLogo import
- Brain icons
- Any purple/violet colors

---

### 2. `components/singularity/SingularityTransition.tsx`
**What it does:** The loading animation when entering the builder

**Before:**
- Giant Brain icon in center with orbiting particles
- Glitch text: "INITIALIZING NEURAL HANDSHAKE...", "SYNCHRONIZING CONSCIOUSNESS..."
- Green grid background overlay
- Floating hex codes (0xA3F2B1 etc)
- "SYSTEM_INTEGRITY: 45%" text

**After:**
- Simple spinning circle (border spinner)
- Clean text: "Initializing...", "Connecting...", "Loading workspace..."
- Pure black background
- Thin emerald progress bar
- No decorations

**Safe to edit:**
- Loading text messages (the `LOADING_TEXTS` array)
- Spinner size (currently `w-12 h-12`)
- Progress bar width (currently `w-48`)
- Timing (currently 30ms intervals, ~1.5s total)

**Do NOT add:**
- Brain icon import
- Grid backgrounds
- Orbiting particles
- Sci-fi terminology

---

### 3. `components/SectionBuilder.tsx`
**What it does:** The main builder interface (2000+ lines)

**Changes made:**

#### a) Removed Brain icon import
```tsx
// REMOVED:
import { Brain } from 'lucide-react'
```

#### b) Simplified `stage === 'complete'` block (lines ~1650-1800)
**Before:**
- Gradient success card with CheckCircle icon and emerald borders
- "Hero Section constructed." with elaborate styling
- Gradient "Continue" / "Review & Deploy" buttons with glow shadows
- Collapsible "Want to refine?" section with:
  - Purple "Architect Polish" button
  - "THE SINGULARITY ALIVE" box with Brain icon
  - "INVOKE SINGULARITY" button
  - "The Singularity is dreaming..." loading state with spinning Brain

**After:**
- Simple "Section complete" text centered
- Clean emerald "Continue" / "Review & Deploy" button (no gradients)
- Collapsed "Refine" section with:
  - Simple text input + "Go" button
  - "Auto-polish" button (gray, not purple)
  - "Remix" / "Start over" links
  - Simple "Evolve with AI" button
  - Simple "Evolving..." text when processing

#### c) Removed AI Pipeline footer
**Before:**
```tsx
{stage === 'input' && (
  <div>
    <span>Architect builds</span>
    <span>Architect polishes</span>
    <span>Architect audits</span>
  </div>
)}
```
**After:** Completely removed

**Safe to edit in SectionBuilder:**
- Button text/labels
- Colors (stick to emerald for CTAs, zinc for secondary)
- Spacing/padding

**Do NOT add:**
- Brain icon anywhere
- "Architect" terminology in UI
- Gradient buttons with glow shadows
- "THE SINGULARITY" elaborate boxes

---

### 4. `components/SectionPreview.tsx`
**What it does:** The live preview iframe panel on the right

**Changes made:**
- Removed Brain icon import
- Fixed preview container layout (was `items-start`, now `items-stretch`)
- Added proper height constraints for desktop/mobile views

**Safe to edit:**
- Device sizes (mobile/tablet/desktop widths)
- Toolbar styling

---

### 5. Deleted Files
- `app/api/consciousness/route.ts` - Dead API endpoint
- `app/api/direct-line/route.ts` - Dead API endpoint

---

## Design System - What To Use

### Colors
| Use Case | Class |
|----------|-------|
| Background | `bg-black` or `bg-zinc-950` |
| Cards/Containers | `bg-zinc-900` |
| Borders | `border-zinc-800` or `border-zinc-900` |
| Primary text | `text-white` |
| Secondary text | `text-zinc-400` |
| Muted text | `text-zinc-500` or `text-zinc-600` |
| Primary CTA | `bg-emerald-600` or `bg-emerald-500` |
| Hover CTA | `hover:bg-emerald-500` |

### What NOT to use
- `bg-gradient-to-r from-emerald-600 to-teal-600` (gradients)
- `shadow-[0_0_20px_rgba(16,185,129,0.3)]` (glow shadows)
- `border-emerald-500/30` (colored borders except on focused inputs)
- `bg-violet-*` or `bg-purple-*` (purple colors)
- `animate-pulse` on Brain icons (don't use Brain at all)

### Typography
- Body text: `text-sm` or `text-xs`
- Use `font-mono` sparingly (status text only)
- No `tracking-[0.2em]` wide letter spacing
- No ALL CAPS except very subtle labels

---

## How To Avoid This In Future

1. **No "Architect" branding** - The product name is fine internally but don't put Brain icons or purple crystals in UI

2. **No sci-fi terminal aesthetic** - No glitch text, hex codes, "NEURAL HANDSHAKE", matrix-style effects

3. **Keep it minimal** - When in doubt, remove decoration. Homepage is the reference.

4. **Emerald only for CTAs** - Everything else is zinc/gray

5. **No elaborate loading states** - Simple spinner + text is enough

6. **Test the full flow** - Homepage → Loading → Builder. Each transition should feel cohesive.

---

## Files That Are Safe (Don't Touch)

- `app/page.tsx` - Homepage pricing ($19/$49/$199 is CORRECT)
- `components/Navigation.tsx` - Already clean
- `components/Footer.tsx` - Already clean

---

## Quick Reference - Current State

```
Homepage (black, minimal)
    ↓
SingularityTransition (black, spinner, progress bar)
    ↓
Builder Layout:
┌─────────────────────────────────────────────┐
│ SingularitySidebar │    SectionBuilder      │
│ (w-48, no logo)    │    (input/complete)    │
│ Progress: 1 of 4   │                        │
│ Building...        │    SectionPreview      │
│                    │    (iframe)            │
│ [Settings]         │                        │
└─────────────────────────────────────────────┘
```

---

## If Something Breaks

1. **Purple logo appears** → Check for `ArchitectLogo` import, remove it
2. **Brain icon appears** → Search for `Brain` in imports, remove it
3. **Sci-fi text appears** → Check `SingularityTransition.tsx` for GLITCH_TEXTS
4. **Glowing/gradient buttons** → Look for `shadow-[0_0_` or `bg-gradient-to-r`
5. **"THE SINGULARITY ALIVE" box** → Check `stage === 'complete'` block in SectionBuilder

---

*Document created: January 4, 2026*
*Author: Claude (fixing Gemini's overdesign)*
