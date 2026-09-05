# AGENTS.md — DAN.DEV Portfolio Development Rules

## Project Overview
**DAN.DEV** — Dark Brutalist Monochrome Full-Stack Developer Portfolio
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- Framer Motion + Lenis + R3F/Rapier Physics
- Supabase (PostgreSQL + RLS) + Resend
- Deployment: Vercel Hobby (Free Tier)

## Core Principles (Non-Negotiable)
1. **Brutalist Minimalist Monochrome** — `#000000`, `#FFFFFF`, `#09090B` only. No gradients on text, no emoji, no "AI slop" copy.
2. **Real Integrations Over Mocks** — Live GitHub API, Supabase queries, actual 3D physics. No fake data.
3. **Technical Depth Over Features** — Skills matrix = architecture specs, not feature lists.
4. **Performance First** — ISR `revalidate = 300`, immutable asset caching, 100GB bandwidth budget.
5. **Zero Hydration Mismatches** — SSR-safe, no `typeof window` in render, no `Date.now()`/`Math.random()` in components.

## Development Workflow
```bash
# Local dev
npm run dev          # http://localhost:3000

# Type-check + build
npm run build        # Must pass TypeScript + Next.js build

# Deploy
git push origin main # Vercel auto-deploys
```

## Key Files to Know
| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Server Component, Supabase query, ISR 300s |
| `src/components/PortfolioView.tsx` | Client shell, LoadingScreen, all sections |
| `src/components/LoadingScreen.tsx` | Cinematic boot (rAF, clip-path exit, 1.4s) |
| `src/components/LanyardCard.tsx` | R3F + Rapier physics (ID card + ribbon) |
| `src/components/TechConsoleHub.tsx` | Interactive terminal (no auto-scroll on mount) |
| `src/components/Hero.tsx` | Headline + 3D Lanyard placement |
| `src/middleware.ts` | CSP, cache headers, security |
| `next.config.ts` | Standalone output, image domains, CSP nonce |
| `public/assets/kartu.glb` | ID card GLTF (embedded texture, updated at build) |
| `public/assets/bandd.png` | Lanyard ribbon texture (2048x256) |

## Brand Constants
- **Name**: DAN.DEV
- **Person**: Muhammad Rizki Ramadhani
- **Role**: Full-Stack Software Engineer
- **Stack**: Next.js 16 • React 19 • TS • PostgreSQL • Supabase • RLS
- **Location**: Banjarmasin, ID (WITA/UTC+8)
- **WhatsApp**: +62 821-4856-4979 (wa.me/6282148564979)
- **Email**: dhanisepeda@gmail.com

## Common Tasks

### Update ID Card (Logo/Photo/Info)
1. Replace `public/Logo.png` and/or `public/mrr.jpg`
2. Run texture injection script (updates embedded PNG in `kartu.glb`)
3. `npm run build` → verify

### Update Lanyard Ribbon Text
1. Edit text in generation script
2. Regenerates `public/assets/bandd.png`
3. `npm run build`

### Add Project (No Code Deploy)
```sql
INSERT INTO projects (title, description, tech_stack, github_url, live_url, image_url, sort_order)
VALUES ('Name', 'Desc', '["Next.js","TS"]', 'https://github.com/...', 'https://...', '/img.jpg', 1);
```

### Debug 3D Scene
- Browser DevTools → Console → `@react-three/drei` Inspector
- Or temporarily add `<Inspector />` in `LanyardCard.tsx`

### Force Vercel Redeploy
```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

## Quality Gates (Pre-commit Mental Checklist)
- [ ] `npm run build` passes (TypeScript + Next.js)
- [ ] No hydration warnings in console
- [ ] Loading screen exits cleanly (no stuck)
- [ ] 3D lanyard draggable, no edge clipping
- [ ] WhatsApp links use `+6282148564979`
- [ ] Console doesn't auto-scroll on page load
- [ ] CSP headers present (check Network tab)
- [ ] ISR working (check Vercel dashboard → Functions → ISR)

## Vercel Hobby Limits Reference
| Limit | Value | Current Mitigation |
|-------|-------|-------------------|
| Bandwidth | 100 GB/mo | ISR 300s, immutable cache 1yr |
| Function Execution | 100 GB-hrs/mo | Static gen, lightweight APIs |
| Build Time | 300s | Turbopack, minimal deps |

---

*Updated: September 2026 — Commit `3a71d9e`*