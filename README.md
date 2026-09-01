# MRR.DEV — "Obsidian Editorial" Dark Brutalist Portfolio

A real, animated, full-stack developer portfolio. Rebuilt from the static visual reference using Next.js (App Router), TypeScript, Tailwind CSS v4, GSAP, Lenis smooth scrolling, and Supabase.

---

## 🛠️ TECH STACK

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- **Animations**: GSAP (GreenSock) + ScrollTrigger + Lenis Smooth Scroll
- **Database & Backend**: Supabase (PostgreSQL) + Row Level Security (RLS)
- **Forms & Validation**: React forms + Zod schema validation
- **Emails**: Resend API (with local console logging fallback)

---

## 📦 SETUP & INSTALLATION

### 1. Clone the project and install dependencies
Make sure you are in the project folder, then run:
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
Go to your **Supabase Dashboard** -> **SQL Editor** -> click **New Query**, copy the contents of the migration file located at:
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
To access the messages dashboard at `/admin`, create a login user in your **Supabase Dashboard** under **Authentication** -> **Users** -> **Add User** -> **Create User** (assign their email and password).

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

### GSAP Animations & Smooth Scroll
- **Hero Intro**: Individual letters of the heading stagger in on load.
- **Cursor Parallax**: A kinetic proximity listener tracks the cursor, creating weight-shifting skews on heading letters.
- **Smooth Scroll**: Powered by **Lenis** scroll controls synchronized with GSAP scroll handlers.
- **Viewport Entrance**: Sections slide up and fade in, staggering their internal component nodes on view entry.
- **Node Graph Connector Lines**: SVG paths dynamically trace links between coordinates stored in `skill_nodes`, using native `strokeDashoffset` scroll transitions.
- **Count-Up Numbers**: Metric values increment from zero and draw sparkline charts when entering the viewport.

### ⚡ DEPLOYMENT TO VERCEL

1. Push the code repository to **GitHub**.
2. Connect the repository to **Vercel** and initiate a new deployment.
3. In Vercel's **Environment Variables** configuration, copy and paste the values from your local `.env`.
4. Trigger a production build.
