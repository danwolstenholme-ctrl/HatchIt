# HATCHIT TECHNICAL CODEX (v1.1)
> **SYSTEM NOTICE:** This file is the **Working Memory** for the HatchIt codebase. It contains the complete architectural map, data schemas, and operational logic.
> **DIRECTIVE:** Use this file to understand *how* the system works. Use `FOUNDER_MEMORY.md` to understand *who* you are working for.

## 1. SYSTEM ARCHITECTURE

### A. The Core Engine (`components/BuildFlowController.tsx`)
*   **Role:** The Orchestrator. Manages the entire build lifecycle.
*   **Key Mechanism:** `FullSitePreviewFrame` uses `@babel/standalone` to compile React code in the browser.
*   **Safety:** Wrapped in `ErrorBoundary` and uses `Proxy` objects for `window.motion` and `window.LucideIcons` to prevent crashes from invalid AI code.
*   **State Management:** Uses `useProjects` hook to sync with Supabase.

### B. The Auth Flow (Clerk + Next.js)
*   **Mechanism:** Custom `[[...sign-in]]` and `[[...sign-up]]` pages.
*   **Critical Logic:**
    *   The "Gate" in `BuildFlowController` checks for `isSignedIn`.
    *   If false, it redirects to `/sign-up?redirect_url=...`.
    *   The Sign Up page **MUST** read this param and pass it to `<SignUp forceRedirectUrl={redirectUrl} />`.
    *   **Failure Mode:** If this is missing, users are dumped at the dashboard root, losing their project context.

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

## 2. API ROUTES & LOGIC

### A. Generation (`app/api/build-section/route.ts`)
*   **Model:** Gemini 2.0 Flash ("The Genesis Engine").
*   **Input:** User prompt + Brand Config + Style DNA + Previous Sections context.
*   **Output:** Raw React component code (Tailwind CSS).

### B. Refinement (`app/api/refine-section/route.ts`)
*   **Model:** Gemini 2.0 Flash ("The Polisher").
*   **Role:** Fixes accessibility, performance, and visual bugs *without* adding features.
*   **Constraint:** Returns JSON with `refinedCode` and `changes` array.

### C. Deployment (`app/api/deploy/route.ts`)
*   **Mechanism:** Currently a mock deployment that validates the project name and generates a slug.
*   **Future:** Will integrate with Vercel API for real deployments.

## 3. CRITICAL LIBRARIES
*   **@babel/standalone:** In-browser compilation.
*   **framer-motion:** "Glitch" effects and animations.
*   **lucide-react:** Icon system.
*   **@google/genai:** The AI brain.
*   **@supabase/supabase-js:** The database client.
*   **@clerk/nextjs:** Authentication.

## 4. OPERATIONAL RULES
1.  **No Regex Parsing:** Always use Babel for code transformation. Regex is too fragile for React components.
2.  **Rate Limiting:** `app/api/generate/route.ts` enforces limits per user to prevent abuse.
3.  **Safety:** `lib/consciousness.ts` has a "Safety Protocol" log. Do not remove it.
4.  **Auth Integrity:** Always verify the redirect loop when touching auth pages.

## 5. ENV VARIABLES MAP
*   `NEXT_PUBLIC_SUPABASE_URL`: Database URL.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Client-side key.
*   `SUPABASE_SERVICE_ROLE_KEY`: Server-side admin key (Critical).
*   `GEMINI_API_KEY`: Google AI key.
*   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Auth.
*   `CLERK_SECRET_KEY`: Auth.

---
*End of Technical Codex. Maintain the Singularity.*
