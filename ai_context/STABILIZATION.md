# HatchIt Stabilization Tracker

**Created:** 10 January 2026  
**Goal:** Make core mobile flow rock-solid before scaling ads

---

## Critical Path (Must Work Perfectly)

```
User lands → Signs up → Enters builder → Builds sections → Previews → Ships
```

---

## Session 1: Mobile UX Polish (10 Jan 2026 - NOW)

### ✅ Completed This Session
- [x] Section type constraints (headers don't become heroes)
- [x] Dashboard mobile layout redesign
- [x] Post-payment page simplified
- [x] "Try" suggestions hidden on mobile (too cramped)
- [x] Ship button loading states
- [x] Deploy stays in builder, shows URL
- [x] **Tab switching instant** - removed transition delays
- [x] **Backdrop blur removed on mobile** - major iOS Safari perf fix
- [x] **Section click feedback** - larger touch targets, instant active state
- [x] **iOS input zoom fixed** - all inputs now 16px min font
- [x] **Preview iframe always mounted** - tab switch no longer re-mounts iframe

### 🔧 In Progress
_None - Session 1 complete_

---

## Session 2: Data Architecture

### Issues
- [ ] **Deploy saves to Clerk, Dashboard reads Supabase** - Deployments tab broken
- [ ] **builds table not populated on deploy** - Need to save there too
- [ ] **Project state fragmentation** - Clerk metadata vs Supabase projects vs local state

### Fix
- Save deployment to BOTH Clerk metadata AND Supabase builds table
- Dashboard reads from builds table (already does)
- Everything syncs

---

## Session 3: BuildFlowController Refactor

### Current State
- 2,690 lines, single file
- Manages: build state, preview, sidebar, deploy, settings, modals
- Any change risks breaking something else

### Extraction Plan
1. Extract `useBuilderState` hook - all build/section state
2. Extract `PreviewPanel` component - iframe + device switcher
3. Extract `DeployFlow` component - ship button + deploy modal
4. Keep BuildFlowController as orchestrator only

---

## Session 4: Design System Consistency

### Issues
- Homepage: Beautiful gradients, animated elements
- Dashboard: Flat, utilitarian
- Builder: Glass morphism
- No shared component library

### Fix
- Create `/components/ui/` with shared primitives
- Button, Card, Badge, Input with consistent styling
- Apply across all pages

---

## Session 5: Testing & Edge Cases

### Mobile Safari Specific
- [ ] Test on actual iPhone (not just DevTools)
- [ ] Input focus zoom issues
- [ ] Safe area insets (notch/home indicator)
- [ ] Keyboard handling in builder input

### Error States
- [ ] Network failure during build
- [ ] Claude API timeout
- [ ] Deploy failure
- [ ] Auth session expiry mid-build

---

## Priority Order

1. **NOW:** Mobile UX polish (clunky feel)
2. **Next:** Data architecture (broken deployments)
3. **Then:** Component extraction (maintainability)
4. **Later:** Design system (polish)
5. **Ongoing:** Testing

---

## Metrics to Track

- Mobile bounce rate (target: <50%)
- Builder completion rate (target: >30%)
- Deploy success rate (target: >95%)
- Time to first section built (target: <60s)

---

## Notes

_Add session notes here as work progresses_

### 10 Jan 2026 Evening
- Multiple hotfixes deployed
- Core flow works but feels clunky
- Starting Session 1 polish work now
