# OVERSEER ARCHITECTURE VISION
> Created: January 11, 2026
> Purpose: Clear direction for the Builder + Overseer refactor

---

## THE PROBLEM

BuildFlowController is ~2800 lines of tangled state:
- Build stages: `input` → `generating` → `complete` → `refining`
- Refinement adds complexity without adding value
- No site-wide intelligence
- User can't have a conversation about the whole site
- Editing is section-by-section with no coherent voice

**Result:** Clunky, disjointed experience. The AI doesn't "understand" the site.

---

## THE VISION

**Two-layer architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                    OPUS OVERSEER                            │
│  • Sees ALL sections simultaneously                         │
│  • Conversational - user talks to it about the whole site   │
│  • Ensures consistency (colors, tone, spacing)              │
│  • Handles site-wide requests: "make it all darker"         │
│  • Deep reasoning, holistic understanding                   │
│  • Can direct the Builder to regenerate specific sections   │
└─────────────────────────────┬───────────────────────────────┘
                              │ directs
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SONNET BUILDER                           │
│  • Fast, focused, single-section generation                 │
│  • Takes a prompt, outputs code                             │
│  • No state machine - just: prompt → code → done            │
│  • The "hands" doing the work                               │
└─────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: STRIP DOWN

**Goal:** Simplify BuildFlowController to a dumb section builder.

**Remove:**
- `refining` stage entirely
- Complex state transitions
- Refinement API calls
- "AI understood" summary after generation (keep it simple)

**Keep:**
- Section list
- Build button → generates code
- Live preview
- Navigation between sections
- Ship dropdown (deploy, GitHub, ZIP)

**New flow:**
```
User selects section
    ↓
User enters prompt → clicks Build
    ↓
Sonnet generates code (streaming)
    ↓
Preview shows result
    ↓
User can:
  - Edit prompt and rebuild (same section)
  - Move to next section
  - Talk to Overseer (Phase 2)
```

**No more:**
- `buildState.currentStage` state machine
- `refining` mode
- Separate refinement API

---

## PHASE 2: ADD OVERSEER

**New component:** `OverseerPanel.tsx` or integrate into existing AI Help

**New API route:** `/api/overseer`

**Overseer capabilities:**
1. **Site-wide context** - receives all section code
2. **Conversational** - chat interface
3. **Action types:**
   - "Make suggestion" → returns text advice
   - "Edit section X" → returns updated code for that section
   - "Edit all sections" → returns updates for multiple sections
   - "Add integration" → updates brand_config.integrations

**Overseer system prompt:**
```
You are the Overseer. You have deep understanding of the entire website.
You see all sections. You ensure consistency.
When the user asks for changes, you can:
1. Give advice
2. Return specific code changes for sections
3. Direct site-wide modifications

Always think about the whole site, not just individual pieces.
```

**UI location:** 
- Could be the existing "AI Help" button in sidebar
- Or a new "Talk to AI" floating button
- Chat-style interface

---

## PHASE 3: INTEGRATIONS

**Expand brand_config.integrations:**
```typescript
integrations: {
  forms: {
    provider: 'formspree' | 'netlify' | 'custom'
    formspreeId?: string
    webhookUrl?: string
  }
  analytics: {
    googleAnalyticsId?: string
    facebookPixelId?: string
    tiktokPixelId?: string
  }
}
```

**Overseer handles:**
- "Add Google Analytics" → updates integrations, tells Builder to regenerate layout
- "Connect forms to Formspree" → updates config, regenerates contact sections

**Scaffold injects:**
- Pixel scripts into layout.tsx
- Form actions into contact components

---

## FILE CHANGES SUMMARY

**Phase 1 - Strip Down:**
- `BuildFlowController.tsx` - Remove refinement logic, simplify state
- `SectionBuilder.tsx` - Remove refinement UI if separate
- `/api/refine-section/route.ts` - Can remove or keep for Overseer use later

**Phase 2 - Add Overseer:**
- `components/builder/OverseerChat.tsx` - New conversational UI
- `/api/overseer/route.ts` - New Opus-powered API
- `BuildFlowController.tsx` - Add Overseer panel/modal

**Phase 3 - Integrations:**
- `lib/supabase.ts` - Expand integrations type
- `lib/scaffold.ts` - Inject pixels/form config
- `components/SiteSettingsModal.tsx` - Add integrations UI

---

## SUCCESS CRITERIA

**After Phase 1:**
- [ ] BuildFlowController under 1500 lines
- [ ] No `refining` stage
- [ ] Simple flow: build → preview → next
- [ ] Everything still works (deploy, GitHub, ZIP)

**After Phase 2:**
- [ ] User can talk to Overseer about whole site
- [ ] Overseer can make site-wide changes
- [ ] Consistency across sections improves
- [ ] More premium feel

**After Phase 3:**
- [ ] Deployed sites have working form integration
- [ ] Pixels fire correctly on deployed sites
- [ ] Settings UI is clean

---

## BACKUP BEFORE STARTING

```bash
git checkout -b backup/pre-overseer-refactor
git add -A && git commit -m "Backup: Pre-overseer refactor state"
git checkout main
```

---

## DO NOT LOSE SIGHT OF:

1. **Don't break deploy** - Ship dropdown must always work
2. **Don't break preview** - Live preview is core UX
3. **Mobile first** - 90% of traffic is mobile
4. **Keep it simple** - Less code is better
5. **Opus is expensive** - Only use for site-wide reasoning, not per-section

---

*This document is the north star. Refer back when lost.*
