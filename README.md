# DAN.DEV — "Obsidian Editorial" Dark Brutalist Portfolio

A real, animated, full-stack developer portfolio. Rebuilt from the static visual reference using Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, R3F/Rapier physics, Lenis smooth scrolling, and Supabase.

---

## 🛠️ TECH STACK

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- **Animations**: Framer Motion (GSAP parity) + Lenis Smooth Scroll
- **3D / Physics**: React Three Fiber + @react-three/rapier (Rapier physics) + Drei
- **Database & Backend**: Supabase (PostgreSQL) + Row Level Security (RLS)
- **Forms & Validation**: React Hook Form + Zod schema validation
- **Emails**: Resend API (with local console logging fallback)
- **Deployment**: Vercel Hobby (Free Tier) — ISR `revalidate = 300`, CSP hardened

---

## 📦 SETUP & INSTALLATION

### 1. Clone the project and install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` or `.env.local` and fill in the credentials:
```bash
# Supabase Project Credentials (from Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend API Key for Email Notifications (Optional)
RESEND_API_KEY=re_your_api_key
```

---

## 🗄️ SUPABASE DATABASE SETUP

### 1. Apply Schema Migrations
Go to your **Supabase Dashboard** → **SQL Editor** → click **New Query**, copy the contents of the migration file located at:
`supabase/migrations/20260619000000_initial_schema.sql`
and click **Run**.

This SQL script will:
- Create the tables: `projects`, `stats`, `skill_nodes`, and `contact_messages`.
- Enable **Row Level Security (RLS)**.
- Define security policies allowing **anonymous insertions** for contact messages, **public reads** for project lists, and restricting **admin reads/updates** to authenticated users.
- Load the default seed datasets into the database.

### 2. Programmatic Database Seeding (Alternative)
Once you have entered your credentials in `.env`, you can seed the database directly via JavaScript:
```bash
npm run seed
```

### 3. Create Admin User (for `/admin` Console)
To access the messages dashboard at `/admin`, create a login user in your **Supabase Dashboard** under **Authentication** → **Users** → **Add User** → **Create User** (assign their email and password).

---

## 🚀 RUNNING LOCALLY

To run the development server, execute:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🕸️ DATA FLOW & CODE ARCHITECTURE

### CMS-driven Homepage
- The home page (`src/app/page.tsx`) functions as a Server Component, querying data directly from Supabase.
- If the environment variables are not configured yet, the site automatically falls back to rendering default mock data, preventing crashes and allowing local evaluation.

### Contact API & Spam Protection (`/api/contact`)
- Submits form values to a Next.js serverless route handler.
- Validates data formats (email structure, lengths) using **Zod**.
- Blocks automated spam submissions using a **website honeypot** input (invisible to users).
- Restricts repetitive submissions using a lightweight **in-memory IP rate limiter** (3 messages per 5 minutes).
- Saves messages into the database, then triggers an email copy via **Resend**.

### Framer Motion + Lenis Animations
- **Hero Intro**: Individual letters stagger in with `framer-motion` `staggerChildren`.
- **Cursor Parallax**: `SpotlightCursor` tracks cursor, creates weight-shifting skews via `useMotionValue` + `useSpring`.
- **Smooth Scroll**: Powered by **Lenis** synchronized with Framer Motion `useScroll` / `useSpring` progress indicator.
- **Viewport Entrance**: Sections slide up/fade in with `whileInView` + `staggerChildren`.
- **Node Graph**: SVG paths dynamically trace links between `skill_nodes` coordinates using native `strokeDashoffset` scroll transitions.
- **Count-Up Numbers**: Metric values increment from zero with `useSpring` + `useScroll` when entering viewport.

### 3D Interactive Lanyard (R3F + Rapier Physics)
- **Physics-driven ID Card**: `kartu.glb` (GLTF) hanging from rope joints (`useRopeJoint` + `useSphericalJoint`), draggable with pointer capture.
- **ID Card Texture**: Embedded in GLB (`1024x1024` PNG), updated at build with **DAN.DEV logo** + photo + info (front/back UV split).
- **Lanyard Ribbon**: `meshline` with `bandd.png` (2048x256) texture — "DAN.DEV /// FULL-STACK ///" repeating, anisotropic 16x.
- **Responsive**: Mobile scale `1.7`, anchor `[1.2, 4.2, 0]`; Desktop scale `2.25`, anchor `[3, 4, 0]`.
- **Full-bleed Canvas**: `left: 50%; transform: translateX(-50%)` prevents edge clipping on drag.
- **Suspense Wrapper**: Prevents blank screen during async GLTF/texture load.

### Loading Screen (God Mode)
- **Cinematic boot sequence** (`LoadingScreen.tsx`): 60fps `requestAnimationFrame` counter 0→100% in 1.4s with `easeOutExpo`.
- **Brutalist UI**: Giant monospaced counter (`text-9xl`), hairline progress bar, corner-bracket logo frame, tech-grid noise background.
- **Clip-path wipe exit** (`polygon` top→bottom) + fade-in content transition via `AnimatePresence`.
- **Zero stuck risk**: Self-timed, no callback dependency; hard fallback `setTimeout(2500ms)` guarantees exit.

---

## ⚡ DEPLOYMENT TO VERCEL (OPTIMIZED FOR HOBBY TIER)

1. Push the code repository to **GitHub**.
2. Connect the repository to **Vercel** and initiate a new deployment.
3. In Vercel's **Environment Variables** configuration, copy and paste the values from your local `.env`.
4. Trigger a production build.

### Vercel Hobby Limits & Mitigations
| Resource | Limit | Mitigation |
|----------|-------|------------|
| Bandwidth | 100 GB/mo (shared) | ISR `revalidate = 300` (5 min), `Cache-Control: immutable, max-age=31536000` on `/assets/*`, `/_next/static/*` |
| Serverless Function Execution | 100 GB-hours/mo | Static generation where possible; API routes lightweight |
| Build Time | 300s | Turbopack, minimal deps |
| Edge Functions | Unlimited | Middleware (CSP, cache headers) on Edge |

### Performance Checklist
- `next.config.ts`: `output: 'standalone'`, `images.remotePatterns` for Supabase/CDN, `poweredByHeader: false`
- `middleware.ts`: CSP headers, immutable cache for assets, security headers
- `public/robots.txt` + `src/app/sitemap.ts`: SEO ready
- `src/app/error.tsx` + `global-error.tsx`: Branded error boundaries

---

## 🎨 BRAND ASSETS

| Asset | Path | Purpose |
|-------|------|---------|
| Logo | `public/Logo.png` | Monogram "DAN" geometric interlocking, white on black |
| Lanyard Ribbon | `public/assets/bandd.png` | 2048x256 repeating texture "DAN.DEV /// FULL-STACK ///" |
| ID Card Texture | Embedded in `public/assets/kartu.glb` | 1024x1024 PNG (front/back UV), updated at build |
| Photo | `public/mrr.jpg` | Portrait for ID card (3:4 ratio) |

---

## 🔧 EFFECTIVE WORKFLOWS (WHEN YOU NEED THEM)

### Update ID Card Texture (Logo/Photo/Info Change)
```bash
# 1. Replace source assets
cp new_logo.png public/Logo.png
cp new_photo.jpg public/mrr.jpg

# 2. Regenerate embedded GLB texture (Python)
python scripts/inject_idcard_texture.py

# 3. Verify
npm run build
```

### Update Lanyard Ribbon Text
```bash
# Edit text in script, regenerates bandd.png
python scripts/gen_bandd.py "NEW TEXT ///"
npm run build
```

### Add New Project (CMS-driven)
```sql
-- In Supabase SQL Editor
INSERT INTO projects (title, description, tech_stack, github_url, live_url, image_url, sort_order)
VALUES ('Project Name', 'Description', '["Next.js", "TS", "Supabase"]', 'https://github.com/...', 'https://...', '/images/project.jpg', 1);
```
No code deploy needed — ISR picks up in ≤5 min.

### Debug 3D Scene Locally
```bash
# Open browser devtools → Console → Three.js inspector
# Or add to LanyardCard temporarily:
# import { Inspector } from '@react-three/drei'; <Inspector />
```

### Force Vercel Re-deploy (Cache Bust)
```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

---

## 📁 KEY FILE MAP

```
src/
├── app/
│   ├── page.tsx              # Server Component (Supabase query + ISR)
│   ├── layout.tsx            # Metadata, fonts, CSP nonce
│   ├── error.tsx             # Route error boundary (brutalist)
│   ├── global-error.tsx      # Root error boundary
│   ├── sitemap.ts            # Dynamic sitemap.xml
│   ├── api/
│   │   ├── contact/route.ts  # Contact form + spam protection
│   │   └── github/route.ts   # GitHub activity feed
│   └── admin/page.tsx        # Admin dashboard (RLS protected)
├── components/
│   ├── PortfolioView.tsx     # Root client shell + LoadingScreen
│   ├── LoadingScreen.tsx     # Cinematic boot (rAF, clip-path exit)
│   ├── Hero.tsx              # Headline + 3D LanyardCard
│   ├── LanyardCard.tsx       # R3F + Rapier physics (ID card + ribbon)
│   ├── Nav.tsx               # Floating nav + brand monogram
│   ├── TechConsoleHub.tsx    # Interactive terminal (no auto-scroll)
│   ├── Contact.tsx           # Contact cards (WhatsApp: +6282148564979)
│   ├── FloatingDock.tsx      # Fixed bottom-right quick actions
│   └── ... (sections: About, Experience, Capabilities, etc.)
├── lib/
│   └── supabase.ts           # Supabase client (server + browser)
└── middleware.ts             # CSP, cache headers, security
public/
├── assets/
│   ├── kartu.glb             # ID card GLTF (embedded texture)
│   └── bandd.png             # Lanyard ribbon texture
├── Logo.png                  # Brand monogram
├── mrr.jpg                   # Portrait photo
└── robots.txt
```

---

## 🏷️ BRAND IDENTITY

- **Name**: DAN.DEV
- **Person**: Muhammad Rizki Ramadhani
- **Role**: Full-Stack Software Engineer
- **Stack**: Next.js 16 • React 19 • TypeScript • PostgreSQL • Supabase • RLS
- **Location**: Banjarmasin, Indonesia (UTC+8 / WITA)
- **Contact**: +62 821-4856-4979 (WhatsApp) · dhanisepeda@gmail.com

---

*Last updated: September 2026 — Commit `3a71d9e`*