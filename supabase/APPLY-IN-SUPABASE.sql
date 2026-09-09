-- ============================================================================
-- CARA PAKAI
--   1. Buka Supabase Dashboard -> SQL Editor -> New query
--   2. Tempel SELURUH isi file ini, lalu klik RUN
--   3. Lanjut ke "LANGKAH BERIKUTNYA" di paling bawah
-- Aman dijalankan berulang kali (idempoten).
-- ============================================================================


-- ==========================================================================
-- FILE: 20260619000000_initial_schema.sql
-- ==========================================================================
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
-- Menyimpan cover proyek. Tanpa kolom ini, kode前端 memilih gambar
-- berdasarkan POSISI array, bukan identitas proyek, sehingga cover bisa
-- salah pasang (lihat SelectedWork.tsx). Nilai boleh path lokal
-- ('/equiprent-cover.jpg') atau URL absolut.
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url TEXT;
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
INSERT INTO public.projects (seed_key, index, title, year, tags, summary, metrics, case_study_url, image_url, sort_order) VALUES
('proj-01', '01', 'Embun-Laundry', 2026, ARRAY['Web', 'Booking', 'Payments'], 'Aplikasi pengelolaan operasional layanan laundry modern terintegrasi dengan dashboard kasir, tracking status cucian real-time, dan manajemen transaksi online otomatis.', '{"perf": 95, "a11y": 100, "build": "✓"}', 'https://embun-laundry.dhanisepeda.workers.dev/dashboard', 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=1000&auto=format&fit=crop', 1),
('proj-02', '02', 'EquipRent MS — PT. Surya Bangun Sarana', 2026, ARRAY['Web', 'Dashboard', 'Inventory'], 'Sistem manajemen penyewaan alat berat terintegrasi untuk PT. Surya Bangun Sarana Banjarmasin.', '{"perf": 96, "a11y": 98, "build": "✓"}', 'https://equiprent-pt-surya-bangun-sarana.dhanisepeda.workers.dev/', '/equiprent-cover.jpg', 2),
('proj-03', '03', 'GymVault — Fitness & Gym Companion', 2026, ARRAY['Mobile', 'Fitness', 'App'], 'Aplikasi mobile tracker & pendamping latihan gym harian yang simpel dan interaktif.', '{"perf": 94, "a11y": 97, "build": "✓"}', 'https://gymvault-app.vercel.app/', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop', 3)
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


-- ==========================================================================
-- FILE: 20260620000000_secure_contact_messages_rls.sql
-- ==========================================================================
-- ============================================================================
-- SECURITY FIX: contact_messages leak (revisi - berbasis admin_users)
-- ============================================================================
-- PROBLEM
--   Policy asli memberi akses ke SEMUA user terautentikasi:
--       USING (auth.role() = 'authenticated')
--   Artinya siapa pun yang punya akun Supabase di project ini bisa membaca
--   seluruh nama/email/pesan pengunjung. Ini pelanggaran privasi data.
--
-- KENAPA DIRANCANG ULANG (revisi dari versi sebelumnya)
--   Versi pertama mengunci ke SATU email hardcode. Itu berbahaya secara
--   operasional: kalau kamu ganti email atau lupa konfirmasi akun, admin
--   mendadak tidak bisa membaca pesan sama sekali (data tidak hilang, hanya
--   tersembunyi RLS) dan terlihat seperti data lenyap.
--   Sekarang kepemilikan ditentukan oleh TABEL, bukan string hardcode.
--
-- CARA PAKAI (urutan penting)
--   1. Jalankan skrip ini.
--   2. Buat akun Auth di Dashboard → Authentication → Users (centang
--      "Auto Confirm User").
--   3. Ambil UUID user itu, lalu:
--          INSERT INTO public.admin_users (user_id)
--          VALUES ('<uuid-user-anda>');
--      Atau untuk menjadikan admin SEMUA user yang sudah ada sekarang:
--          INSERT INTO public.admin_users (user_id)
--          SELECT id FROM auth.users ON CONFLICT DO NOTHING;
--   4. Verifikasi:  node scripts/check-rls-ready.mjs
--
-- CATATAN
--   Idempoten: aman dijalankan berulang kali.
-- ============================================================================

-- Tabel penanda admin. Baris = "user ini boleh baca pesan".
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin boleh melihat daftar admin (berguna untuk UI). Tidak ada policy
-- INSERT/UPDATE/DELETE: perubahan dilakukan manual lewat Dashboard/SQL,
-- sehingga akun tidak bisa mengangkat dirinya sendiri jadi admin.
DROP POLICY IF EXISTS "Admin can view admin_users" ON public.admin_users;
CREATE POLICY "Admin can view admin_users" ON public.admin_users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users a
            WHERE a.user_id = auth.uid()
        )
    );

-- Helper: apakah user saat ini admin? (SECURITY DEFINER agar bisa membaca
-- admin_users tanpa terekspos ke client.)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Hapus policy lama (yang lemah) dan versi hardcode-email sebelumnya.
DROP POLICY IF EXISTS "Allow authenticated admin read on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated admin update on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Owner read contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Owner update contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin read contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin update contact_messages" ON public.contact_messages;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Hanya admin yang terdaftar di admin_users yang boleh MEMBACA.
CREATE POLICY "Admin read contact_messages" ON public.contact_messages
    FOR SELECT
    USING (public.is_admin());

-- Hanya admin yang boleh menandai pesan sudah dibaca.
CREATE POLICY "Admin update contact_messages" ON public.contact_messages
    FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- INSERT tetap terbuka: form kontak publik harus bisa mengirim pesan
-- tanpa login, dan policy ini tidak bisa dipakai untuk membaca data.
-- Sengaja TIDAK ada policy DELETE: pesan tidak bisa dihapus lewat SDK.


-- ==========================================================================
-- FILE: 20260621000000_contact_rate_limits.sql
-- ==========================================================================
-- ============================================================================
-- SECURITY FIX: persistent, tamper-resistant contact-form rate limiting
-- ============================================================================
-- PROBLEM
--   The API route kept hits in a module-level Map:
--       const rateLimitMap = new Map<string, number[]>();
--   Two flaws:
--     1. Serverless cold starts / redeploys wipe it, so the limit is
--        effectively unenforced in production.
--     2. The key came from the client-controllable `x-forwarded-for` header,
--        which an attacker can change on every request.
--
-- FIX
--   Store hits in a dedicated table that is ONLY reachable with the
--   service-role key. Row Level Security is enabled and NO policies are
--   created, so the anon key (which ships to the browser) cannot read,
--   insert or delete a single row. The service role bypasses RLS by design
--   and is used exclusively inside the server-side API route.
--
--   We store SHA-256 hashes, never raw IPs or raw emails, so the table holds
--   no directly identifying data.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_hash TEXT NOT NULL,
    email_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for the "count recent hits" queries.
CREATE INDEX IF NOT EXISTS idx_contact_rate_limits_ip_time
    ON public.contact_rate_limits (ip_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_rate_limits_email_time
    ON public.contact_rate_limits (email_hash, created_at DESC);

-- Lock the table down: RLS on + zero policies = deny everything for
-- anon/authenticated. Only the service role (server-side) can use it.
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

-- NOTE: contact_messages is intentionally NOT touched here.
-- There is no DELETE policy on it, so messages cannot be destroyed
-- through the client SDK either.


-- ============================================================================
-- LANGKAH BERIKUTNYA (WAJIB - supaya /admin tidak terkunci)
-- ============================================================================
-- A. Buat akun dulu (kalau belum punya):
--      Dashboard -> Authentication -> Users -> Add user
--      Email: dhanisepeda@gmail.com
--      Centang "Auto Confirm User"  <-- PENTING
--
-- B. Jadikan dirimu admin (pilih salah satu):
--      INSERT INTO public.admin_users (user_id)
--      SELECT id FROM auth.users ON CONFLICT DO NOTHING;
--
-- C. Isi cover proyek yang sudah ada (kolom baru image_url):
--      UPDATE public.projects SET image_url = '/equiprent-cover.jpg'
--      WHERE title ILIKE '%EquipRent%';
--      UPDATE public.projects SET image_url =
--        'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=1000&auto=format&fit=crop'
--      WHERE title ILIKE '%Embun%';
--      UPDATE public.projects SET image_url =
--        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'
--      WHERE title ILIKE '%GymVault%';
--
-- D. Verifikasi dari terminal:  npm run check:rls
-- E. Deploy ke Vercel.
-- ============================================================================
