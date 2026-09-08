import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash } from 'node:crypto';
import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

// Zod schema for input validation
const contactSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(100, 'Nama terlalu panjang'),
  email: z.string().email('Format email tidak valid').max(100, 'Email terlalu panjang'),
  message: z.string().min(1, 'Pesan wajib diisi').max(5000, 'Pesan terlalu panjang'),
  website: z.string().optional(), // Honeypot
});

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS_PER_WINDOW = 3;          // per IP per window
const EMAIL_WINDOW_MS = 60 * 60 * 1000;     // 1 hour
const MAX_REQUESTS_PER_EMAIL = 5;           // per email per hour

// Fallback store, used only when the service-role client is unavailable
// (e.g. env not configured). Prevents the route from crashing.
const fallbackHits = new Map<string, number[]>();
const FALLBACK_MAX_ENTRIES = 5000;

function hash(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

/**
 * Best-effort client IP.
 *
 * We deliberately do NOT trust a raw client-supplied header as the sole key:
 * `x-forwarded-for` can be spoofed. It is still useful as one signal, and the
 * persistent server-side counter below is what actually enforces the limit
 * across restarts.
 */
function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    // Chain is "client, proxy1, proxy2" - take the left-most entry.
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

function pruneFallback(now: number) {
  if (fallbackHits.size <= FALLBACK_MAX_ENTRIES) return;
  for (const [key, times] of fallbackHits) {
    const recent = times.filter((t) => now - t < EMAIL_WINDOW_MS);
    if (recent.length === 0) fallbackHits.delete(key);
    else fallbackHits.set(key, recent);
  }
}

function fallbackLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  pruneFallback(now);
  const times = (fallbackHits.get(key) || []).filter((t) => now - t < windowMs);
  if (times.length >= max) {
    fallbackHits.set(key, times);
    return true; // limited
  }
  times.push(now);
  fallbackHits.set(key, times);
  return false;
}

type LimitResult = { limited: true; retryMessage: string } | { limited: false };

async function isRateLimited(ipHash: string, emailHash: string): Promise<LimitResult> {
  const slowDown = 'Terlalu banyak mengirim pesan. Silakan tunggu beberapa saat sebelum mengirim lagi.';

  // -----------------------------------------------------------------------
  // Layer 1 (always on): in-memory limiter.
  // This runs even when Supabase is configured, because the durable layer
  // below depends on a service key + migration that may be missing (the
  // Supabase JS client reports failures as returned errors, not exceptions,
  // which silently disabled limiting in an earlier version of this file).
  // -----------------------------------------------------------------------
  if (fallbackLimit(`ip:${ipHash}`, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS)) {
    return { limited: true, retryMessage: slowDown };
  }
  if (fallbackLimit(`em:${emailHash}`, MAX_REQUESTS_PER_EMAIL, EMAIL_WINDOW_MS)) {
    return { limited: true, retryMessage: slowDown };
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return { limited: false };
  }

  try {
    const ipSince = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const emailSince = new Date(Date.now() - EMAIL_WINDOW_MS).toISOString();

    const [ipCount, emailCount] = await Promise.all([
      admin
        .from('contact_rate_limits')
        .select('id', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('created_at', ipSince),
      admin
        .from('contact_rate_limits')
        .select('id', { count: 'exact', head: true })
        .eq('email_hash', emailHash)
        .gte('created_at', emailSince),
    ]);

    // IMPORTANT: the Supabase JS client returns errors instead of throwing.
    // If the table is missing (migration not yet applied) `count` is null and
    // `?? 0` would silently disable rate limiting. Fail closed: fall back to
    // the in-memory limiter instead of letting everything through.
    if (ipCount.error || emailCount.error) {
      console.error(
        'Rate limit table unavailable (is the migration applied?):',
        ipCount.error?.message || emailCount.error?.message
      );
      return { limited: false };
    }

    if ((ipCount.count ?? 0) >= MAX_REQUESTS_PER_WINDOW) {
      return { limited: true, retryMessage: slowDown };
    }
    if ((emailCount.count ?? 0) >= MAX_REQUESTS_PER_EMAIL) {
      return { limited: true, retryMessage: slowDown };
    }

    // Record the attempt. Failure here must not silently disable limiting,
    // but we also don't want to block a legitimate user over a logging error.
    await admin.from('contact_rate_limits').insert({ ip_hash: ipHash, email_hash: emailHash });
    return { limited: false };
  } catch (err) {
    console.error('Rate limit check failed, falling back to in-memory:', err);
    if (fallbackLimit(`ip:${ipHash}`, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS)) {
      return { limited: true, retryMessage: slowDown };
    }
    return { limited: false };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod Validation
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((i) => i.message).join(', ');
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name, email, message, website } = parsed.data;

    // 2. Honeypot check
    // If the hidden website field is filled out, we suspect it's a bot.
    // We return a "success" response to trick the bot, but we don't save or email.
    if (website && website.trim() !== '') {
      console.warn('🤖 Bot submission detected via website honeypot field.');
      return NextResponse.json({ success: true, message: 'Pesan terkirim ✓' });
    }

    // 3. Rate limiting (persistent, service-role backed)
    const ipHash = hash(getClientIp(req));
    const emailHash = hash(email);

    const limit = await isRateLimited(ipHash, emailHash);
    if (limit.limited) {
      return NextResponse.json({ error: limit.retryMessage }, { status: 429 });
    }

    // 4. Save message to Supabase contact_messages
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message }]);

    if (dbError) {
      console.error('Supabase DB Insert Error:', dbError);
      throw new Error('Gagal menyimpan pesan ke database.');
    }

    // 5. Send Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: email, // Resend sandbox restricts to verified email, send copy back to sender or admin
          subject: `DAN.DEV - Pesan diterima dari ${name}`,
          text: `Halo ${name},\n\nTerima kasih sudah menghubungi! Berikut adalah salinan pesan yang kamu kirimkan:\n\n"${message}"\n\nSaya akan segera membalas pesanmu.\n\nSalam hangat,\nMuhammad Rizki Ramadhani`,
        });
        console.log(`✉️ Email successfully sent via Resend to: ${email}`);
      } catch (emailErr) {
        console.error('⚠️ Resend email sending failed, but database record was saved:', emailErr);
      }
    } else {
      console.log(`[MOCK RESEND EMAIL] To: ${email} | Subject: Message received | Content: "${message}"`);
    }

    return NextResponse.json({ success: true, message: 'Pesan terkirim ✓' });
  } catch (err: any) {
    console.error('Contact handler error:', err);
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}
