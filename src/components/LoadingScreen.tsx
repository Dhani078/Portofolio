'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { label: 'RUNTIME', value: 'Next.js 16 (Turbopack)' },
  { label: 'RENDERER', value: 'React 19 Server Architecture' },
  { label: 'PHYSICS', value: 'R3F + Rapier 3D Engine' },
  { label: 'DATABASE', value: 'Supabase PostgreSQL (RLS)' },
  { label: 'LOCATION', value: 'Banjarmasin, ID (WITA)' },
  { label: 'BUILD', value: 'Production Ready' },
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setShow(false);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      exitTimerRef.current = null;
      onComplete();
    }, 520);
  }, [onComplete]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
    };
  }, []);

  // Cascade boot lines one-by-one with faster cadence
  useEffect(() => {
    if (visibleLines >= BOOT_LINES.length) return;

    const delay = visibleLines === 0 ? 100 : 90 + Math.random() * 60;
    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  // 60fps counter animation (0 → 100 in 1.0s, snappy & high-adrenaline)
  useEffect(() => {
    let startTs: number | null = null;
    const duration = 1000;

    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * 100));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(100);
        // Brief hold at 100% before fast exit wipe
        setTimeout(dismiss, 180);
      }
    };

    const id = window.requestAnimationFrame(step);

    // Hard safety fallback
    const fallback = setTimeout(dismiss, 2000);

    return () => {
      window.cancelAnimationFrame(id);
      clearTimeout(fallback);
    };
  }, [dismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot-loader"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            transition: { duration: 0.5, ease: [0.77, 0, 0.175, 1] },
          }}
          className="fixed inset-0 z-[999999] bg-[#000000] text-white flex flex-col justify-between p-6 sm:p-10 lg:p-14 select-none overflow-hidden"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        >
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />

          {/* Scan line sweep */}
          <motion.div
            initial={{ top: '-2%' }}
            animate={{ top: '102%' }}
            transition={{ duration: 2.2, ease: 'linear', repeat: Infinity }}
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10"
          />

          {/* ── TOP BAR ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-widest text-zinc-500 uppercase"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-white font-bold tracking-[0.2em]">DAN.DEV</span>
              <span className="hidden sm:inline text-zinc-600">SYSTEM INIT</span>
            </div>
            <div className="text-zinc-500 font-mono">v2026.09</div>
          </motion.div>

          {/* ── CENTER ── */}
          <div className="relative z-20 my-auto flex flex-col items-center justify-center gap-8">

            {/* Logo with glow pulse */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-950 border border-white/20 p-3 flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.06)]">
                <img
                  src="/Logo.png"
                  alt="DAN Logo"
                  className="w-full h-full object-contain brightness-125"
                />
              </div>
              {/* Corner brackets */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-white/40" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t border-r border-white/40" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b border-l border-white/40" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-white/40" />
            </motion.div>

            {/* Giant counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-7xl sm:text-9xl font-extrabold tracking-tighter text-white leading-none tabular-nums"
            >
              {count.toString().padStart(3, '0')}
            </motion.div>

            {/* Boot log cascade */}
            <div className="w-full max-w-md space-y-1 font-mono text-[11px] sm:text-xs">
              {BOOT_LINES.map((line, i) => (
                <motion.div
                  key={line.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={i < visibleLines ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`w-1 h-1 rounded-full flex-shrink-0 ${
                      i < visibleLines ? 'bg-emerald-400' : 'bg-zinc-700'
                    }`}
                  />
                  <span className="text-zinc-500 uppercase tracking-wider min-w-[80px]">
                    {line.label}
                  </span>
                  <span className="text-zinc-300">{line.value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── BOTTOM ── */}
          <div className="relative z-20 w-full space-y-3">
            <div className="flex justify-between items-center font-mono text-[10px] sm:text-xs text-zinc-500">
              <span className="uppercase tracking-wider">
                {count < 100 ? 'INITIALIZING...' : 'READY'}
              </span>
              <span className="text-white font-bold tabular-nums">{count}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-[2px] bg-zinc-900 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-white"
                style={{ width: `${count}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            <div className="text-center font-mono text-[10px] text-zinc-600 tracking-wider uppercase">
              Muhammad Rizki Ramadhani
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
