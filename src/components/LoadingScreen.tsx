'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('INITIALIZING ENVIRONMENT...');

  useEffect(() => {
    const stages = [
      { at: 20, text: 'DECRYPTING DAN.DEV ARCHITECTURE...' },
      { at: 45, text: 'MOUNTING 3D LANYARD & ASSETS...' },
      { at: 75, text: 'CONNECTING SYSTEM NODES (WITA)...' },
      { at: 95, text: 'SYSTEM READY.' },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }

        const currentStage = stages.find((s) => next >= s.at);
        if (currentStage) {
          setStage(currentStage.text);
        }

        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {progress <= 100 && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-[#000000] flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Subtle Cyber Grid */}
          <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

          {/* Central Monogram & Progress */}
          <div className="relative z-10 flex flex-col items-center max-w-sm w-full space-y-8">
            {/* Animated Logo Frame */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-16 h-16 rounded-2xl bg-zinc-950 border border-white/20 flex items-center justify-center p-3 shadow-[0_0_40px_rgba(255,255,255,0.08)]"
            >
              <img
                src="/Logo.png"
                alt="DAN Logo"
                className="w-full h-full object-contain filter brightness-110"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
            </motion.div>

            {/* Stage Text & Percentage */}
            <div className="w-full space-y-3 text-center">
              <div className="flex justify-between items-baseline font-mono text-xs text-zinc-400">
                <span className="text-[11px] tracking-wider text-zinc-300 font-semibold">{stage}</span>
                <span className="text-white font-bold">{progress}%</span>
              </div>

              {/* High Contrast Progress Bar */}
              <div className="w-full h-[3px] bg-zinc-900 rounded-full overflow-hidden border border-white/10 p-[0.5px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-zinc-400 via-white to-zinc-200"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Tech Subtitle */}
            <div className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase">
              DAN.DEV /// SYSTEM BOOT
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
