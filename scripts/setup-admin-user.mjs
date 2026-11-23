#!/usr/bin/env node
/**
 * Setup Admin User untuk Supabase Auth & RLS public.admin_users
 *
 * Pakai:
 *   node scripts/setup-admin-user.mjs <password-admin>
 */

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

function loadEnv() {
  try {
    const raw = readFileSync('.env', 'utf8');
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i === -1) continue;
      const k = t.slice(0, i).trim();
      const v = t.slice(i + 1).trim();
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {
    // env fallback
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diset di .env');
  process.exit(1);
}

const password = process.argv[2];
const email = process.argv[3] || 'dhanisepeda@gmail.com';

if (!password) {
  console.log('Pakai: node scripts/setup-admin-user.mjs <password-admin> [email]');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log(`🔧 Mendaftarkan admin user: ${email}...`);

  let userId = null;

  // 1. Cek apakah user sudah ada di Auth
  const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('❌ Gagal memeriksa list users:', listError.message);
    process.exit(1);
  }

  const existing = userList.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (existing) {
    console.log(`ℹ️ User ${email} sudah ada di Auth (ID: ${existing.id}). Memperbarui kata sandi...`);
    const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (updateError) {
      console.error('❌ Gagal memperbarui user:', updateError.message);
      process.exit(1);
    }
    userId = updated.user.id;
  } else {
    console.log(`➕ Membuat akun Auth baru untuk ${email}...`);
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) {
      console.error('❌ Gagal membuat user:', createError.message);
      process.exit(1);
    }
    userId = created.user.id;
    console.log(`✅ Akun Auth dibuat (ID: ${userId})`);
  }

  // 2. Daftarkan ke public.admin_users
  console.log('🛡️ Mendaftarkan ID ke public.admin_users...');
  const { error: adminError } = await supabase
    .from('admin_users')
    .upsert({ user_id: userId }, { onConflict: 'user_id' });

  if (adminError) {
    console.error('❌ Gagal mendaftarkan ke admin_users:', adminError.message);
    process.exit(1);
  }

  console.log('🎉 Berhasil! User resmi terdaftar sebagai admin.');
  console.log('Silakan jalankan: node scripts/check-rls-ready.mjs untuk verifikasi.');
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
