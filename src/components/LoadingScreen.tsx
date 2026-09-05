'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 60fps high performance counter (0 -> 100 in 1.4s)
    let startTimestamp: number | null = null;
    const duration = 1400; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing curve (easeOutExpo)
      const easeVal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeVal * 100));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(100);
        setTimeout(() => {
          setShow(false);
        }, 300);
      }
    };

    const animId = window.requestAnimationFrame(step);

    // Hard fallback safety: guarantee exit after 2.5s
    const fallback = setTimeout(() => {
      setShow(false);
    }, 2500);

    return () => {
      window.cancelAnimationFrame(animId);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] } 
          }}
          className="fixed inset-0 z-[99999] bg-[#000000] text-white flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        >
          {/* Subtle noise/grid background */}
          <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />

          {/* TOP BAR */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-widest text-zinc-500 uppercase">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-300 font-bold">DAN.DEV</span>
              <span className="hidden sm:inline text-zinc-600">/ SYSTEM BOOT</span>
            </div>
            <div className="text-zinc-400 font-mono">
              BANJARMASIN, ID (UTC+8)
            </div>
          </div>

          {/* CENTER MONUMENTAL COUNTER & LOGO */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
            {/* Animated Branding Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zinc-950 border border-white/20 p-4 mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.06)]"
            >
              <img
                src="/Logo.png"
                alt="DAN Logo"
                className="w-full h-full object-contain filter brightness-125"
              />
              <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-white/60" />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-t border-r border-white/60" />
              <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 border-b border-l border-white/60" />
              <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b border-r border-white/60" />
            </motion.div>

            {/* Giant Monospaced Brutalist Percentage */}
            <div className="font-mono text-7xl sm:text-9xl font-extrabold tracking-tighter text-white leading-none">
              {count.toString().padStart(2, '0')}%
            </div>

            <div className="font-mono text-xs sm:text-sm text-zinc-400 mt-4 tracking-[0.25em] uppercase">
              MUHAMMAD RIZKI RAMADHANI
            </div>
          </div>

          {/* BOTTOM TELEMETRY / STATUS */}
          <div className="relative z-10 w-full space-y-3">
            <div className="flex justify-between items-center font-mono text-[10px] sm:text-xs text-zinc-400">
              <span className="text-zinc-500 uppercase tracking-wider">
                {count < 30 && 'LOADING 3D RAPID LANYARD ENGINE...'}
                {count >= 30 && count < 70 && 'CONFIGURING SHADERS & GEOMETRIES...'}
                {count >= 70 && count < 100 && 'INITIALIZING SYSTEM INTERFACE...'}
                {count >= 100 && 'EXECUTION COMPLETE.'}
              </span>
              <span className="text-white font-bold">{count}/100</span>
            </div>

            {/* Brutalist Hairline Progress Bar */}
            <div className="w-full h-[2px] bg-zinc-900 overflow-hidden">
              <motion.div
                className="h-full bg-white"
                style={{ width: `${count}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
