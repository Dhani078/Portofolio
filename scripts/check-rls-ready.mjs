#!/usr/bin/env node
/**
 * Pre-flight check sebelum & sesudah menjalankan migrasi RLS.
 *
 * KENAPA SKRIP INI ADA
 *   Policy baru mengunci contact_messages hanya untuk user yang terdaftar di
 *   tabel public.admin_users. Kalau tabel itu kosong, halaman admin akan
 *   menampilkan NOL pesan - data TIDAK hilang, hanya tersembunyi oleh RLS,
 *   tapi efeknya terlihat persis seperti kehilangan data.
 *
 *   Jadi: cek dulu, baru jalankan SQL. Lalu cek lagi untuk memastikan.
 *
 * Pakai:
 *   node scripts/check-rls-ready.mjs
 *
 * Butuh NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (dari .env).
 */

import { readFileSync } from 'node:fs';

// --- loader .env minimal (tanpa dependency) ---------------------------------
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
    /* .env opsional, bisa juga dari environment variable */
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function redact(email) {
  if (!email || !email.includes('@')) return '(tidak ada)';
  const [n, d] = email.split('@');
  return `${n.slice(0, 2)}***@${d}`;
}

async function api(path) {
  const res = await fetch(`${url.replace(/\/$/, '')}${path}`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  const text = await res.text();
  let body = text;
  try {
    body = JSON.parse(text);
  } catch {
    /* bukan JSON, biarkan string */
  }
  return { ok: res.ok, status: res.status, body };
}

async function main() {
  if (!url || !serviceKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum diset.');
    process.exit(1);
  }

  console.log('🔍 Pre-flight RLS — contact_messages\n');

  // 1. Akun auth yang ada
  const usersRes = await api('/auth/v1/admin/users');
  if (!usersRes.ok) {
    console.error(`❌ Gagal mengambil user (HTTP ${usersRes.status}).`);
    process.exit(1);
  }
  const users = Array.isArray(usersRes.body)
    ? usersRes.body
    : usersRes.body.users || [];
  console.log(`Akun auth terdaftar : ${users.length}`);
  for (const u of users) {
    console.log(`   - ${redact(u.email)} ${u.email_confirmed_at ? '(confirmed)' : '(BELUM confirmed)'}`);
  }

  // 2. Apakah tabel admin_users sudah ada & terisi?
  const adminRes = await api('/rest/v1/admin_users?select=user_id');
  if (adminRes.status === 404 || (adminRes.status === 400 && String(JSON.stringify(adminRes.body)).includes('admin_users'))) {
    console.log('\nTabel admin_users  : ❌ BELUM ADA');
    console.log('   → Jalankan: supabase/migrations/20260620000000_secure_contact_messages_rls.sql');
    console.log('\n⚠️  Setelah itu WAJIB insert minimal satu admin, kalau tidak');
    console.log('   halaman /admin akan kosong (pesan tidak hilang, hanya tersembunyi).');
    process.exit(2);
  }

  if (!adminRes.ok) {
    console.log(`\nTabel admin_users  : ⚠️  tidak bisa dicek (HTTP ${adminRes.status})`);
    console.log('  ', JSON.stringify(adminRes.body).slice(0, 200));
    process.exit(2);
  }

  const admins = adminRes.body || [];
  console.log(`\nTabel admin_users  : ✅ ADA (${admins.length} baris)`);

  if (admins.length === 0) {
    console.log('\n⚠️  Tabel ADA tapi KOSONG — admin belum bisa baca pesan!');
    console.log('\nJalankan salah satu di SQL Editor:');
    console.log('   -- jadikan SEMUA user yang sudah ada sebagai admin:');
    console.log('   INSERT INTO public.admin_users (user_id)');
    console.log('   SELECT id FROM auth.users ON CONFLICT DO NOTHING;');
    console.log('\n   -- atau satu user tertentu:');
    console.log("   INSERT INTO public.admin_users (user_id) VALUES ('<uuid-user>');");
    process.exit(2);
  }

  console.log('\n✅ admin_users terisi. Policy RLS bisa berjalan dengan benar.');
  console.log('   (Jika migrasi belum dijalankan, jalankan SQL-nya sekarang.)');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
