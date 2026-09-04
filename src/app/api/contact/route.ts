import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

// Zod schema for input validation
const contactSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(100, 'Nama terlalu panjang'),
  email: z.string().email('Format email tidak valid').max(100, 'Email terlalu panjang'),
  message: z.string().min(1, 'Pesan wajib diisi').max(5000, 'Pesan terlalu panjang'),
  website: z.string().optional(), // Honeypot
});

// Basic in-memory rate limiting (IP tracking)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS_PER_WINDOW = 3;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Zod Validation
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(i => i.message).join(', ');
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

    // 3. Rate Limiting check
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const timestamps = rateLimitMap.get(clientIp) || [];
    
    // Filter out timestamps older than the rate limit window
    const activeTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    
    if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
          { error: 'Terlalu banyak mengirim pesan. Silakan tunggu 5 menit sebelum mengirim lagi.' },
          { status: 429 }
      );
    }
    
    // Update rate limit state
    activeTimestamps.push(now);
    rateLimitMap.set(clientIp, activeTimestamps);

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
