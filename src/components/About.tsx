'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { GraduationCap, MapPin, Code2, Server, Check, Layers, Zap, Sparkles, Activity, ShieldCheck, Award } from 'lucide-react';

export interface StatItem {
  id?: string;
  label: string;
  value: string;
  sort_order?: number;
}

interface AboutProps {
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  { label: 'Proyek Produksi', value: '3+' },
  { label: 'Fokus Engineering', value: 'Full-Stack' },
  { label: 'Pendidikan Formal', value: 'UNISKA' },
];

export default function About({ stats }: AboutProps) {
  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-24 border-t border-white/10 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 scroll-mt-24" id="about">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
      >
        <div>
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>PROFIL & LATAR BELAKANG</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Tentang Saya.
          </h2>
        </div>
        <p className="text-base text-zinc-400 max-w-lg font-light">
          Pendidikan formal, filosofi rekayasa perangkat lunak, dan pendekatan terstruktur dalam membangun produk digital.
        </p>
      </motion.div>

      {/* 12-Column High-Contrast Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bento 1: Academic & University Credential Card */}
        <div className="lg:col-span-4 rounded-3xl bg-[#09090B]/95 border border-white/10 p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between space-y-6 hover:border-white/40 transition-colors">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>

            <div>
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">
                PENDIDIKAN TINGGI
              </div>
              <h3 className="text-xl font-bold text-white mt-1 font-display">
                S1 Teknik Informatika
              </h3>
              <p className="text-sm text-zinc-400 mt-1 font-light">
                Universitas Islam Kalimantan Muhammad Arsyad Al Banjari (UNISKA) Banjarmasin.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Rekayasa Perangkat Lunak Modern</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Basis Data Relasional & PostgreSQL</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Arsitektur Web Terdistribusi</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 space-y-2 text-xs font-mono text-zinc-400">
            <div className="flex items-center justify-between">
              <span>Domisili</span>
              <span className="text-white font-bold">Banjarmasin (WITA)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ketersediaan</span>
              <span className="text-white font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Aktif & Siap Proyek
              </span>
            </div>
          </div>
        </div>

        {/* Bento 2: Main Narrative & Core Values */}
        <div className="lg:col-span-8 rounded-3xl bg-[#09090B]/95 border border-white/10 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl flex flex-col justify-between space-y-8 hover:border-white/40 transition-colors">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white font-bold">
              <span>CORE ENGINEERING PHILOSOPHY</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug font-display">
              Rekayasa Perangkat Lunak Berbasis Performa, Keamanan, & Arsitektur Bersih.
            </h3>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-light">
              Sebagai Full-Stack Software Engineer, saya membangun aplikasi web modern dengan fondasi <strong className="font-bold text-white">Next.js 16 (App Router)</strong>, <strong className="font-bold text-white">React 19</strong>, <strong className="font-bold text-white">TypeScript</strong>, dan basis data <strong className="font-bold text-white">Supabase / PostgreSQL</strong>.
            </p>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-light">
              Saya mengutamakan type-safety ketat untuk mencegah runtime bugs, optimasi performa loading di bawah 1 detik (Lighthouse 100/100), serta antarmuka yang responsif dan memukau bagi pengguna.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <div className="p-5 rounded-2xl bg-[#121215] border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                <Code2 className="w-4 h-4 text-white" />
                <span>Strict Type Safety & Zod</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                Menjamin keandalan aplikasi tanpa bug runtime menggunakan TypeScript strict mode dan skema validasi runtime Zod.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121215] border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                <Server className="w-4 h-4 text-white" />
                <span>Relational Database & RLS</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                Skema PostgreSQL terstruktur dengan isolasi keamanan data Row Level Security (RLS) di Supabase.
              </p>
            </div>
          </div>
        </div>

        {/* Bento 3: Live System Health & Telemetry Radar */}
        <div className="lg:col-span-12 p-6 sm:p-8 rounded-3xl bg-[#09090B]/95 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-md">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>System Health & Node Status</span>
                <span className="text-[10px] font-mono text-black bg-white px-2.5 py-0.5 rounded-full font-extrabold">
                  NOMINAL
                </span>
              </div>
              <div className="text-xs text-zinc-400 font-mono mt-0.5">
                Banjarmasin Edge Node (WITA) · PostgreSQL Active Pool
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="px-4 py-2.5 rounded-2xl bg-[#121215] border border-white/10 text-center shadow-md">
              <div className="text-[10px] font-mono text-zinc-400">LATENCY</div>
              <div className="text-xs font-bold text-white font-mono mt-0.5 flex items-center justify-center">
                <AnimatedCounter value={18} prefix="~" suffix="ms Edge" />
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#121215] border border-white/10 text-center shadow-md">
              <div className="text-[10px] font-mono text-zinc-400">BUILD ENGINE</div>
              <div className="text-xs font-bold text-white font-mono mt-0.5 flex items-center justify-center">
                <AnimatedCounter value={764} suffix="ms Turbo" />
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#121215] border border-white/10 text-center shadow-md">
              <div className="text-[10px] font-mono text-zinc-400">SECURITY</div>
              <div className="text-xs font-bold text-white font-mono mt-0.5 flex items-center justify-center">
                <AnimatedCounter value={100} suffix="% RLS" />
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#121215] border border-white/10 text-center shadow-md">
              <div className="text-[10px] font-mono text-zinc-400">UPTIME</div>
              <div className="text-xs font-bold text-white font-mono mt-0.5 flex items-center justify-center">
                <AnimatedCounter value={99} suffix=".99%" />
              </div>
            </div>
          </div>
        </div>

        {/* Bento 4: Metrics Row */}
        <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {displayStats.map((stat, i) => (
            <div
              key={stat.id || i}
              className="p-6 sm:p-8 rounded-3xl bg-[#09090B]/95 border border-white/10 flex flex-col justify-between shadow-2xl backdrop-blur-2xl hover:border-white/40 transition-colors"
            >
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4">
                METRIK // 0{i + 1}
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-400 mt-1 font-light">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
