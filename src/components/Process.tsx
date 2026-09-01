'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, ShieldCheck, Zap, Rocket } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Analisis & Arsitektur Sistem',
    description: 'Memetakan kebutuhan bisnis, alur pengguna, pemodelan skema database PostgreSQL, dan spesifikasi kontrak type-safe sebelum kode ditulis.',
    icon: Layers,
  },
  {
    step: '02',
    title: 'Pengembangan Full-Stack Type-Safe',
    description: 'Membangun antarmuka Next.js 16 / React 19 dengan Tailwind CSS serta backend Supabase dengan keamanan Row Level Security (RLS).',
    icon: ShieldCheck,
  },
  {
    step: '03',
    title: 'Optimasi Web Vitals & Kecepatan',
    description: 'Audit menyeluruh skor Lighthouse 100/100, optimasi Core Web Vitals (LCP, FID, CLS), validasi Zod runtime, dan animasi 120 FPS tanpa lag.',
    icon: Zap,
  },
  {
    step: '04',
    title: 'Deployment Global & Pemeliharaan',
    description: 'Deployment ke Vercel Global Edge Network, konfigurasi custom domain, integrasi payment gateway Midtrans, dan dokumentasi sistem lengkap.',
    icon: Rocket,
  },
];

export default function Process() {
  return (
    <section className="py-24 border-t border-white/10 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 scroll-mt-24" id="process">
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
            <span>ALUR KERJA & METODOLOGI</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Alur Rekayasa.
          </h2>
        </div>
        <p className="text-base text-zinc-400 max-w-lg font-light">
          Proses terstruktur dari perancangan arsitektur hingga deployment produksi yang andal.
        </p>
      </motion.div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-7 rounded-3xl bg-[#09090B]/95 border border-white/10 flex flex-col justify-between hover:border-white/40 transition-colors shadow-2xl backdrop-blur-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-2xl font-extrabold font-mono text-white/30">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#121215] border border-white/15 flex items-center justify-center shadow-md text-white">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2 flex-grow">
                <h3 className="text-lg font-bold text-white font-display">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-white font-bold">
                Tahap // 0{idx + 1} Selesai Terverifikasi
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
