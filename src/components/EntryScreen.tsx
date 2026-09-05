'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EntryScreen({ onEnter }: { onEnter: () => void }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    // Fade in the "CLICK TO ENTER" prompt after logo animation completes
    const timer = setTimeout(() => setShowPrompt(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    if (isEntering) return;
    setIsEntering(true);
    setShowPrompt(false);
    // Brief pause for press feedback, then trigger exit
    setTimeout(() => onEnter(), 300);
  };

  return (
    <AnimatePresence>
      {!isEntering && (
        <motion.div
          key="entry"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: ['polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'],
            transition: { duration: 0.85, ease: [0.77, 0, 0.175, 1] }
          }}
          className="fixed inset-0 z-[99999] bg-[#000000] flex flex-col items-center justify-center p-8 select-none overflow-hidden"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        >
          {/* Subtle tech grid background */}
          <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />

          {/* Central Brand Monument */}
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Animated Brand Icon with corner brackets */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-950 border border-white/20 p-5 mb-8 flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.06)]"
            >
              <img
                src="/Logo.png"
                alt="DAN Logo"
                className="w-full h-full object-contain filter brightness-125"
              />
              <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-white/60" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-white/60" />
              <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-white/60" />
              <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-white/60" />
            </motion.div>

            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-xs sm:text-sm tracking-[0.3em] text-zinc-400 font-semibold uppercase mb-2"
            >
              MUHAMMAD RIZKI RAMADHANI
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[10px] sm:text-xs text-zinc-600 tracking-wider uppercase"
            >
              FULL-STACK SOFTWARE ENGINEER
            </motion.div>

            {/* Stack tags */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-mono text-zinc-500"
            >
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Next.js 16</span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">React 19</span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">TypeScript</span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">PostgreSQL</span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Supabase</span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">RLS</span>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 font-mono text-[10px] text-zinc-500 tracking-wider uppercase"
            >
              BANJARMASIN, INDONESIA (WITA/UTC+8)
            </motion.div>

            {/* CLICK TO ENTER Prompt */}
            <AnimatePresence>
              {showPrompt && (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="mt-10 mb-8"
                >
                  <motion.button
                    onClick={handleEnter}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group px-8 py-4 rounded-full bg-transparent border-2 border-white/30 text-white font-mono text-xs tracking-[0.2em] uppercase cursor-pointer transition-colors overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span>MASUK KE DAN.DEV</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-4 h-4 flex items-center justify-center"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </span>
                    {/* Border shine sweep on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom status bar */}
          <div className="relative z-10 w-full absolute bottom-6 left-0 right-0 flex justify-between font-mono text-[10px] text-zinc-500 uppercase tracking-widest px-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-300 font-bold">DAN.DEV</span>
              <span className="hidden sm:inline text-zinc-600">/ SYSTEM READY</span>
            </div>
            <div>Click atau Tekan Spasi untuk Masuk</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}