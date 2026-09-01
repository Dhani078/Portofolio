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

-- Seed Data (Clean up existing before insert to avoid duplicates)
TRUNCATE public.projects CASCADE;
TRUNCATE public.skill_nodes CASCADE;
TRUNCATE public.stats CASCADE;

-- Projects Seed
INSERT INTO public.projects (index, title, year, tags, summary, metrics, case_study_url, sort_order) VALUES
('01', 'Laundry Online', 2025, ARRAY['Web', 'Booking', 'Payments'], 'Aplikasi web pemesanan, jemput, dan antar laundry online secara praktis.', '{"perf": 95, "a11y": 100, "build": "✓"}', '#', 1),
('02', 'Surya Heavy Rental', 2025, ARRAY['Web', 'Dashboard', 'Inventory'], 'Sistem manajemen penyewaan alat berat terintegrasi untuk PT. Surya Bangun Sarana Banjarmasin.', '{"perf": 96, "a11y": 98, "build": "✓"}', '#', 2),
('03', 'Vault — Mobile Gym', 2026, ARRAY['Mobile', 'Fitness', 'App'], 'Aplikasi mobile tracker & pendamping latihan gym harian yang simpel dan interaktif.', '{"perf": 94, "a11y": 97, "build": "✓"}', '#', 3);

-- Stats Seed
INSERT INTO public.stats (label, value, sort_order) VALUES
('Proyek Selesai', '3+', 1),
('Alur Kerja', 'AI-First', 2),
('Teknik Informatika', 'UNISKA', 3);

-- Skill Nodes Seed
INSERT INTO public.skill_nodes (label, "group", connects_to, x, y) VALUES
('Claude', 'ai_tools', ARRAY['Web Apps', 'Mobile Apps'], 60, 60),
('Stitch', 'ai_tools', ARRAY['Web Apps', 'Mobile Apps'], 60, 110),
('Antigravity', 'ai_tools', ARRAY['Web Apps', 'Mobile Apps'], 60, 160),
('Cursor', 'ai_tools', ARRAY['Web Apps', 'Mobile Apps'], 60, 210),
('Web Apps', 'build', ARRAY['Prompt Engineering', 'UI/UX'], 200, 100),
('Mobile Apps', 'build', ARRAY['Prompt Engineering', 'UI/UX'], 200, 170),
('Prompt Engineering', 'craft', ARRAY[]::text[], 340, 100),
('UI/UX', 'craft', ARRAY[]::text[], 340, 170);
