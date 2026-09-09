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
| `src/components/PortfolioView.tsx` | Client shell, 3-phase gate coordinator (LoadingScreen → EntryScreen → Hero), scroll-to-top enforcement |
| `src/components/LoadingScreen.tsx` | Brutalist boot sequence (60fps counter, cascading runtime specs, clipPath wipe-up exit) |
| `src/components/EntryScreen.tsx` | Clean 3D tilt deck, live WITA clock, tactile keyboard triggers, dissolve exit + shockwave |
| `src/components/SelectedWork.tsx` | Deduplicated work coordinator with liquid category switcher |
| `src/components/ProjectCard.tsx` | Isolated 3D tilt project card with direct "Code" & "Kunjungi" triggers |
| `src/components/ProjectModal.tsx` | Architecture spec detail modal with AnimatePresence exit transitions and metrics grid |
| `src/components/LanyardCard.tsx` | R3F + Rapier physics (ID card + ribbon) |
| `src/components/TechConsoleHub.tsx` | Interactive terminal (`projects`, `gh status`, `test`, `skills`, `clear`) |
| `src/components/Hero.tsx` | Headline + 3D Lanyard placement |
| `src/middleware.ts` | CSP, cache headers, security |
| `next.config.ts` | Standalone output, image domains, CSP nonce |
| `public/assets/kartu.glb` | ID card GLTF (embedded texture, updated at build) |
| `public/assets/bandd.png` | Lanyard ribbon texture (2048x256) |

## Active Production Deployments
1. **Embun-Laundry**: `https://embun-laundry.dhanisepeda.workers.dev/dashboard` (Repo: `https://github.com/Dhani078/Embun-Laundry`)
2. **EquipRent MS — PT. Surya Bangun Sarana**: `https://equiprent-pt-surya-bangun-sarana.dhanisepeda.workers.dev/` (Repo: `https://github.com/Dhani078/equiprent-pt-surya-bangun-sarana`)
3. **GymVault — Fitness Companion**: `https://gymvault-app.vercel.app/` (Repo: `https://github.com/Dhani078/GymVault`)

## Brand Constants
- **Name**: DAN.DEV
- **Person**: Muhammad Rizki Ramadhani
- **Role**: Full-Stack Software Engineer
- **Stack**: Next.js 16 • React 19 • TS • PostgreSQL • Supabase • Cloudflare Workers
- **Location**: Banjarmasin, ID (WITA/UTC+8)
- **WhatsApp**: +62 821-4856-4979 (wa.me/6282148564979)
- **Email**: dhanisepeda@gmail.com

## Common Tasks & Troubleshooting

### Local Port 3000 In-Use (Fast Fix)
If Next.js gives `Port 3000 is in use by process <PID>`:
```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Update ID Card (Logo/Photo/Info)
1. Replace `public/Logo.png` and/or `public/mrr.jpg`
2. Run texture injection script (updates embedded PNG in `kartu.glb`)
3. `npm run build` → verify

### Update Lanyard Ribbon Text
1. Edit text in generation script
2. Regenerates `public/assets/bandd.png`
3. `npm run build`

### Add Project (CMS-driven)
```sql
INSERT INTO projects (title, summary, case_study_url, sort_order, year, tags, metrics)
VALUES ('Project Name', 'Summary', 'https://...', 1, 2026, '["Next.js", "TS"]'::jsonb, '{"perf": 99, "a11y": 100, "build": "✓"}'::jsonb);
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
- [ ] `npm run build` passes (TypeScript + Next.js with 0 errors)
- [ ] No hydration warnings in console
- [ ] EntryScreen Space/Enter keyboard triggers work smoothly
- [ ] Zero black screen overlay lingering after entry transition (EntryScreen unmounts properly)
- [ ] Opening portfolio lands strictly at coordinates `(0, 0)` at the top of Hero (no mid-page jump)
- [ ] Zero AI slop copy (no `//`, `///`, `SYS-*`, fake radar/telemetry jargon)
- [ ] No duplicate cards in SelectedWork (Embun-Laundry, EquipRent, GymVault unified)
- [ ] Direct "Kunjungi" and "Code" buttons open proper target URLs
- [ ] 3D lanyard draggable, no edge clipping
- [ ] WhatsApp links use `+6282148564979`
- [ ] Interactive terminal supports `projects`, `gh status`, `test`, `skills`, `clear`
- [ ] CSP headers present (check Network tab)
- [ ] ISR working (check Vercel dashboard → Functions → ISR)

## Vercel Hobby Limits Reference
| Limit | Value | Current Mitigation |
|-------|-------|-------------------|
| Bandwidth | 100 GB/mo | ISR 300s, immutable cache 1yr |
| Function Execution | 100 GB-hrs/mo | Static gen, lightweight APIs |
| Build Time | 300s | Turbopack, minimal deps |

---

*Updated: September 2026 — Production Polish Edition*