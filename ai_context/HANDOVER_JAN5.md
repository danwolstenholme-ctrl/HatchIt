# HANDOVER - January 5, 2026

## Session Summary

### What Was Done
1. **Unified Builder UI** - Made `/demo` and `/builder` use identical UI (both pass `isDemo={true}`)
2. **Storage Separation** - Changed storage logic from `isDemo` to `!isSignedIn` checks
3. **Header/Footer Redesign** - Stripped back to "confident restraint" aesthetic
4. **Studio Page Cleanup** - Removed duplicate buttons, toned down upgrade banner
5. **Brand Docs Updated** - `SINGULARITY_CORE.md` now reflects new visual language

### What's Broken (Needs Fixing)
1. **Studio "Create Project" not working** - Button spins, nothing happens
   - Check `handleCreate` function in `app/dashboard/studio/page.tsx`
   - Likely API error at `/api/project` endpoint

2. **Dashboard layout missing** - The dashboard shell/sidebar may have broken
   - Check `app/dashboard/layout.tsx`

3. **Guest import failing** - Was getting "Invalid template" error
   - Fixed to fallback to `landing-page` template
   - May need to clear `localStorage.hatch_guest_handoff` if stale data

### Files Modified This Session
- `components/Navigation.tsx` - Cleaner header
- `components/Footer.tsx` - Cleaner footer  
- `components/BuildFlowController.tsx` - `isDemo` → `!isSignedIn` for storage
- `components/SectionBuilder.tsx` - Same storage logic changes
- `app/builder/page.tsx` - Simplified, passes `isDemo={true}`
- `app/dashboard/studio/page.tsx` - UI cleanup (may have broken functionality)
- `app/api/project/import/route.ts` - Template ID fallback
- `ai_context/SINGULARITY_CORE.md` - Updated brand guidelines

---

## CRITICAL: Visual Code Standards

### The Philosophy
**"Confident restraint."** Premium SaaS that uses color sparingly.
Think: Linear, Vercel, Stripe - not "AI startup with glows."

### Color Palette
```
Surfaces:     zinc-950 (page bg), zinc-900 (cards/inputs)
Borders:      zinc-800 (solid, not transparent)
Text:         zinc-400 (secondary), zinc-200 (primary), white (headings)
Accent:       emerald-600 (primary CTA only), emerald-500 (hover)
```

### REQUIRED Patterns
```tsx
// Buttons - flat, not gradient
<button className="bg-emerald-600 hover:bg-emerald-500 text-white">Primary</button>
<button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200">Secondary</button>

// Inputs
<input className="bg-zinc-900 border border-zinc-800 rounded-md text-zinc-200 placeholder:text-zinc-600" />

// Cards
<div className="bg-zinc-900 border border-zinc-800 rounded-md p-4">

// Motion - subtle, purposeful
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
>
```

### BANNED Patterns
```tsx
// NO gradient buttons
className="bg-gradient-to-r from-emerald-600 to-teal-600"

// NO glowing shadows  
className="shadow-lg shadow-emerald-900/30"

// NO transparent borders
className="border-white/[0.06]"

// NO glass effects in chrome
className="bg-white/[0.02] backdrop-blur"
```

### Motion Library
Always use **Framer Motion** (`motion.div`, etc). Never write static UI.

---

## Key Architecture

### Builder Flow
```
/demo (guest)     → BuildFlowController (isDemo=true, uses localStorage)
/builder (auth)   → BuildFlowController (isDemo=true, uses Supabase)
```
Storage determined by `isSignedIn`, NOT `isDemo`.

### Tier System
| Tier | Price | Color | Projects |
|------|-------|-------|----------|
| Free | $0 | zinc | 3 |
| Architect | $19 | Emerald | 3 |
| Visionary | $49 | Violet | ∞ |
| Singularity | $199 | Amber | ∞ |

### Key Components
- `BuildFlowController.tsx` (2148 lines) - Main builder orchestration
- `SectionBuilder.tsx` (2978 lines) - Section building UI
- `SectionPreview.tsx` - Live preview iframe
- `Navigation.tsx` - Site header
- `Footer.tsx` - Site footer

---

## Debug Tips

### Clear Guest Data
```js
localStorage.removeItem('hatch_guest_handoff')
localStorage.removeItem('hatch_last_prompt')
localStorage.removeItem('hatch_guest_builds')
localStorage.removeItem('hatch_guest_refinements')
```

### Check API Errors
Open Network tab, look for failed requests to:
- `/api/project` (create)
- `/api/project/list` (list)
- `/api/project/import` (guest migration)

### Build Check
```bash
npm run build
```
If TypeScript errors, they'll show here.

---

## Priority Fixes Needed
1. Fix Studio "Create Project" - debug why API call fails
2. Verify dashboard layout is intact
3. Test full flow: Demo → Signup → Studio → Builder
4. Apply "confident restraint" to remaining UI (modals, builder chrome)

---

*Last updated: Jan 5, 2026 by Claude Opus*
