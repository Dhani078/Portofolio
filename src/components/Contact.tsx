'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle2, Copy, Sparkles, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const email = 'dhanisepeda@gmail.com';
  const whatsapp = '+6282148564979';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-24 border-t border-white/10 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 scroll-mt-24" id="contact">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
      >
        <div>
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>MULAI KERJA SAMA</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Hubungi Saya.
          </h2>
        </div>
        <p className="text-base text-zinc-400 max-w-lg font-light">
          Diskusikan kebutuhan proyek web Anda atau jadwalkan konsultasi arsitektur langsung.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Contact & Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-[#09090B]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-display">
                Saluran Komunikasi Langsung
              </h3>
              <p className="text-sm text-zinc-400 mt-1 font-light">
                Respon cepat dalam waktu kurang dari 24 jam kerja (WITA).
              </p>
            </div>

            {/* Email Card with 1-Click Copy */}
            <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 space-y-2">
              <div className="text-[11px] font-mono text-zinc-400 uppercase flex items-center justify-between">
                <span>EMAIL RESMI</span>
                <button
                  onClick={handleCopy}
                  className="text-white hover:text-zinc-300 flex items-center gap-1 cursor-pointer font-bold transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-white" />
                      <span className="text-white">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-sm font-mono text-white font-medium break-all">
                {email}
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 space-y-2">
              <div className="text-[11px] font-mono text-zinc-400 uppercase flex items-center justify-between">
                <span>WHATSAPP LANGSUNG</span>
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline font-bold"
                >
                  Buka Chat →
                </a>
              </div>
              <div className="text-sm font-mono text-white font-medium">
                +62 822-5197-2512
              </div>
            </div>

            {/* Location & Timezone */}
            <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 space-y-1 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-white" />
                <span>Banjarmasin, Kalimantan Selatan, Indonesia</span>
              </div>
              <div className="text-[11px] text-zinc-500 pl-5">
                Zona Waktu: Central Indonesia Time (UTC+8 / WITA)
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 sm:p-10 rounded-3xl bg-[#09090B]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-5"
          >
            <h3 className="text-xl font-bold text-white font-display">
              Kirim Pesan atau Penawaran Proyek
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase">
                  Nama Anda / Perusahaan
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso (PT. Maju)"
                  className="w-full px-4 py-3 rounded-2xl bg-[#121215] border border-white/10 text-white font-mono text-xs focus:border-white focus:outline-none placeholder:text-zinc-600 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase">
                  Email Anda
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="budi@example.com"
                  className="w-full px-4 py-3 rounded-2xl bg-[#121215] border border-white/10 text-white font-mono text-xs focus:border-white focus:outline-none placeholder:text-zinc-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 uppercase">
                Rincian Proyek / Pesan
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Ceritakan tentang proyek web yang ingin Anda bangun, estimasi waktu, atau kebutuhan fitur..."
                className="w-full px-4 py-3 rounded-2xl bg-[#121215] border border-white/10 text-white font-mono text-xs focus:border-white focus:outline-none placeholder:text-zinc-600 transition-colors resize-none"
              />
            </div>

            {status === 'success' && (
              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Pesan berhasil dikirim! Saya akan menghubungi Anda segera.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono">
                Gagal mengirim pesan. Silakan hubungi langsung via WhatsApp atau Email di samping.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 rounded-2xl bg-white hover:bg-zinc-200 text-black font-mono font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xl shadow-white/20 active:scale-98 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <span>Mengirim Pesan...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan Sekarang</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
