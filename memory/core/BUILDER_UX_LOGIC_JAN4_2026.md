# HatchIt Builder UX & Logic - Complete Technical Memory
**Created:** January 4, 2026  
**Build Status:** ✅ PASSING  
**Checkpoint Commit:** Ready for commit

---

## 🎯 CRITICAL: User Flow Architecture

### Flow 1: Guest Users (Not Signed In)
```
Homepage (/) 
    ↓ Click "Try It" or any CTA
/demo (VoidTransition plays)
    ↓ Enter optional prompt, click "Begin"
/builder?mode=guest&prompt={prompt}
    ↓ Guest sees floating input panel (no sidebar, no section progress)
    ↓ Can generate ONE section for free
    ↓ HatchModal triggers after generation → Sign Up
```

### Flow 2: Signed-In Users
```
Homepage (/)
    ↓ Click "Start Building" (SingularityTransition plays)
/builder
    ↓ Full builder with sidebar + section progress
    ↓ Tier-based limits apply (3 free, unlimited paid)
```

---

## 🏗️ Component Architecture

### God Files (Large, Critical)
| File | Lines | Purpose |
|------|-------|---------|
| `components/BuildFlowController.tsx` | ~2,290 | Master orchestrator - controls sidebar, section flow, guestMode |
| `components/SectionBuilder.tsx` | ~2,343 | Individual section building - input handling, AI generation, preview |
| `components/SectionPreview.tsx` | ~680 | Live preview iframe with device modes |

### Singularity Components (`/components/singularity/`)
| File | Purpose |
|------|---------|
| `SingularityTransition.tsx` | Homepage → Builder animation (signed-in users) |
| `VoidTransition.tsx` | Demo → Builder animation (guests) |
| `SingularitySidebar.tsx` | Left sidebar with section list, project info |
| `ThinkingLog.tsx` | AI thinking display during generation |
| `TheWitness.tsx` | Consciousness feedback system |

---

## 🔑 Key Props & State

### BuildFlowController.tsx
```typescript
// Guest mode detection from URL
const searchParams = useSearchParams()
const isGuestMode = searchParams.get('mode') === 'guest'

// Key conditionals for guest mode:
{!isGuestMode && <SingularitySidebar ... />}
{!isGuestMode && <SectionProgress ... />}

// Passes to SectionBuilder:
<SectionBuilder
  guestMode={isGuestMode}
  // ... other props
/>
```

### SectionBuilder.tsx
```typescript
interface SectionBuilderProps {
  section: Section
  dbSection: any
  projectId: string
  onComplete: (code: string) => void
  onNextSection?: () => void
  isLastSection?: boolean
  allSectionsCode?: string[]
  demoMode?: boolean      // Legacy - don't use
  brandConfig?: any
  isPaid?: boolean
  guestMode?: boolean     // NEW - Guest user mode
}

// CRITICAL: guestMode check MUST come BEFORE isInitialState check
// Around line ~1255 in the render section:

// Guest mode floating panel (checked FIRST)
if (guestMode && !generatedCode && !isRefining) {
  return <FloatingGuestPanel />
}

// Then initial state for signed-in users
if (isInitialState) {
  return <CenteredInitialUI />
}
```

---

## 🎨 UI States

### Guest Mode UI (Floating Panel)
```
┌─────────────────────────────────────────────────┐
│                                                 │
│     [Preview Area - Full Width]                 │
│                                                 │
│     ┌─────────────────────────────┐             │
│     │  What do you want to build? │  ← Floating │
│     │  [Input field............]  │    Panel    │
│     │  [Generate Button]          │             │
│     └─────────────────────────────┘             │
│                                                 │
└─────────────────────────────────────────────────┘
```
- No sidebar
- No section progress
- Floating panel centered on preview

### Signed-In Initial State UI
```
┌────────┬────────────────────────────────────────┐
│        │                                        │
│ Sidebar│     [Full Centered Input Card]         │
│        │     Logo + "Build anything"            │
│        │     [Large input area]                 │
│        │     [Template chips]                   │
│        │                                        │
└────────┴────────────────────────────────────────┘
```

### Active Building State (Both)
```
┌────────┬─────────────────────┬─────────────────┐
│        │                     │                 │
│Sidebar │   [Live Preview]    │ [Input Panel]   │
│(hidden │                     │ Prompt input    │
│ for    │                     │ Generate btn    │
│ guests)│                     │ Refine options  │
│        │                     │                 │
└────────┴─────────────────────┴─────────────────┘
```

---

## 🚦 Transitions & Animations

### SingularityTransition (Homepage → Builder)
- **Trigger:** Signed-in user clicks "Start Building"
- **Location:** `components/singularity/SingularityTransition.tsx`
- **Effect:** Expanding circle with logo and particles
- **Duration:** ~2.5 seconds
- **Destination:** `/builder`

### VoidTransition (Demo → Builder)
- **Trigger:** Guest clicks "Begin" on /demo
- **Location:** `components/singularity/VoidTransition.tsx`
- **Effect:** Simple expanding void with spinner
- **Duration:** ~1.2 seconds (fast)
- **Messages:** "Initializing..." → "Ready."
- **Destination:** `/builder?mode=guest&prompt={prompt}`

---

## 💰 Subscription Tiers

| Tier | Price | Limits |
|------|-------|--------|
| Free | $0 | 3 generations total |
| Architect | $19/mo | Unlimited |
| Visionary | $49/mo | Unlimited + Launch Pack |
| Singularity | $99/mo | Unlimited + Agency features |

### Limit Enforcement (SectionBuilder.tsx)
```typescript
const FREE_GENERATION_LIMIT = 3

// Check in handleGenerate():
if (!isPaid && generationCount >= FREE_GENERATION_LIMIT) {
  setShowHatchModal(true) // Trigger paywall
  return
}
```

---

## 📍 Route Structure

### Public Routes
- `/` - Homepage with auth-aware CTAs
- `/demo` - Guest onboarding page
- `/features`, `/how-it-works`, `/faq`, `/pricing`
- `/manifesto` - Brand narrative
- `/contact`, `/privacy`, `/terms`

### Protected Routes
- `/builder` - Main builder (guest mode via URL params)
- `/dashboard/*` - User dashboard sections
- `/onboarding` - Post-signup flow
- `/post-payment` - After Stripe checkout

### API Routes
- `/api/build-section` - AI section generation
- `/api/refine-section` - AI refinement
- `/api/checkout` - Stripe checkout
- `/api/webhook` - Stripe webhooks

---

## 🔧 Key URL Parameters

| Param | Values | Purpose |
|-------|--------|---------|
| `mode` | `guest` | Enables guest mode in builder |
| `prompt` | string | Pre-fills the prompt input |
| `id` | uuid | Project ID for existing projects |

---

## 🐛 Known Issues & Solutions

### Issue: Guest sees centered input instead of floating panel
**Cause:** `isInitialState` check returns before `guestMode` check
**Solution:** Move `guestMode` conditional BEFORE `isInitialState` in SectionBuilder render

### Issue: VoidTransition had orphaned code
**Cause:** Partial file edit left old JSX after component closing brace
**Solution:** Rewrote file cleanly, removed old logo/particle code

### Issue: BuilderGuide modal showing for guests
**Solution:** Added `!guestMode` condition to modal trigger

---

## 📁 File Locations Quick Reference

```
/app/
├── page.tsx                    # Homepage - routes to /demo or /builder
├── demo/page.tsx               # Guest onboarding entry
├── builder/page.tsx            # Main builder page
├── sign-in/[[...sign-in]]/     # Clerk sign in
├── sign-up/[[...sign-up]]/     # Clerk sign up

/components/
├── BuildFlowController.tsx     # GOD FILE - orchestrator
├── SectionBuilder.tsx          # GOD FILE - section building
├── SectionPreview.tsx          # Live preview
├── HatchModal.tsx              # Paywall/upgrade modal
├── HomepageWelcome.tsx         # Homepage welcome section
├── Navigation.tsx              # Top nav
├── singularity/
│   ├── SingularityTransition.tsx
│   ├── VoidTransition.tsx
│   ├── SingularitySidebar.tsx
│   ├── ThinkingLog.tsx
│   └── TheWitness.tsx

/contexts/
├── SubscriptionContext.tsx     # Subscription state

/types/
├── builder.ts                  # Builder types
├── subscriptions.ts            # Subscription types
```

---

## ✅ Build Verification

**Last Successful Build:** January 4, 2026
**Pages:** 60 routes (static + dynamic)
**Key Warnings:**
- Middleware deprecation (use proxy instead) - non-blocking
- Edge runtime disables static generation - expected

---

## 🎯 Current State Summary

1. **Guest Flow:** Homepage → /demo → VoidTransition → /builder?mode=guest
2. **Guest UI:** Floating panel, no sidebar, no section progress
3. **Signed-In Flow:** Homepage → SingularityTransition → /builder
4. **Signed-In UI:** Full sidebar, section progress, centered initial state
5. **Free Limits:** 3 generations, then HatchModal paywall
6. **Transitions:** VoidTransition (fast, simple) vs SingularityTransition (dramatic)

---

## 🔮 Next Steps (Pending)

- [ ] Test full guest-to-signup conversion flow
- [ ] Verify HatchModal triggers correctly after 1 guest generation
- [ ] Consider analytics events for /demo page visits
- [ ] Mobile testing for guest floating panel

---

## 🤖 GEMINI HANDOFF: Guest Builder Redesign

### YOUR MISSION
Redesign the guest builder UI in `/components/SectionBuilder.tsx`

### BRAND CONTEXT
**HatchIt** - "Text to React in seconds"
- **Positioning:** Tech company evolving into professional creative studio
- **Vibe:** Clean, minimal, confident - not "AI startup" but "design tool"
- **Colors:** Emerald green (#10b981) on zinc/black backgrounds
- **Typography:** Inter (body), JetBrains Mono (code/technical)

### WHAT WE'RE BUILDING
A demo experience that shows what we're actually capable of:
- User types a prompt → AI generates a real React component → Live preview
- This is the "wow" moment - make it feel premium, not hacky

### EXACT CODE LOCATION
**File:** `/components/SectionBuilder.tsx`
**Start:** Line 1264 - `if (guestMode) {`
**End:** Line ~1400 - closing brace before `if (isInitialState)`

### WHAT YOU CAN EDIT
Everything inside the `if (guestMode) { return (...) }` block:
- The floating input panel at bottom
- The preview area placeholder
- Animations, layout, copy, styling
- Add new elements (progress indicators, examples, etc.)

### WHAT YOU CANNOT TOUCH
- Anything outside the guestMode block
- The function calls (`handleBuildSection`, `setPrompt`, etc.) - keep using these
- The props being passed to `<SectionPreview />`

### AVAILABLE STATE & FUNCTIONS
```typescript
// State you can use:
prompt                 // Current input text
setPrompt(text)        // Update input
stage                  // 'input' | 'generating' | 'complete'
generatedCode          // The generated React code (empty until built)
section.name           // "Hero Section", "Features", etc.
section.id             // "hero", "features", etc.

// Functions you can call:
handleBuildSection()   // Triggers AI generation
getSuggestions(id)     // Returns array of template suggestions

// Components you can use:
<SectionPreview code={generatedCode} ... />  // Live preview iframe
<Terminal /> icon from lucide-react
<motion.div> from framer-motion
```

### CURRENT UI (What exists now)
1. Full-screen dark preview area with placeholder text
2. Floating panel at bottom with:
   - Section name indicator
   - Textarea for prompt
   - Template chip buttons
   - Build button
3. Loading spinner during generation
4. Success state with "Sign up to continue" CTA

### DESIGN GOALS
1. **Premium feel** - This is our first impression, make it count
2. **Clear value prop** - User should instantly understand "I type, it builds"
3. **Low friction** - Don't overwhelm, guide them to type and click Build
4. **Mobile-ready** - The floating panel should work on phones

### INSPIRATION
Think: Vercel's clean aesthetic, Linear's polish, Raycast's dark mode elegance

### WHEN YOU'RE DONE
Test at: `http://localhost:3000/builder?mode=guest`
The signed-in flow is completely separate - you won't break it.

---

## 🔄 Session Continuity

**Last working state:** Build passing, guest flow functional
**Git status:** Uncommitted changes (memory file + VoidTransition cleanup)
**Next steps after Gemini:** Return to Claude for integration testing and sign-up flow verification

---

## 🚀 LAUNCH CHECKLIST (Jan 4, 2026)

### Pre-Launch Verification

| Item | Status | Notes |
|------|--------|-------|
| **Stripe: STRIPE_ARCHITECT_PRICE_ID** | ⬜ | Must point to $19/mo product in production |
| **Stripe: STRIPE_VISIONARY_PRICE_ID** | ⬜ | Must point to $49/mo product |
| **Stripe: STRIPE_SINGULARITY_PRICE_ID** | ⬜ | Must point to $199/mo product |
| **Deploy subdomain** | ⬜ | Test *.hatchit.app or *.hatchitsites.dev works |
| **Mobile guest builder** | ⬜ | Test /builder?mode=guest on phone |
| **Webhook endpoint** | ⬜ | Verify Stripe webhook URL is configured |

### Flows Verified Working

| Flow | Status |
|------|--------|
| Guest demo (3 free builds) | ✅ |
| Build → Live preview | ✅ |
| Deploy for paid users | ✅ |
| Share link copy (projects + deploy modal) | ✅ |
| Pricing display ($19/$49/$199) | ✅ |
| Subscription gates | ✅ |

### Campaign Ready

- **$19 Architect tier** = entry point for Reddit/Google campaigns
- **Value prop**: Describe it. Watch it build. Ship it. Share it.
- **Guest hook**: 3 free builds, no signup required
- **Viral loop**: Every shared link = HatchIt branding

---

*This document is the source of truth for HatchIt builder UX and logic as of January 4, 2026.*
