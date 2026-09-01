'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Cpu, GitCommit, CheckCircle2, ArrowRight } from 'lucide-react';

const pipelineStages = [
  {
    step: '01',
    phase: 'SYSTEM ARCHITECTURE & MODELING',
    title: 'Domain & Database Schema Contract',
    description: 'Perancangan entitas basis data (PostgreSQL 3NF), penetapan kebijakan Row Level Security (RLS), dan penyusunan antarmuka type-safe sebelum satu baris kode diimplementasikan.',
    telemetry: 'PostgreSQL • Schema Validation • Zero-Data-Loss Contract',
    colSpan: 'lg:col-span-7',
  },
  {
    step: '02',
    phase: 'CORE ENGINE',
    title: 'Type-Safe Full-Stack Implementation',
    description: 'Implementasi komponen Next.js 16 RSC, React 19 transition handling, dan integrasi backend asinkron dengan penanganan error defensif.',
    telemetry: 'Strict TypeScript • Zero "any" • Server Actions',
    colSpan: 'lg:col-span-5',
  },
  {
    step: '03',
    phase: 'BENCHMARK & VERIFICATION',
    title: 'Hardware Acceleration & Web Vitals Audit',
    description: 'Profiling performa render 120 FPS, optimasi Core Web Vitals (LCP < 1.2s, CLS: 0), dan verifikasi kompresi bundle JS.',
    telemetry: 'Lighthouse 100/100 • Sub-second TTFB • GPU Physics',
    colSpan: 'lg:col-span-5',
  },
  {
    step: '04',
    phase: 'DEPLOYMENT & CONTINUOUS DELIVERY',
    title: 'Global Edge Ingestion & Webhooks',
    description: 'Deployment ke Vercel Edge Network dengan TLS 1.3, integrasi webhook payment gateway dengan cryptographic signature verification, dan automated health checks.',
    telemetry: 'Automated CI/CD • Edge CDN • 99.99% Availability',
    colSpan: 'lg:col-span-7',
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
            <span>ALUR REKAYASA & PIPELINE PRODUKSI</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Pipeline Rekayasa.
          </h2>
        </div>
        <p className="text-base text-zinc-400 max-w-lg font-light">
          Metodologi deterministik: arsitektur terstruktur, verifikasi ketat, dan deployment skala produksi tanpa kompromi.
        </p>
      </motion.div>

      {/* Asymmetric Bento Pipeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {pipelineStages.map((stage, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className={`${stage.colSpan} p-8 rounded-3xl bg-[#09090B]/95 border border-white/10 flex flex-col justify-between hover:border-white/40 transition-colors shadow-2xl backdrop-blur-2xl space-y-6 group`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/10 text-white font-bold">
                  STAGE // {stage.step}
                </span>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  {stage.phase}
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>

            <div className="space-y-3 flex-grow">
              <h3 className="text-xl font-bold text-white font-display tracking-tight group-hover:text-zinc-200 transition-colors">
                {stage.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                {stage.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{stage.telemetry}</span>
              </div>
              <span className="text-[10px] text-zinc-400">PASSED</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
