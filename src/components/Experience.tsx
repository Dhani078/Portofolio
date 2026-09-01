'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface TimelineItem {
  year: string;
  role: string;
  institution: string;
  location: string;
  type: 'work' | 'education';
  description: string;
  skills: string[];
}

const timelineData: TimelineItem[] = [
  {
    year: '2024 — Sekarang',
    role: 'Full-Stack Software Engineer (Freelance / Project-Based)',
    institution: 'Independent Software Engineering',
    location: 'Banjarmasin, Indonesia',
    type: 'work',
    description: 'Mengembangkan aplikasi web full-stack end-to-end untuk berbagai klien bisnis (Laundry Online, Sistem Manajemen Alat Berat PT Surya Bangun Sarana, dsb) dengan fokus performa Next.js 16, Supabase, dan integrasi payment gateway Midtrans.',
    skills: ['Next.js 16', 'React 19', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
  },
  {
    year: '2022 — Sekarang',
    role: 'S1 Teknik Informatika (Mahasiswa Aktif)',
    institution: 'Universitas Islam Kalimantan Muhammad Arsyad Al Banjari (UNISKA)',
    location: 'Banjarmasin, Indonesia',
    type: 'education',
    description: 'Menempuh pendidikan formal di Program Studi Teknik Informatika, mendalami Rekayasa Perangkat Lunak, Struktur Data & Algoritma, Perancangan Basis Data Relasional, serta Pemrograman Berorientasi Objek.',
    skills: ['Computer Science', 'Database Design', 'Software Engineering', 'Algorithms', 'Distributed Systems'],
  },
];

export default function Experience() {
  return (
    <section className="py-24 border-t border-white/10 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 scroll-mt-24" id="experience">
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
            <span>REKAM JEJAK & PENDIDIKAN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Pengalaman & Studi.
          </h2>
        </div>
        <p className="text-base text-zinc-400 max-w-lg font-light">
          Perjalanan profesional dalam rekayasa perangkat lunak dan fondasi akademis di UNISKA Banjarmasin.
        </p>
      </motion.div>

      {/* Timeline Tree */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-[2px] before:bg-white/10">
        {timelineData.map((item, idx) => {
          const isEven = idx % 2 === 0;
          const Icon = item.type === 'work' ? Briefcase : GraduationCap;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex flex-col md:flex-row items-start md:items-center ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Center Node */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-9 h-9 rounded-2xl bg-[#09090B] border-2 border-white text-white flex items-center justify-center z-20 shadow-xl shadow-white/10">
                <Icon className="w-4 h-4" />
              </div>

              {/* Timeline Content Card */}
              <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                <div className="p-7 sm:p-8 rounded-3xl bg-[#09090B]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4 hover:border-white/40 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <span className="px-3 py-1 rounded-xl bg-[#121215] border border-white/10 text-xs font-mono text-white font-bold">
                      {item.year}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-white" />
                      <span>{item.location}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white font-display">
                      {item.role}
                    </h3>
                    <div className="text-sm font-semibold text-zinc-300 mt-0.5">
                      {item.institution}
                    </div>
                  </div>

                  <p className="text-sm text-zinc-400 leading-relaxed font-light">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg bg-[#121215] border border-white/10 text-[11px] font-mono text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
