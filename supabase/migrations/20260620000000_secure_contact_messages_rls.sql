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
