'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { 
  ArrowRight, 
  Terminal, 
  MapPin, 
  GraduationCap, 
  Code2, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Activity, 
  User,
  Box,
  ExternalLink 
} from 'lucide-react';

const LanyardCard = dynamic(() => import('@/components/LanyardCard'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] rounded-2xl bg-[#09090b] border border-white/10 flex items-center justify-center font-mono text-xs text-zinc-500">
      INITIALIZING 3D PHYSICS ENGINE...
    </div>
  ),
});

export default function Hero() {
  const [activeTab, setActiveTab] = useState<'lanyard' | 'profile' | 'code'>('lanyard');
  const [demoOrderActive, setDemoOrderActive] = useState(false);

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-28 sm:pt-36 pb-20 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 scroll-mt-24" id="hero">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column: Monumental Monochrome Typography & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Status Eyebrows */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121215] border border-white/15 text-xs font-mono text-zinc-200 shadow-md">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Available for Work</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#121215] border border-white/15 text-xs font-mono text-zinc-400 shadow-md">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>Banjarmasin, ID (WITA)</span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] font-display">
              <span className="text-white">Muhammad Rizki </span>
              <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                Ramadhani.
              </span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-zinc-300 font-light leading-snug">
              Full-Stack Software Engineer.
            </p>
          </div>

          {/* Editorial Descriptor */}
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl font-light">
            I build production-grade web applications from PostgreSQL databases to responsive, secure, and fast user interfaces.
          </p>

          {/* Core Tech Stack Badges */}
          <div className="pt-2">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>CORE TECHNOLOGIES</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'Next.js 16 (App Router)',
                'React 19',
                'TypeScript (Strict)',
                'Tailwind CSS',
                'Supabase & PostgreSQL',
                'Node.js REST APIs',
                '120 FPS Motion',
              ].map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[#121215] border border-white/10 text-xs font-mono text-zinc-300 hover:border-white/40 hover:text-white transition-colors shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => handleScrollToSection('work')}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-mono font-bold text-sm flex items-center gap-2 shadow-2xl shadow-white/20 hover:shadow-white/30 transition-all cursor-pointer active:scale-95"
            >
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleScrollToSection('contact')}
              className="px-6 py-3.5 rounded-xl bg-[#121215] hover:bg-[#1A1A1E] border border-white/20 hover:border-white/50 text-white font-mono text-sm transition-all cursor-pointer shadow-md"
            >
              Contact Me
            </button>
          </div>
        </motion.div>

        {/* Right Column: Code Profile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <div className="rounded-3xl bg-[#09090B]/95 border border-white/15 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl space-y-4 relative overflow-hidden">
            {/* Window Titlebar & Interactive Tab Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-500" />
                <div className="w-3 h-3 rounded-full bg-white" />
                <span className="text-xs font-mono text-zinc-400 ml-2 font-medium">
                  studio/mrr-engine
                </span>
              </div>

              {/* Segmented Control Tabs */}
              <div className="flex items-center gap-1 bg-[#121215] p-1 rounded-xl border border-white/10">
                {[
                  { id: 'lanyard', label: '3D Lanyard', icon: Box },
                  { id: 'profile', label: 'Portrait', icon: User },
                  { id: 'code', label: 'Contract', icon: Code2 },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`relative px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-black font-bold shadow-md shadow-white/10'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Viewport */}
            <div className="min-h-[440px] relative z-10 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {/* Tab 0: Interactive 3D Physics Lanyard Card */}
                {activeTab === 'lanyard' && (
                  <motion.div
                    key="lanyard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#050507] shadow-2xl flex flex-col items-center justify-center"
                  >
                    <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md bg-black/60 border border-white/20 text-[10px] font-mono text-zinc-300 backdrop-blur-md flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      <span>DRAG & THROW 3D CARD</span>
                    </div>
                    <LanyardCard />
                  </motion.div>
                )}
                {/* Tab 1: Authentic Portrait Photo (mrr.jpg) */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#121215] group shadow-inner"
                  >
                    <Image
                      src="/mrr.jpg"
                      alt="Muhammad Rizki Ramadhani"
                      fill
                      priority
                      className="object-cover object-top group-hover:scale-103 transition-transform duration-700 ease-out"
                      sizes="(max-width: 1024px) 100vw, 500px"
                    />

                    {/* Gradient Overlay & Vercel Badge */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-base sm:text-lg font-bold font-display">
                            Muhammad Rizki Ramadhani
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/30 text-[10px] font-mono text-white font-bold backdrop-blur-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            DEPLOYED
                          </span>
                        </div>
                        <div className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-zinc-300" />
                          <span>S1 Teknik Informatika · UNISKA Banjarmasin</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 3: Strict TypeScript & Database Contracts */}
                {activeTab === 'code' && (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 rounded-2xl bg-[#000000] text-zinc-200 font-mono text-xs space-y-1.5 overflow-x-auto leading-relaxed shadow-inner h-[380px] flex flex-col justify-center border border-white/10"
                  >
                    <div className="text-zinc-600">// engineer.ts</div>
                    <div>
                      <span className="text-zinc-400 font-bold">export interface</span>{' '}
                      <span className="text-white font-bold">SoftwareEngineer</span> &#123;
                    </div>
                    <div className="pl-4 text-zinc-300">
                      name: <span className="text-white">&quot;Muhammad Rizki Ramadhani&quot;</span>;
                    </div>
                    <div className="pl-4 text-zinc-300">
                      stack: [<span className="text-zinc-300">&quot;Next.js&quot;</span>, <span className="text-zinc-300">&quot;React&quot;</span>, <span className="text-zinc-300">&quot;PostgreSQL&quot;</span>];
                    </div>
                    <div className="pl-4 text-zinc-300">
                      location: <span className="text-white">&quot;Banjarmasin, ID&quot;</span>;
                    </div>
                    <div className="pl-4 text-zinc-300">
                      status: <span className="text-green-400">&quot;Available&quot;</span>;
                    </div>
                    <div>&#125;</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-3 pt-1 relative z-10">
              <div className="p-3.5 rounded-xl bg-[#121215] border border-white/10 flex flex-col justify-between">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Lighthouse Score</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5 flex items-center gap-1.5">
                  <AnimatedCounter value={100} suffix="/100" />
                  <span className="text-[10px] text-zinc-400 font-normal">Fast LCP</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121215] border border-white/10 flex flex-col justify-between">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Type Safety</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5 flex items-center gap-1.5">
                  <AnimatedCounter value={100} suffix="%" />
                  <span className="text-[10px] text-zinc-400 font-normal">Strict TypeScript</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
