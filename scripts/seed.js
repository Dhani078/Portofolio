const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Load local .env variables manually to remain zero-dependency
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY must be configured in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const projects = [
  {
    index: "01",
    title: "Laundry Online System",
    category: "FULL-STACK",
    year: 2025,
    tags: ["Next.js 16", "Supabase", "Tailwind CSS", "Midtrans"],
    summary: "Aplikasi pemesanan layanan laundry terintegrasi dengan penjemputan cucian, pelacakan status pengerjaan secara real-time, dan sistem pembayaran online otomatis.",
    metrics: { perf: 98, a11y: 100, build: "100%" },
    case_study_url: "https://laundry-demo.example.com",
    live_url: "https://laundry-demo.example.com",
    github_url: "https://github.com",
    sort_order: 1
  },
  {
    index: "02",
    title: "Surya Heavy Rental Hub",
    category: "SISTEM WEB",
    year: 2025,
    tags: ["React 19", "TypeScript", "Dashboard", "PostgreSQL"],
    summary: "Sistem manajemen armada dan penyewaan alat berat terintegrasi untuk PT. Surya Bangun Sarana Banjarmasin, mencakup jadwal operator, logistik, dan invoice otomatis.",
    metrics: { perf: 96, a11y: 98, build: "100%" },
    case_study_url: "https://surya-rental.example.com",
    live_url: "https://surya-rental.example.com",
    github_url: "https://github.com",
    sort_order: 2
  },
  {
    index: "03",
    title: "GymVault — Fitness & Gym Companion",
    category: "FULL-STACK",
    year: 2026,
    tags: ["Next.js 16", "TypeScript", "Tailwind CSS", "Vercel"],
    summary: "Aplikasi pendamping latihan kebugaran dan pelacak program gym modern dengan visualisasi progres real-time, pencatatan beban/reps kinetik, dan deployment performa tinggi di Vercel Edge.",
    metrics: { perf: 99, a11y: 100, build: "100%" },
    case_study_url: "https://gymvault-app.vercel.app/",
    live_url: "https://gymvault-app.vercel.app/",
    github_url: "https://github.com",
    sort_order: 3
  }
];

const stats = [
  { label: "Proyek Produksi", value: "3+", sort_order: 1 },
  { label: "Fokus Engineering", value: "Full-Stack", sort_order: 2 },
  { label: "Pendidikan Formal", value: "UNISKA", sort_order: 3 }
];

const skillNodes = [
  // FRONTEND
  { category: 'Frontend', name: 'Next.js 16 (App Router)', level: 'Expert', depth: 'Server Actions, RSC, Turbopack, Streaming SSR', sort_order: 1 },
  { category: 'Frontend', name: 'React 19', level: 'Expert', depth: 'Server Components, useActionState, Transitions', sort_order: 2 },
  { category: 'Frontend', name: 'TypeScript (Strict)', level: 'Expert', depth: 'Strict Mode, Generics, Discriminated Unions', sort_order: 3 },
  { category: 'Frontend', name: 'Tailwind CSS', level: 'Expert', depth: 'Design Systems, Custom Tokens, Responsive Layouts', sort_order: 4 },
  { category: 'Frontend', name: 'Framer Motion', level: 'Advanced', depth: '120fps GPU Transitions, Spring Physics, Layout Animations', sort_order: 5 },

  // BACKEND & DATABASE
  { category: 'Backend & DB', name: 'Supabase & PostgreSQL', level: 'Expert', depth: 'RLS Security Policies, Triggers, Realtime Subscriptions', sort_order: 6 },
  { category: 'Backend & DB', name: 'Node.js REST APIs', level: 'Advanced', depth: 'Zod Runtime Validation, Edge Handlers, Webhooks', sort_order: 7 },
  { category: 'Backend & DB', name: 'Database Architecture', level: 'Advanced', depth: 'Relational Modeling, Indexing, Foreign Key Integrity', sort_order: 8 },

  // TOOLS & DEVOPS
  { category: 'Tools & DevOps', name: 'Git & GitHub Workflows', level: 'Expert', depth: 'Branching Strategy, CI/CD Actions, Release Tags', sort_order: 9 },
  { category: 'Tools & DevOps', name: 'Vercel Edge Platform', level: 'Expert', depth: 'Global CDN Routing, Serverless Functions, Analytics', sort_order: 10 },
  { category: 'Tools & DevOps', name: 'Midtrans Payment Gateway', level: 'Advanced', depth: 'Snap API, Webhook Verification, QRIS & Virtual Accounts', sort_order: 11 },
];

async function runSeed() {
  console.log('🚀 Starting programmatic Supabase seeding...');

  // 1. Seed Projects
  console.log('Cleaning and seeding public.projects...');
  await supabase.from('projects').delete().neq('index', 'xxx');
  const { error: errProj } = await supabase.from('projects').insert(projects);
  if (errProj) console.error('❌ Projects error:', errProj.message);
  else console.log('✅ Projects seeded successfully.');

  // 2. Seed Stats
  console.log('Cleaning and seeding public.stats...');
  await supabase.from('stats').delete().neq('label', 'xxx');
  const { error: errStats } = await supabase.from('stats').insert(stats);
  if (errStats) console.error('❌ Stats error:', errStats.message);
  else console.log('✅ Stats seeded successfully.');

  // 3. Seed Skill Nodes
  console.log('Cleaning and seeding public.skill_nodes...');
  await supabase.from('skill_nodes').delete().neq('category', 'xxx');
  const { error: errNodes } = await supabase.from('skill_nodes').insert(skillNodes);
  if (errNodes) console.error('❌ Skill nodes error:', errNodes.message);
  else console.log('✅ Skill nodes seeded successfully.');

  console.log('🎉 Seeding completed!');
}

runSeed();
