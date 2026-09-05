'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function EntryScreen({ onEnter }: { onEnter: () => void }) {
  const [isEntering, setIsEntering] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Smooth mouse parallax physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const bgTranslateX = useTransform(springX, [-500, 500], [-25, 25]);
  const bgTranslateY = useTransform(springY, [-500, 500], [-25, 25]);
  const cardRotateX = useTransform(springY, [-300, 300], [8, -8]);
  const cardRotateY = useTransform(springX, [-300, 300], [-8, 8]);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX - innerWidth / 2);
      mouseY.set(e.clientY - innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleTriggerEnter = () => {
    if (isEntering) return;
    setIsEntering(true);
    setTimeout(() => {
      onEnter();
    }, 750);
  };

  return (
    <AnimatePresence>
      {!isEntering && (
        <motion.div
          key="godmode-entry"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(20px)',
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[99999] bg-[#000000] text-white flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden"
        >
          {/* Reactive Ambient Glow with Parallax */}
          <motion.div
            style={{ x: bgTranslateX, y: bgTranslateY }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <div className="w-[800px] h-[800px] rounded-full bg-radial from-white/[0.04] via-white/[0.01] to-transparent blur-[140px]" />
            <div className="absolute inset-0 bg-tech-grid opacity-20" />
          </motion.div>

          {/* Top Telemetry Header */}
          <motion.header
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-widest text-zinc-400 uppercase"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-zinc-200 font-bold">DAN.DEV</span>
              <span className="text-zinc-600 hidden sm:inline">/// PROTOCOL v4.0</span>
            </div>

            <div className="flex items-center gap-4 text-[10px] sm:text-[11px] text-zinc-500">
              <span className="hidden md:inline font-mono">LATENCY: ~18ms</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300 font-mono">
                WITA / UTC+8
              </span>
            </div>
          </motion.header>

          {/* Centerpiece Monogram & Click-to-Enter Trigger */}
          <main className="relative z-10 my-auto flex flex-col items-center justify-center text-center px-4">
            {/* 3D Perspective Card Shield */}
            <motion.div
              style={{
                rotateX: cardRotateX,
                rotateY: cardRotateY,
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-6 sm:p-10 rounded-3xl bg-[#09090B]/90 border border-white/15 backdrop-blur-2xl shadow-[0_0_80px_rgba(255,255,255,0.04)] max-w-lg w-full flex flex-col items-center group hover:border-white/40 transition-colors"
            >
              {/* Corner Sci-Fi Crosshairs */}
              <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-white/50" />
              <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-white/50" />
              <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-white/50" />
              <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-white/50" />

              {/* Logo Emblem with Glow */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black border border-white/20 p-3 mb-6 flex items-center justify-center shadow-2xl"
              >
                <img
                  src="/Logo.png"
                  alt="DAN Logo"
                  className="w-full h-full object-contain filter brightness-125"
                />
                <div className="absolute inset-0 rounded-2xl bg-white/[0.04] pointer-events-none" />
              </motion.div>

              {/* Identity Typographic Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-1.5 mb-5"
              >
                <h1 className="font-mono text-xs sm:text-sm tracking-[0.35em] text-zinc-300 font-bold uppercase">
                  MUHAMMAD RIZKI RAMADHANI
                </h1>
                <p className="font-mono text-[10px] sm:text-xs text-zinc-500 tracking-widest uppercase">
                  FULL-STACK SOFTWARE ENGINEER
                </p>
              </motion.div>

              {/* Tech Architecture Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-1.5 mb-8"
              >
                {['Next.js 16', 'React 19', 'TypeScript', 'PostgreSQL', 'Supabase', 'RLS'].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 font-mono text-[10px] text-zinc-400"
                  >
                    {tech}
                  </span>
                ))}
              </motion.div>

              {/* Action Button: MASUK KE PORTFOLIO */}
              <motion.button
                onClick={handleTriggerEnter}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-3 shadow-2xl shadow-white/20 transition-all cursor-pointer group/btn"
              >
                <span>BUKA PORTOFOLIO</span>
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                <svg
                  className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>

              {/* Interactive Key Hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 flex items-center gap-2 font-mono text-[10px] text-zinc-500"
              >
                <span>atau tekan</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/20 text-zinc-300 text-[9px]">
                  SPACE
                </kbd>
                <span>/</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/20 text-zinc-300 text-[9px]">
                  ENTER ↵
                </kbd>
              </motion.div>
            </motion.div>
          </main>

          {/* Bottom Telemetry Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col sm:flex-row items-center justify-between font-mono text-[10px] text-zinc-500 tracking-wider uppercase gap-2"
          >
            <div>BANJARMASIN, SOUTH KALIMANTAN, INDONESIA</div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span>PRODUCTION BUILD READY</span>
            </div>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
