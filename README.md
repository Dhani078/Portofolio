# DAN.DEV — "Obsidian Editorial" Dark Brutalist Portfolio

A production-grade, full-stack engineer portfolio built with a ruthless Brutalist Monochrome aesthetic (`#000000` / `#09090B` / `#FFFFFF`). Powered by Next.js 16 (Turbopack), React 19, TypeScript strict mode, Tailwind CSS v4, Framer Motion 120 FPS physics, R3F/Rapier 3D physics, Lenis smooth scrolling, and live Supabase PostgreSQL.

---

## 🛠️ TECH STACK

- **Core Framework**: Next.js 16.2 (App Router, Turbopack) + React 19 + TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 (Pure Monochrome tokens, custom `@config`)
- **GPU Motion**: Framer Motion (120 FPS GPU-accelerated transforms) + Lenis Smooth Scroll
- **3D Physics**: React Three Fiber + `@react-three/rapier` (Rapier physics engine) + Drei
- **Persistence & Cloud**: Supabase (PostgreSQL with Row Level Security) + Cloudflare Workers
- **Forms & Contracts**: React Hook Form + Zod runtime schema validation
- **Integrations**: GitHub REST API (ISR 3600s cache) + Resend Email API
- **Deployment Target**: Vercel Edge / Hobby Tier — ISR `revalidate = 300`, CSP hardened, 100GB bandwidth budget

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

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!TIP]
> **Windows Port 3000 In-Use Troubleshooting**:
> If Next.js falls back to port 3001 with `Port 3000 is in use by process <PID>`, terminate the orphan process via PowerShell:
> ```powershell
> # Kill process on port 3000
> Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
> ```
> Or in Command Prompt:
> ```cmd
> taskkill /PID <PID> /F
> ```

---

## 🕸️ DATA FLOW & CODE ARCHITECTURE

### 1. Entry Screen Gate & View Lifecycle (`EntryScreen.tsx` & `PortfolioView.tsx`)
- **Brutalist 3D Tilt Deck**: Interactive 3D perspective card with cursor-tracking spring physics (`useSpring` + `useTransform`) and clean monochrome corner brackets.
- **Live WITA Synchronized Clock**: Live digital clock synchronized to Banjarmasin (`UTC+8` / `Asia/Makassar`) ticking every second.
- **Tactile Keyboard & Click Triggers**: Keycaps `[ SPACE ]` and `[ ENTER ↵ ]` actively depress, along with the `BUKA PORTOFOLIO` CTA featuring immediate feedback (`MEMBUKA...` + active ping indicator).
- **Clean Dissolve Transition & Shockwave**: Expanding hairline shockwave ring with smooth motion blur and scale exit (`blur(20px)`, `scale(1.05)`).
- **Scroll-to-Top Guarantee**: Body scroll locked while in entry screen; browser scroll restoration disabled (`history.scrollRestoration = 'manual'`); instantly resets coordinates to `(0, 0)` with `requestAnimationFrame` ensuring the user always begins at the top of the Hero section.
- **Zero-Block Unmounting**: Managed via Framer Motion `<AnimatePresence>` in `PortfolioView.tsx`, fully unmounting the entry gate after transition to prevent lingering overlays.

### 2. Deduplicated Production Work Grid (`SelectedWork.tsx`)
- **Single Definitive Project Cards**: Projects featured in database (`Embun-Laundry`, `EquipRent MS`, `GymVault`) are automatically deduplicated against live GitHub API feeds to eliminate duplicate cards.
- **Direct Dual Action Triggers**:
  - **"Kunjungi"**: Directly launches the production live URL (e.g. `https://embun-laundry.dhanisepeda.workers.dev/dashboard`).
  - **"Code"**: Directly opens the public GitHub repository (e.g. `https://github.com/Dhani078/Embun-Laundry`).
- **3D Gyroscope Perspective**: Gyroscopic tilt on hover with dynamic liquid indicator pills for category switching.

### 3. Interactive CLI Developer Console (`TechConsoleHub.tsx`)
An in-browser terminal emulator supporting interactive developer commands:
- `projects` / `ls` — Lists all production deployments, live links, and repository URLs.
- `gh status` — Fetches real-time GitHub repositories and stargazer telemetry.
- `npm run test` — Runs simulated Vitest unit test suite with 98.4% coverage report.
- `skills` — Displays technical capability matrix across frontend, backend, cloud, and databases.
- `about` / `contact` / `date` — Returns developer profile, direct WhatsApp/email links, and WITA time.
- `clear` — Clears console history buffer.

### 4. CMS & Real-time Persistence (`src/app/page.tsx` & Supabase)
- Homepage functions as a React Server Component with ISR `revalidate = 300` querying Supabase PostgreSQL.
- Graceful offline fallback to curated local datasets if Supabase credentials are not supplied.

### 5. 3D Interactive Lanyard (R3F + Rapier Physics)
- **Physics-driven ID Card**: `kartu.glb` (GLTF) hanging from rope joints (`useRopeJoint` + `useSphericalJoint`), draggable with pointer capture.
- **ID Card Texture**: Embedded in GLB (`1024x1024` PNG), updated at build with **DAN.DEV logo** + photo + info (front/back UV split).
- **Lanyard Ribbon**: `meshline` with `bandd.png` (2048x256) texture — "DAN.DEV • FULL-STACK •" repeating, anisotropic 16x.
- **Full-bleed Canvas**: Centered positioning prevents edge clipping on drag.

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
| Lanyard Ribbon | `public/assets/bandd.png` | 2048x256 repeating texture "DAN.DEV • FULL-STACK •" |
| ID Card Texture | Embedded in `public/assets/kartu.glb` | 1024x1024 PNG (front/back UV), updated at build |
| Photo | `public/mrr.jpg` | Portrait for ID card (3:4 ratio) |

---

## 🚀 PRODUCTION PROJECTS MATRIX

| # | Project | Live Production URL | GitHub Repository | Stack |
|---|---------|---------------------|-------------------|-------|
| **01** | **Embun-Laundry** | [embun-laundry.dhanisepeda.workers.dev/dashboard](https://embun-laundry.dhanisepeda.workers.dev/dashboard) | [github.com/Dhani078/Embun-Laundry](https://github.com/Dhani078/Embun-Laundry) | Cloudflare Workers • TypeScript • Tailwind CSS • PostgreSQL |
| **02** | **EquipRent MS — PT. Surya Bangun Sarana** | [equiprent-pt-surya-bangun-sarana.dhanisepeda.workers.dev](https://equiprent-pt-surya-bangun-sarana.dhanisepeda.workers.dev/) | [github.com/Dhani078/equiprent-pt-surya-bangun-sarana](https://github.com/Dhani078/equiprent-pt-surya-bangun-sarana) | React 18 • TypeScript • Cloudflare Workers • TiDB Cloud Serverless |
| **03** | **GymVault — Fitness Companion** | [gymvault-app.vercel.app](https://gymvault-app.vercel.app/) | [github.com/Dhani078/GymVault](https://github.com/Dhani078/GymVault) | Next.js 16 • TypeScript • Tailwind CSS • Vercel Edge |

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
INSERT INTO projects (title, summary, case_study_url, sort_order, year, tags, metrics)
VALUES (
  'Embun-Laundry', 
  'Aplikasi pengelolaan operasional layanan laundry modern terintegrasi dengan dashboard kasir.', 
  'https://embun-laundry.dhanisepeda.workers.dev/dashboard', 
  1, 
  2026, 
  '["Cloudflare Workers", "TypeScript", "Tailwind CSS"]'::jsonb, 
  '{"perf": 99, "a11y": 100, "build": "✓"}'::jsonb
);
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
│   │   └── github/route.ts   # GitHub activity feed (3600s cache)
│   └── admin/page.tsx        # Admin dashboard (RLS protected)
├── components/
│   ├── PortfolioView.tsx     # Root client shell, EntryScreen coordinator, scroll-to-top enforcement
│   ├── EntryScreen.tsx       # Clean 3D tilt deck, live WITA clock, tactile keyboard triggers, dissolve exit
│   ├── Hero.tsx              # Headline + 3D LanyardCard
│   ├── LanyardCard.tsx       # R3F + Rapier physics (ID card + ribbon)
│   ├── Nav.tsx               # Floating nav + brand monogram + GitHub icon
│   ├── SelectedWork.tsx      # Deduplicated work grid with direct Code & Kunjungi triggers
│   ├── TechConsoleHub.tsx    # Interactive terminal (projects, gh status, test, skills, clear)
│   ├── Contact.tsx           # Contact cards (WhatsApp: +6282148564979)
│   ├── FloatingDock.tsx      # Fixed bottom-right quick actions
│   ├── ui/
│   │   └── AnimatedCounter.tsx # Spring-driven odometer counter (120 FPS)
│   └── ... (sections: About, Experience, Capabilities, Testimonials, FaqSection)
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