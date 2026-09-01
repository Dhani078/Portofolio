'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Quote, CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    name: 'PT. Surya Bangun Sarana',
    role: 'Manajemen Operasional & Logistik Alat Berat',
    content: 'Sistem manajemen armada alat berat yang dibangun oleh Rizki sangat terstruktur. Alur penyewaan, pelacakan operator, hingga pembuatan invoice otomatis menghemat waktu operasional kami secara signifikan.',
    rating: 5,
    project: 'Surya Heavy Rental Hub',
  },
  {
    name: 'Mitra Usaha Laundry',
    role: 'Pemilik Bisnis Laundry & Dry Cleaning',
    content: 'Pelanggan kami sangat menyukai fitur tracking real-time status cucian dan pembayaran otomatis via QRIS Midtrans. Aplikasi berjalan sangat cepat tanpa pernah ada kendala server.',
    rating: 5,
    project: 'Laundry Online System',
  },
  {
    name: 'Rekan Akademisi UNISKA',
    role: 'Kolaborasi Proyek Perangkat Lunak',
    content: 'Rizki memiliki pemahaman yang luar biasa mendalam tentang Clean Architecture, TypeScript strict mode, dan optimasi database PostgreSQL. Sangat profesional dalam bekerja.',
    rating: 5,
    project: 'Full-Stack Architecture',
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
            <span>KEPUASAN KLIEN & KOLABORASI</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Testimoni Klien.
          </h2>
        </div>
        <p className="text-base text-zinc-400 max-w-lg font-light">
          Umpan balik nyata dari pemilik bisnis dan mitra kerja terkait keandalan hasil rekayasa perangkat lunak.
        </p>
      </motion.div>

      {/* Grid of Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="p-8 rounded-3xl bg-[#09090B]/95 border border-white/10 flex flex-col justify-between hover:border-white/40 transition-colors shadow-2xl backdrop-blur-2xl space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-white">
                  {[...Array(item.rating)].map((_, r) => (
                    <Star key={r} className="w-4 h-4 fill-white text-white" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                  <span>TERVERIFIKASI</span>
                </span>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed font-light italic">
                &ldquo;{item.content}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="font-bold text-white font-display text-base">
                {item.name}
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                {item.role}
              </div>
              <div className="text-[11px] font-mono text-zinc-300 mt-2">
                Proyek: <span className="text-white font-bold">{item.project}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
