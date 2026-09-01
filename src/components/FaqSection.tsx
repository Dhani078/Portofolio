'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Berapa lama estimasi pengerjaan satu proyek web full-stack?',
    answer: 'Tergantung kompleksitas fitur. Untuk landing page berperforma tinggi berkisar 3-7 hari kerja. Untuk sistem web lengkap dengan autentikasi, database PostgreSQL, dan integrasi payment gateway berkisar antara 2-4 minggu dengan milestone terukur.',
  },
  {
    question: 'Mengapa Anda memilih Next.js 16 App Router dan Supabase?',
    answer: 'Next.js 16 dengan React Server Components (RSC) dan Server Actions memberikan kecepatan loading luar biasa (sub-second) dan SEO optimal. Supabase menyediakan performa tinggi PostgreSQL asli dengan Row Level Security (RLS) untuk keamanan data tanpa kompromi.',
  },
  {
    question: 'Apakah Anda menerima kerja sama jarak jauh (Remote Freelance)?',
    answer: 'Ya, saya berdomisili di Banjarmasin (WITA) dan sangat terbuka untuk kerja sama remote dari seluruh Indonesia maupun internasional dengan komunikasi aktif via WhatsApp, Google Meet, dan GitHub.',
  },
  {
    question: 'Bagaimana alur pembayaran dan jaminan kualitas sistem?',
    answer: 'Standar pembayaran dibagi menjadi termin DP (30-50%) dan pelunasan setelah proyek siap rilis. Seluruh kode dilengkapi garansi pemeliharaan bug gratis selama 30 hari pasca-peluncuran.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 border-t border-white/10 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 scroll-mt-24" id="faq">
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
            <span>PERTANYAAN UMUM KLIEN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            FAQ & Konsultasi.
          </h2>
        </div>
        <p className="text-base text-zinc-400 max-w-lg font-light">
          Jawaban atas pertanyaan umum seputar durasi, teknologi, dan skema kerja sama rekayasa web.
        </p>
      </motion.div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-3xl bg-[#09090B]/95 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl transition-colors hover:border-white/40"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-bold text-white text-base sm:text-lg font-display">
                  {faq.question}
                </span>
                <div className={`p-2 rounded-xl bg-[#121215] border border-white/10 text-white transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-white text-black' : ''
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-7 pb-6 sm:pb-7 text-sm sm:text-base text-zinc-300 leading-relaxed font-light border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
