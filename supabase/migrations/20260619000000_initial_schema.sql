-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    index TEXT NOT NULL,
    title TEXT NOT NULL,
    year INTEGER NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    summary TEXT,
    metrics JSONB NOT NULL DEFAULT '{"perf": 0, "a11y": 0, "build": ""}',
    case_study_url TEXT,
    sort_order INTEGER DEFAULT 0
);

-- Create skill_nodes table
CREATE TABLE IF NOT EXISTS public.skill_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL UNIQUE,
    "group" TEXT NOT NULL,
    connects_to TEXT[] NOT NULL DEFAULT '{}',
    x INTEGER NOT NULL,
    y INTEGER NOT NULL
);

-- Create stats table
CREATE TABLE IF NOT EXISTS public.stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    read BOOLEAN DEFAULT FALSE NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid errors during replay
DROP POLICY IF EXISTS "Allow public select on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public select on skill_nodes" ON public.skill_nodes;
DROP POLICY IF EXISTS "Allow public select on stats" ON public.stats;
DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated admin read on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated admin update on contact_messages" ON public.contact_messages;

-- Create Policies
CREATE POLICY "Allow public select on projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Allow public select on skill_nodes" ON public.skill_nodes
    FOR SELECT USING (true);

CREATE POLICY "Allow public select on stats" ON public.stats
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on contact_messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated admin read on contact_messages" ON public.contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin update on contact_messages" ON public.contact_messages
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Seed Data
-- NOTE: the original version ran TRUNCATE ... CASCADE here. Re-running this
-- migration (or running it against a live database) would have destroyed every
-- row in these tables. Seeding is now idempotent: we use ON CONFLICT DO UPDATE
-- so re-running updates the seed rows instead of wiping the tables.
-- Natural keys must exist for upserts to work:
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS seed_key TEXT;
ALTER TABLE public.skill_nodes ADD COLUMN IF NOT EXISTS seed_key TEXT;
ALTER TABLE public.stats ADD COLUMN IF NOT EXISTS seed_key TEXT;
-- Backfill: baris yang SUDAH ADA (mis. 3 proyek yang diedit lewat admin)
-- punya seed_key NULL. Karena unique index mengizinkan banyak NULL, upsert
-- akan menyisipkan DUPLIKAT alih-alih memperbarui. Karena itu kita isi
-- seed_key untuk baris lama berdasarkan nilai alaminya dulu.
-- Hasilnya HARUS sama persis dengan nilai seed_key pada INSERT di bawah;
-- kalau meleset, unique index menganggapnya baris baru dan data jadi dobel.
UPDATE public.projects SET seed_key = 'proj-' || index WHERE seed_key IS NULL;
UPDATE public.stats SET seed_key = CASE lower(label)
    WHEN 'proyek selesai'      THEN 'stat-projects'
    WHEN 'alur kerja'          THEN 'stat-workflow'
    WHEN 'teknik informatika'  THEN 'stat-campus'
    ELSE 'stat-' || lower(regexp_replace(label, '[^a-zA-Z0-9]', '', 'g'))
END WHERE seed_key IS NULL;
UPDATE public.skill_nodes SET seed_key = 'skill-' || lower(
    regexp_replace(label, '[^a-zA-Z0-9]', '', 'g')
) WHERE seed_key IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_projects_seed_key ON public.projects (seed_key);
CREATE UNIQUE INDEX IF NOT EXISTS uq_skill_nodes_seed_key ON public.skill_nodes (seed_key);
CREATE UNIQUE INDEX IF NOT EXISTS uq_stats_seed_key ON public.stats (seed_key);

-- Projects Seed
-- PENTING: DO NOTHING (bukan DO UPDATE) untuk projects.
--   Proyek bisa diedit lewat halaman /admin. Kalau seed memakai DO UPDATE,
--   menjalankan ulang migrasi ini akan MENIMPA judul/deskripsi yang sudah
--   kamu ubah dengan nilai contoh di bawah. DO NOTHING menjaga data asli:
--   baris baru hanya dibuat saat seed_key benar-benar belum ada (fresh DB).
-- Nilai di bawah disamakan dengan data yang sudah ada di database produksi.
INSERT INTO public.projects (seed_key, index, title, year, tags, summary, metrics, case_study_url, sort_order) VALUES
('proj-01', '01', 'Embun-Laundry', 2026, ARRAY['Web', 'Booking', 'Payments'], 'Aplikasi pengelolaan operasional layanan laundry modern terintegrasi dengan dashboard kasir, tracking status cucian real-time, dan manajemen transaksi online otomatis.', '{"perf": 95, "a11y": 100, "build": "✓"}', '#', 1),
('proj-02', '02', 'EquipRent MS — PT. Surya Bangun Sarana', 2026, ARRAY['Web', 'Dashboard', 'Inventory'], 'Sistem manajemen penyewaan alat berat terintegrasi untuk PT. Surya Bangun Sarana Banjarmasin.', '{"perf": 96, "a11y": 98, "build": "✓"}', '#', 2),
('proj-03', '03', 'GymVault — Fitness & Gym Companion', 2026, ARRAY['Mobile', 'Fitness', 'App'], 'Aplikasi mobile tracker & pendamping latihan gym harian yang simpel dan interaktif.', '{"perf": 94, "a11y": 97, "build": "✓"}', '#', 3)
ON CONFLICT (seed_key) DO NOTHING;

-- Stats Seed
-- DO NOTHING dengan alasan sama: jangan timpa yang sudah diedit.
INSERT INTO public.stats (seed_key, label, value, sort_order) VALUES
('stat-projects', 'Proyek Selesai', '3+', 1),
('stat-workflow', 'Alur Kerja', 'AI-First', 2),
('stat-campus', 'Teknik Informatika', 'UNISKA', 3)
ON CONFLICT (seed_key) DO NOTHING;

-- Skill Nodes Seed
INSERT INTO public.skill_nodes (seed_key, label, "group", connects_to, x, y) VALUES
('skill-claude', 'Claude', 'ai_tools', ARRAY['Web Apps', 'Mobile Apps'], 60, 60),
('skill-stitch', 'Stitch', 'ai_tools', ARRAY['Web Apps', 'Mobile Apps'], 60, 110),
('skill-antigravity', 'Antigravity', 'ai_tools', ARRAY['Web Apps', 'Mobile Apps'], 60, 160),
('skill-cursor', 'Cursor', 'ai_tools', ARRAY['Web Apps', 'Mobile Apps'], 60, 210),
('skill-webapps', 'Web Apps', 'build', ARRAY['Prompt Engineering', 'UI/UX'], 200, 100),
('skill-mobileapps', 'Mobile Apps', 'build', ARRAY['Prompt Engineering', 'UI/UX'], 200, 170),
('skill-promptengineering', 'Prompt Engineering', 'craft', ARRAY[]::text[], 340, 100),
('skill-uiux', 'UI/UX', 'craft', ARRAY[]::text[], 340, 170)
ON CONFLICT (seed_key) DO NOTHING;
