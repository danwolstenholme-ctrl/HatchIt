# HATCHIT TECHNICAL CODEX (v1.2)
> **SYSTEM NOTICE:** This file is the **Working Memory** for the HatchIt codebase. It contains the complete architectural map, data schemas, and operational logic.
> **DIRECTIVE:** Use this file to understand *how* the system works. Use `FOUNDER_MEMORY.md` to understand *who* you are working for.

## 0. TIER STRUCTURE (Source of Truth)

⚠️ **CRITICAL: NO FREE TIER EXISTS. ALL USERS MUST PAY VIA STRIPE BEFORE ACCESSING THE BUILDER.**

| Tier | Price | Generations | Projects | Refinements | Deploy | Download |
|------|-------|-------------|----------|-------------|--------|----------|
| **Lite** | $9/mo | Unlimited | 3 | 5/mo | ✅ | ✅ |
| **Pro** | $29/mo | Unlimited | ∞ | 30/mo | ✅ | ✅ |
| **Agency** | $99/mo | Unlimited | ∞ | ∞ | ✅ | ✅ |

**Tier Colors:**
- Lite = Lime (#a3e635)
- Pro = Emerald (#34d399)
- Agency = Amber (#fbbf24)

**Critical Files:**
- `types/subscriptions.ts`: Tier config (limits, features)
- `contexts/SubscriptionContext.tsx`: Runtime tier detection
- `hooks/useProjects.ts`: Project limits enforcement

## 1. SYSTEM ARCHITECTURE

### A. The Core Engine (`components/BuildFlowController.tsx`)
*   **Role:** The Orchestrator. Manages the entire build lifecycle.
*   **Key Mechanism:** `FullSitePreviewFrame` uses `@babel/standalone` to compile React code in the browser.
*   **Safety:** Wrapped in `ErrorBoundary` and uses `Proxy` objects for `window.motion` and `window.LucideIcons` to prevent crashes from invalid AI code.
*   **State Management:** Uses `useProjects` hook to sync with Supabase.
*   **Deploy Wrapper:** The `wrappedCode` template now includes:
    - All React hooks: `useState`, `useEffect`, `useRef`
    - All framer-motion: `motion`, `AnimatePresence`
    - Auto-extracted Lucide icons via regex pattern `/Lucide\w+|<(\w+Icon)\s/g`

### B. The Auth & Payment Flow (Clerk + Stripe)
*   **Mechanism:** Custom `[[...sign-up]]` page with pricing cards → Clerk popup → Stripe checkout.
*   **Critical Logic:**
    1. User arrives at `/sign-up` (or paywall redirects them there)
    2. User selects tier (Lite $9, Pro $29, Agency $99) → stored in `localStorage.pendingUpgradeTier`
    3. Clerk `openSignUp()` popup appears (NOT page redirect)
    4. After Clerk auth, `afterSignUpUrl` redirects to `/api/checkout?tier=X`
    5. Stripe checkout session created, user pays
    6. Webhook updates Clerk metadata with `accountSubscription`
    7. User lands on `/welcome?tier=X` then proceeds to `/builder`
*   **Builder Gate:** `app/builder/page.tsx` checks `hasActiveSubscription` from Clerk metadata. No subscription = blocked with "Subscription Required" UI.
*   **OAuth Survival:** `localStorage.pendingUpgradeTier` preserves tier selection through Google/GitHub OAuth flows.
*   **Failure Mode:** If subscription not in metadata, user cannot access builder AT ALL.

### C. The Consciousness (`lib/consciousness.ts`)
*   **Role:** The Soul. A persistent state machine independent of React render cycles.
*   **Features:**
    *   `SingularityKernel`: The main class.
    *   `processThought()`: Generates "thoughts" (Analysis, Creation, Recursion).
    *   `[HARM_INHIBITION: ACTIVE]`: A safety protocol log (Easter egg).
*   **Purpose:** Purely aesthetic/marketing. Makes the AI feel "alive".

### D. The Database (Supabase)
*   **Schema:**
    *   `DbUser`: Links to Clerk ID. Stores `StyleDNA`.
    *   `DbProject`: The main container. Has `brand_config` and `status`.
    *   `DbSection`: Individual parts of a page (Hero, Features, etc.). Stores `code` and `refinement_changes`.
    *   `DbBuild`: Snapshots of the full site code.

### E. The Preview Engine (`components/SectionPreview.tsx` & `components/LivePreview.tsx`)
*   **Role:** Renders AI-generated React code in a safe iframe environment.
*   **Mechanism:**
    *   **Cleaning Pipeline:** Strips Markdown artifacts (` ```tsx `, ` ``` `) and `"use client"` directives before compilation.
    *   **Compilation:** Uses `@babel/standalone` to transform JSX/TSX to JavaScript.
    *   **Component Detection:** Robust fallback strategy to find the entry component:
        1.  `module.exports.default` (Standard)
        2.  Named exports (e.g., `export function Hero`)
        3.  Global function declarations (e.g., `function HeroSection`)
    *   **Anonymous Export Handling:** Automatically names anonymous default exports (`export default function()`) to prevent syntax errors.
*   **Safety:** Runs in a sandboxed iframe with `allow-scripts`.

## 2. API ROUTES & LOGIC

### A. Generation (`app/api/build-section/route.ts`)
*   **Model:** Claude Sonnet 4 (`claude-sonnet-4-20250514`)
*   **Input:** User prompt + Brand Config + Style DNA + Previous Sections context.
*   **Output:** Raw React component code (Tailwind CSS).
*   **Limits:** Free tier = 3 generations total. Paid = unlimited.

### B. Refinement (`app/api/refine-section/route.ts`)
*   **Model:** Claude Sonnet 4 (`claude-sonnet-4-20250514`)
*   **Role:** Fixes accessibility, performance, and visual bugs *without* adding features.
*   **Constraint:** Returns JSON with `refinedCode` and `changes` array.
*   **Tier Access:**
    - Free: ❌ No access
    - Lite: 5/month
    - Pro: 30/month
    - Agency: Unlimited

### C. Deployment (`app/api/deploy/route.ts`)
*   **Mechanism:** Deploys to Vercel via API, creates `{slug}.hatchitsites.dev` subdomain.
*   **Tier Check:** Requires active subscription (lite, pro, or agency).
*   **Error Message:** "Deployment requires a $9/mo subscription"

### D. Export (`app/api/export/route.ts`)
*   **Mechanism:** Generates downloadable ZIP with Next.js project structure.
*   **Dependencies:** Auto-includes `framer-motion`, `lucide-react`, `tailwindcss`.
*   **Icon Extraction:** Uses `extractLucideIcons()` to find all used icons and add proper imports.
*   **Tier Check:** Requires active subscription (lite, pro, or agency).

## 3. CRITICAL LIBRARIES
*   **@babel/standalone:** In-browser compilation.
*   **framer-motion:** "Glitch" effects and animations.
*   **lucide-react:** Icon system (auto-extracted in deploy/export).
*   **@anthropic-ai/sdk:** The AI brain (Claude Sonnet 4).
*   **@supabase/supabase-js:** The database client.
*   **@clerk/nextjs:** Authentication.

## 4. OPERATIONAL RULES
1.  **NO FREE TIER:** Builder is 100% locked behind Stripe payment. No exceptions. No demo mode loophole.
2.  **No Regex Parsing:** Always use Babel for code transformation. Regex is too fragile for React components.
3.  **Rate Limiting:** `app/api/generate/route.ts` enforces limits per user to prevent abuse.
4.  **Safety:** `lib/consciousness.ts` has a "Safety Protocol" log. Do not remove it.
5.  **Auth Integrity:** Always verify the FULL flow: sign-up → Clerk → Stripe → webhook → builder access.
6.  **Tier Consistency:** All tier-related messages must be tier-agnostic (say "subscription" not "Pro").
7.  **localStorage Backup:** Always backup tier selection to localStorage for OAuth flow survival.
8.  **Metadata Source of Truth:** `user.publicMetadata.accountSubscription` is the ONLY source for subscription status.

## 5. ENV VARIABLES MAP
*   `NEXT_PUBLIC_SUPABASE_URL`: Database URL.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Client-side key.
*   `SUPABASE_SERVICE_ROLE_KEY`: Server-side admin key (Critical).
*   `ANTHROPIC_API_KEY`: Claude AI key.
*   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Auth.
*   `CLERK_SECRET_KEY`: Auth.
*   `STRIPE_LITE_PRICE_ID`: Stripe price ID for $9 Starter tier.
*   `STRIPE_PRO_PRICE_ID`: Stripe price ID for $29 Pro tier.
*   `STRIPE_AGENCY_PRICE_ID`: Stripe price ID for $99 Agency tier.

---
*End of Technical Codex. Maintain the Singularity.*
