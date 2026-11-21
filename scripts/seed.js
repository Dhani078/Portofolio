import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    seed_key: "proj-01",
    index: "01",
    title: "Embun-Laundry",
    year: 2026,
    tags: ["Cloudflare Workers", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    summary: "Aplikasi pengelolaan operasional layanan laundry modern terintegrasi dengan dashboard kasir, tracking status cucian real-time, dan manajemen transaksi online otomatis.",
    metrics: { perf: 99, a11y: 100, build: "100%" },
    case_study_url: "https://embun-laundry.dhanisepeda.workers.dev/dashboard",
    sort_order: 1
  },
  {
    seed_key: "proj-02",
    index: "02",
    title: "EquipRent MS — PT. Surya Bangun Sarana",
    year: 2026,
    tags: ["React 18", "TypeScript", "Cloudflare Workers", "TiDB Cloud Serverless", "Tailwind CSS"],
    summary: "Sistem Informasi Monitoring dan Penyewaan Alat Berat terintegrasi (Excavator, Bulldozer, Crane) dengan pelacakan GPS telemetri, jam operasional (Hour Meter), alur tanda tangan digital (E-Sign), dan verifikasi pembayaran multi-role.",
    metrics: { perf: 98, a11y: 100, build: "100%" },
    case_study_url: "https://equiprent-pt-surya-bangun-sarana.dhanisepeda.workers.dev/",
    sort_order: 2
  },
  {
    seed_key: "proj-03",
    index: "03",
    title: "GymVault — Fitness & Gym Companion",
    year: 2026,
    tags: ["Next.js 16", "TypeScript", "Tailwind CSS", "Vercel"],
    summary: "Aplikasi pendamping latihan kebugaran dan pelacak program gym modern dengan visualisasi progres real-time, pencatatan beban/reps kinetik, dan deployment performa tinggi di Vercel Edge.",
    metrics: { perf: 99, a11y: 100, build: "100%" },
    case_study_url: "https://gymvault-app.vercel.app/",
    sort_order: 3
  },
  {
    seed_key: "proj-04",
    index: "04",
    title: "KasDesk — Personal Finance & Wealth Tracker",
    year: 2026,
    tags: ["Next.js 16", "React 19", "Drizzle ORM", "TiDB Cloud", "PWA", "Auth.js"],
    summary: "PWA manajemen keuangan pribadi modern berkecepatan tinggi dengan kesiapan offline-first, Drizzle ORM + TiDB Serverless, pemindaian OCR struk otomatis, QuickLog 2-tap, kalkulator ekspresi di kolom nominal, dan proteksi biometrik/PIN.",
    metrics: { perf: 99, a11y: 100, build: "100%" },
    case_study_url: "https://kas-desk.vercel.app/",
    sort_order: 4
  },
  {
    seed_key: "proj-05",
    index: "05",
    title: "SIPASD — E-Arsip Dispora Kalsel",
    year: 2026,
    tags: ["Next.js 15", "TypeScript", "Tailwind CSS v4", "PostgreSQL", "E-Arsip", "UNISKA"],
    summary: "Sistem Informasi Pengelolaan Arsip Persuratan dan Disposisi resmi Dinas Kepemudaan dan Olahraga Provinsi Kalsel dengan 5 format laporan kearsipan resmi, disposisi hierarkis, pelacakan naskah surat, dan audit trail aktivitas.",
    metrics: { perf: 99, a11y: 100, build: "100%" },
    case_study_url: "https://sipasd.my.id/",
    sort_order: 5
  },
  {
    seed_key: "proj-06",
    index: "06",
    title: "KiosAI — Toko AI & Multi-Model Platform",
    year: 2026,
    tags: ["Next.js 15", "React 19", "TiDB Cloud Serverless", "DOKU QRIS", "9Router"],
    summary: "Platform e-commerce token AI dan agregator model cerdas dengan integrasi gateway pembayaran DOKU QRIS real-time (sinkronisasi saldo CAS HMAC), manajemen sesi HttpOnly defensif, dan routing inferensi AI terpadu.",
    metrics: { perf: 98, a11y: 100, build: "100%" },
    case_study_url: "https://tokoai.my.id/",
    sort_order: 6
  },
  {
    seed_key: "proj-07",
    index: "07",
    title: "WarTicket — Flash-Sale Booking Engine",
    year: 2026,
    tags: ["FastAPI", "Python Async", "Redis v8 Lua EVALSHA", "Neon PgBouncer", "React 18"],
    summary: "Engine pemesanan tiket flash-sale berkecepatan tinggi dengan garansi zero overselling via atomik Redis Lua EVALSHA, rollback transaksi terdistribusi Saga, dan connection pool PgBouncer.",
    metrics: { perf: 100, a11y: 100, build: "Pass" },
    case_study_url: "https://github.com/Dhani078/WarTicket",
    sort_order: 7
  }
];

const stats = [
  { seed_key: "stat-projects", label: "Proyek Produksi", value: "7+", sort_order: 1 },
  { seed_key: "stat-workflow", label: "Fokus Engineering", value: "Full-Stack", sort_order: 2 },
  { seed_key: "stat-campus", label: "Pendidikan Formal", value: "UNISKA", sort_order: 3 }
];

const skillNodes = [
  { seed_key: "skill-nextjs", label: "Next.js 16", "group": "frontend", connects_to: ["React 19", "TypeScript"], x: 60, y: 60 },
  { seed_key: "skill-react19", label: "React 19", "group": "frontend", connects_to: ["Tailwind CSS"], x: 60, y: 110 },
  { seed_key: "skill-typescript", label: "TypeScript", "group": "frontend", connects_to: ["PostgreSQL"], x: 60, y: 160 },
  { seed_key: "skill-supabase", label: "PostgreSQL & Supabase", "group": "backend", connects_to: ["FastAPI"], x: 200, y: 100 },
  { seed_key: "skill-fastapi", label: "FastAPI & Redis", "group": "backend", connects_to: ["Cloudflare Workers"], x: 200, y: 170 },
  { seed_key: "skill-cfworkers", label: "Cloudflare Workers", "group": "devops", connects_to: [], x: 340, y: 100 },
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
  await supabase.from('skill_nodes').delete().neq('label', 'xxx');
  const { error: errNodes } = await supabase.from('skill_nodes').insert(skillNodes);
  if (errNodes) console.error('❌ Skill nodes error:', errNodes.message);
  else console.log('✅ Skill nodes seeded successfully.');

  console.log('🎉 Seeding completed!');
}

runSeed();
