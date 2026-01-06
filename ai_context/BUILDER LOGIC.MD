# Hatch Builder Logic Dump

## 0. Mental Model
- The **builder** is a single-page experience orchestrated by [components/BuildFlowController.tsx](components/BuildFlowController.tsx) (loads/creates projects, tracks subscription context, feeds sections into `SectionBuilder`).
- Each **section slot** (hero, features, etc.) renders through [components/SectionBuilder.tsx](components/SectionBuilder.tsx), which owns the state machine (`input → generating → refining → complete`) plus UX chrome, prompts, and API orchestration.
- The **preview surface** is [components/SectionPreview.tsx](components/SectionPreview.tsx): an iframe runtime that Babel-compiles arbitrary React+Tailwind, hydrates, and reports readiness/errors back up. Everything visual hinges on `generatedCode` + `isPreviewReady`.
- Immersive **wait-state** UX lives in [components/builder/GeneratingModal.tsx](components/builder/GeneratingModal.tsx); it stays open while either `stage === 'generating'` or the iframe reports `!isPreviewReady` so users never see an empty canvas.

## 1. Project + Session Boot
### Signed-in flow
1. `BuildFlowController` waits for Clerk to load, then:
	- Resumes `existingProjectId` from URL or `localStorage.hatch_current_project`.
	- Otherwise POSTs `/api/project` to create a project seeded from the current template (default `SINGULARITY_TEMPLATE`).
2. After creation we hydrate: `project`, `dbSections`, `brandConfig`, and `buildState` via `createInitialBuildState`. Guest handoff data (if present) is imported and then purged from localStorage.

### Demo/guest flow
1. If `isDemo` is true (or user not signed in), we run `setupDemoMode()`:
	- Generates a mock project id, clones template sections, and seeds `dbSections` with either stored guest data (`hatch_guest_handoff`) or blank pending sections.
	- All persistence is localStorage-only; API calls are skipped but UI remains identical.
2. Demo prompt entry surfaces `InlinePromptInput` unless an `initialPrompt` existed (e.g. `/demo?prompt=...`).

### Shared LocalStorage Keys
- `hatch_guest_handoff`: serialized project snapshot for guest→signup migration.
- `hatch_last_prompt`: most recent text prompt so demo landing can pre-populate.
- `hatch_guest_builds` / `hatch_guest_refinements` / `hatch_guest_generations`: historical counters (limits currently set to ∞ but still tracked for telemetry).
- Section-level cache: `hatch_preview_${projectId}_${sectionId}_${hash(prompt)}` stores `{ code, reasoning, prompt, timestamp }` for 1 hour so guests can refresh without losing work.

## 2. SectionBuilder State Machine
```text
input ── buildSection() ──▶ generating ── API + stream ──▶ complete
	▲             │                                   │
	│             └── error/reset ────────────────────┘
complete ── refineSection()/architectPolish() ──▶ refining ──▶ complete
```

- **`stage` init**: derives from `dbSection.status`, saved preview presence, and `initialPrompt` injection (auto-starts in `generating`).
- **`generatedCode`**: canonical source for SectionPreview. Any change triggers `setIsPreviewReady(false)` until iframe reports `onReady`.
- **`isPreviewReady`**: flips true only after iframe load; used for loading indicators but no longer blocks UI.
- **`showGenerating`** (line ~1901): simplified to `stage === 'generating' && !generatedCode` - only shows studio interface during active build with no code yet. Once code exists, preview renders immediately.
- **`showInlinePromptInput`** chooses between demo guest modal vs signed-in zero-state. Signed-in users with prefill skip this entirely.

## 3. Build Pipeline (handleBuildSection)
1. Validate prompt → set `stage = 'generating'`, clear errors, reset streaming buffers.
2. Log via `chronosphere.log('generation', …)`.
3. Call `/api/build-section` with full section + brand context and `previousSections` map for continuity.
4. Animate streaming code chunk-by-chunk (purely UX) while `buildProgress` drives the bottom timeline.
5. On success:
	- `generatedCode = normalizedCode` (payload sanitized via `unwrapCodePayload`).
	- `setStage('complete')`, `setReasoning(aiReasoning)`.
	- Persist guest preview cache + prompt if not signed in.
	- Invoke `onComplete` so parent (BuildFlowController) updates Supabase/local state.
	- Kick off `evolveUserStyle` async fire-and-forget.
6. On failure: reset to `input`, surface server message, keep inline error pill visible.

### Auto-start Behavior
- When the builder receives `initialPrompt`, component mounts with `hasInitialPrompt=true`, sets stage to `generating`, and immediately calls `handleBuildSection({ skipGuestCredit: true })`. This ensures `/demo?prompt=…` feels instant.

## 4. Refinement + Tools
### Manual refine (`handleUserRefine`)
- Requires existing `generatedCode`.
- Optionally scopes to a selected element (inspector writes pseudo-selector into request).
- Captures screenshot from iframe via `captureTrigger` → `SectionPreview` posts `screenshot-captured` using `html2canvas`.
- Sends `/api/refine-section` with screenshot + refine prompt.
- Streams updated code, appends `changes` to `refinementChanges`, logs via Chronosphere, updates guest counters.

### Architect polish (`handleArchitectPolish`)
- Same endpoint as refine but without user prompt; used for automated cleanups. Currently unlimited; paywall occurs only on deploy/export actions.

### Singularity evolve (`evolve`)
- Background R&D mode: triggers `/api/singularity/dream` with screenshot context, stores suggestion without auto-applying. Accepting suggestion mutates `generatedCode` and writes an audit line into `refinementChanges` prefixed with `Singularity:`.

### Inline edit mode
- `SectionPreview` listens for `set-edit-mode` messages. Double-click text -> contentEditable, on blur sends `text-edited` message. `SectionBuilder.handleTextEdit` regex-replaces inline JSX text and records change summary.

## 5. Preview Runtime (SectionPreview)
1. **Sanitization**: removes markdown fences, `'use client'`, and encodes Tailwind SVG data-URIs.
2. **Babel**: uses `@babel/standalone` with `env`, `react`, `typescript` presets. Errors render in-frame plus `postMessage({ type: 'preview-error', … })` so builder can warn.
3. **Iframe shell**: loads Tailwind CDN, React UMD bundles, Framer Motion, lucide icons. Stubs `next/image`, `next/link`, router hooks, etc.
4. **Messaging Contract**:
	- Parent → child: `capture-screenshot`, `set-edit-mode`.
	- Child → parent: `preview-error`, `element-selected`, `screenshot-captured`, `text-edited`.
5. **Hydration overlay**: `isPreviewHydrating` toggles spinner/backdrop so blank states never flash. `handleIframeLoad` disables overlay + fires `onReady` → bubbles to SectionBuilder to close GeneratingModal.

## 6. Wait-State + Modal Behavior
- `GeneratingModal` props = `{ isOpen, stage, stageIndex }`. SectionBuilder owns the timers (`loadingStages`, `loadingFacts`) irrespective of auth state.
- Modal remains open for three scenarios:
  1. Fresh build request (no code yet).
  2. Auto-build triggered via initial prompt.
  3. Post-build while iframe still hydrating (prevents layout popping).
- If API errors, modal closes because `stage` resets to `input` and `showGenerating` recalculates false.

## 7. Access Control + Gating
- **Generation limits**: intentionally disabled (all limits = `Infinity`). Paywall hits only on deploy/export/advanced actions triggered elsewhere (`HatchModal`, `PaywallTransition`).
- **Guest prompt modal**: `showGuestPromptModal` defaults true when `!isSignedIn && !effectivePrompt && !savedPreview`. Submitting sets prompt, starts build, stores `hatch_last_prompt`.
- **Unlock banner**: `BuildFlowController` uses `showUnlockBanner = !isSignedIn || (!isPaidUser && !demoMode)` to show upsell ribbons in chrome components.
- **Signup redirects**: `goToSignUp()` persists guest handoff before pushing to `/sign-up?upgrade=…&redirect_url=/builder`.

## 8. Error Handling + Self Healing
- Runtime errors inside iframe call `handleRuntimeError` (not shown in snippet) which can trigger `handleSelfHeal` flows (Gemini repair) and toggles `hasSelfHealed` to avoid loops.
- Build/refine API failures surface human-readable strings from server response if provided.
- Screenshot capture has timeout guards (5s for Singularity, 2s for refine) and logs warnings without blocking the rest of the pipeline.

## 9. Supporting Systems
- **chronosphere**: lightweight analytics/logging for interactions (`generation`, `refinement`, `navigation`, etc.).
- **buildProgress**: shared store for progress bar honesty; `startBuild`/`complete` used during handleBuildSection.
- **useSubscription** context: exposes `tier`, `isPaidUser` for gating UI (code view, deploy buttons, etc.).
- **SiteSettingsModal** + other modals (Welcome, Hatch) live in BuildFlowController, but they only affect builder indirectly (brand config, gating).

## 10. Outstanding Nuance / Gotchas
- **State coupling**: `showGenerating` depends on both `stage` and `isPreviewReady`. Any future change to preview lifecycle (e.g., switching to SSR) must keep `onReady` semantics or users will get stuck under the modal.
- **LocalStorage hydration**: multiple keys get cleared/imported. Always guard with `typeof window !== 'undefined'` to prevent SSR crashes.
- **Iframe security**: sandbox allows scripts + same-origin to keep Babel transforms working; be mindful when adding new capabilities.
- **Demo parity**: All heavy logic now runs real APIs even for demo when possible. Comments marked “NO MORE LIMITS” / “DEMO mode simulation removed” show where mock code used to exist—avoid reintroducing divergence.

This document should give future chats everything needed to rehydrate the builder’s control flow without re-reading 2k lines of code.
