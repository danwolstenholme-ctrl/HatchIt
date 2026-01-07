# HatchIt

> **Describe it. Watch it build. Deploy it.**

![HatchIt Banner](https://hatchit.dev/opengraph-image.png)

**HatchIt** turns plain English into production-ready React websites. No templates. No drag-and-drop. Just describe what you want, watch AI generate each section in real-time, and deploy with one click.

🚀 **Live at [hatchit.dev](https://hatchit.dev)**

---

## Why I Built This

I've been building websites for over a decade. WordPress, Webflow, Figma exports, AI tools — I've tried them all. They all had the same problem: they controlled the output.

Templates locked me into someone else's vision. Drag-and-drop builders created bloated code. AI tools wrapped everything in 47 divs and called it "clean."

So I built HatchIt for myself. A tool that:
- Generates **real React + Tailwind code** (not template soup)
- Shows a **live preview** as it builds (not "wait 30 seconds and pray")
- Lets me **iterate section by section** (not start over every time)
- **Deploys instantly** to a real URL (not "export and figure it out")

Then I realized: if I needed this, other people probably do too.

---

## How It Works

1. **Describe your site** — "A landing page for my coffee shop with a hero, menu, and contact form"
2. **Watch it build** — AI generates each section with live preview
3. **Refine** — Edit prompts, regenerate sections, adjust the vibe
4. **Deploy** — One click to a live `.hatchitsites.dev` URL

No coding required. But if you want the code, export it as clean React + Tailwind files.

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 + React 19 |
| Styling | Tailwind CSS 4 + Framer Motion |
| AI | Claude Sonnet 4.5 |
| Database | Supabase |
| Auth | Clerk |
| Payments | Stripe |
| Deploy | Cloudflare Workers |

---

## Local Development

```bash
# Clone
git clone https://github.com/danwolstenholme-ctrl/hatchit.git
cd hatchit

# Install
npm install

# Run
npm run dev
```

**Environment Variables** (`.env.local`):
- `ANTHROPIC_API_KEY` — Claude API
- `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — Database
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` — Auth
- `STRIPE_SECRET_KEY` — Payments

---

## Status

✅ Live and shipping daily at [hatchit.dev](https://hatchit.dev)

Built by [@danwolstenholme-ctrl](https://github.com/danwolstenholme-ctrl) — shipping since Christmas 2025.
