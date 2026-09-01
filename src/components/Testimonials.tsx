'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, CheckCircle2, ShieldCheck, GitPullRequest, Code2 } from 'lucide-react';

const endorsements = [
  {
    org: 'PT. SURYA BANGUN SARANA',
    domain: 'Enterprise Heavy Equipment Logistics',
    verdict: 'PRODUCTION VERIFIED',
    quote: 'Arsitektur relasional ERP alat berat menangani pelacakan armada GPS, multi-role dispatching, dan automated billing invoicing secara akurat tanpa inkonsistensi data.',
    author: 'Operations & Dispatch Engineering',
    stack: 'MySQL InnoDB • Relational 3NF • GPS Sync',
    colSpan: 'lg:col-span-7',
  },
  {
    org: 'MITRA USAHA LAUNDRY',
    domain: 'Real-time Tracking & Fintech',
    verdict: 'ZERO LATENCY',
    quote: 'Webhook Midtrans QRIS bekerja deterministik tanpa missing callback. State mesin cuci real-time terdistribusi cepat ke klien.',
    author: 'Business Principal & Operations',
    stack: 'Midtrans Snap API • QRIS Webhook • SSE',
    colSpan: 'lg:col-span-5',
  },
  {
    org: 'TEKNIK INFORMATIKA UNISKA',
    domain: 'Software Architecture & Code Standard',
    verdict: 'ARCHITECT APPROVED',
    quote: 'Konsistensi modular pattern, pemisahan layer business logic dari persistence, dan penerapan strict TypeScript tanpa fallback "any".',
    author: 'Academic & Software Peer Review',
    stack: 'Next.js 16 • PostgreSQL RLS • Strict TS',
    colSpan: 'lg:col-span-12',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 border-t border-white/10 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 scroll-mt-24" id="testimonials">
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
            <span>VERIFIKASI & ENDORSEMENT PRODUKSI</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Endorsement Teknis.
          </h2>
        </div>
        <p className="text-base text-zinc-400 max-w-lg font-light">
          Evaluasi keandalan kode, integritas arsitektur data, dan kepuasan operasional dari mitra industri.
        </p>
      </motion.div>

      {/* Asymmetric Bento Endorsements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {endorsements.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className={`${item.colSpan} p-8 rounded-3xl bg-[#09090B]/95 border border-white/10 flex flex-col justify-between hover:border-white/40 transition-colors shadow-2xl backdrop-blur-2xl space-y-6 group`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-sm font-bold text-white font-mono tracking-tight">
                    {item.org}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    {item.domain}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/20 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                  <span>{item.verdict}</span>
                </span>
              </div>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-300">
              <span className="text-white font-bold">{item.author}</span>
              <span className="text-[11px] text-zinc-400">{item.stack}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
