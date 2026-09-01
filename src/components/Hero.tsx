'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const LanyardCard = dynamic(() => import('@/components/LanyardCard'), {
  ssr: false,
});

export default function Hero() {
  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-24 sm:pt-32 pb-16 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 scroll-mt-24 overflow-visible" id="hero">
      {/* 3D Interactive Lanyard Hanging Natural Background/Right Placement (Same as Reference) */}
      <LanyardCard />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 pointer-events-none">
        {/* Left Column: Monumental Monochrome Typography & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-6 pointer-events-auto"
        >
          {/* Status Eyebrows */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121215]/80 border border-white/15 text-xs font-mono text-zinc-200 shadow-md backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Available for Work</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#121215]/80 border border-white/15 text-xs font-mono text-zinc-400 shadow-md backdrop-blur-md">
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
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl font-light">
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
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg bg-[#18181b]/70 border border-white/10 text-xs font-mono text-zinc-300 shadow-sm backdrop-blur-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => handleScrollToSection('work')}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-medium text-sm transition-all duration-200 flex items-center gap-2 shadow-lg shadow-white/10 group cursor-pointer"
            >
              <span>Explore My Work</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleScrollToSection('contact')}
              className="px-6 py-3.5 rounded-xl bg-[#121215] hover:bg-[#18181b] border border-white/15 text-white font-medium text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Contact Me</span>
              <ExternalLink className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </motion.div>

        {/* Right Column: Empty space so lanyard can hang naturally on right half on desktop */}
        <div className="hidden lg:block lg:col-span-5 h-[500px]" />
      </div>

      {/* Scroll Down Indicator */}
      <div className="pt-12 flex items-center gap-2 text-xs font-mono text-zinc-500 relative z-10">
        <ChevronDown className="w-4 h-4 animate-bounce text-zinc-400" />
        <span>SCROLL DOWN</span>
      </div>
    </section>
  );
}
