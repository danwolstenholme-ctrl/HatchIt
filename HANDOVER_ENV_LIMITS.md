# Handover: Environment, Webhooks, and Limits

**Date:** January 1, 2026
**Status:** Critical Infrastructure Audit

## 1. Critical Environment Variables
These variables are required for the application to function. Missing any of these will cause crashes or feature failures.

### AI Generation (The Core)
- `ANTHROPIC_API_KEY`: **REQUIRED.** Used by `app/api/build-section/route.ts` to generate code.
  - *Status:* Must be added to Vercel and `.env.local`.

### Authentication (Clerk)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Required for frontend auth.
- `CLERK_SECRET_KEY`: Required for backend auth verification.
- `CLERK_WEBHOOK_SECRET`: **REQUIRED.** Used in `app/api/webhook/clerk/route.ts` to sync users to Supabase.

### Database (Supabase)
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public key for client-side operations.
- `SUPABASE_SERVICE_ROLE_KEY`: **REQUIRED.** Admin key for server-side operations (bypassing RLS).

### Payments (Stripe)
- `STRIPE_SECRET_KEY`: Required for processing checkout sessions.
- `STRIPE_WEBHOOK_SECRET`: **REQUIRED.** Used in `app/api/webhook/route.ts` to handle subscription updates.
- `STRIPE_LITE_PRICE_ID`: Price ID for the "Lite" tier.
- `STRIPE_PRO_PRICE_ID`: Price ID for the "Pro" tier.
- `STRIPE_AGENCY_PRICE_ID`: Price ID for the "Agency" tier.

---

## 2. Webhooks
The application exposes two critical webhook endpoints that must be configured in their respective provider dashboards.

### Stripe Webhook
- **Endpoint:** `https://your-domain.com/api/webhook`
- **Events to Listen For:**
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- **Secret:** `STRIPE_WEBHOOK_SECRET`

### Clerk Webhook
- **Endpoint:** `https://your-domain.com/api/webhook/clerk`
- **Events to Listen For:**
  - `user.created`
  - `user.updated`
  - `user.deleted`
- **Secret:** `CLERK_WEBHOOK_SECRET` (Get this from the Clerk Dashboard > Webhooks > Signing Secret).

---

## 3. Rate Limits (CRITICAL NOTICE)
**Current Status:** The application currently uses **HARDCODED** limits in the code. The environment variables for limits are **IGNORED**.

### The Reality (Code vs. Env)
| Tier | Actual Limit (Hardcoded) | Env Variable (Currently Ignored) | Location |
|------|--------------------------|----------------------------------|----------|
| **Free** | **3 Total Generations** | `FREE_DAILY_LIMIT` | `components/SectionBuilder.tsx` |
| **Pro** | **30 Generations** | `PRO_ARCHITECT_MONTHLY_LIMIT` | `components/SectionBuilder.tsx` |
| **Agency** | **Infinite** | N/A | `components/SectionBuilder.tsx` |

### The "Gotcha"
- The Free limit is currently a "Total Lifetime Limit" stored in `localStorage` (`hatch_free_generations`), NOT a daily limit.
- Changing `PRO_ARCHITECT_MONTHLY_LIMIT` in Vercel will have **NO EFFECT** until the code is updated.

---

## 4. Next Steps for Junior Model
1.  **Verify Keys:** Ensure `ANTHROPIC_API_KEY` is live in Vercel.
2.  **Wire Up Limits:** The immediate technical debt is to replace the hardcoded values in `components/SectionBuilder.tsx` with:
    - `process.env.NEXT_PUBLIC_FREE_DAILY_LIMIT`
    - `process.env.NEXT_PUBLIC_PRO_ARCHITECT_MONTHLY_LIMIT`
3.  **Fix Free Tier Logic:** Decide if "Free" should be "Daily" (requires DB tracking) or "Total" (localStorage is fine for MVP). Currently, it is "Total".
