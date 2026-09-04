'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const stages = [
    'INITIALIZING_KERNEL',
    'DECRYPTING_DAN.DEV_CORE',
    'MOUNTING_R3F_PHYSICS_ENGINE',
    'SYNCING_SUPABASE_CLUSTER',
    'SYSTEM_READY',
  ];

  useEffect(() => {
    // Fast, responsive progress counter
    const startTime = Date.now();
    const duration = 1600; // Exactly 1.6s total

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(currentProgress);

      const idx = Math.min(stages.length - 1, Math.floor((currentProgress / 100) * stages.length));
      setStageIndex(idx);

      if (currentProgress >= 100) {
        clearInterval(timer);
        setIsFinished(true);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#000000] flex flex-col justify-between p-8 sm:p-12 select-none overflow-hidden"
        >
          {/* Ambient Lighting Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-tech-grid opacity-15" />
          </div>

          {/* Top Status Bar */}
          <div className="relative z-10 flex justify-between items-center font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="text-zinc-300 font-bold">DAN.DEV SYSTEM OS v4.0</span>
            </div>
            <div>LOCATION: BANJARMASIN, ID (UTC+8)</div>
          </div>

          {/* Center Monogram / Brand Icon */}
          <div className="relative z-10 my-auto flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-24 h-24 rounded-3xl bg-[#09090b] border border-white/20 p-4 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.06)]"
            >
              <img
                src="/Logo.png"
                alt="DAN Logo"
                className="w-full h-full object-contain filter brightness-125"
              />
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-white/40" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-white/40" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-white/40" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-white/40" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-center"
            >
              <span className="font-mono text-xs tracking-[0.3em] text-zinc-400 font-semibold block uppercase">
                MUHAMMAD RIZKI RAMADHANI
              </span>
              <span className="font-mono text-[10px] text-zinc-600 tracking-wider mt-1 block">
                FULL-STACK SOFTWARE ENGINEER
              </span>
            </motion.div>
          </div>

          {/* Bottom Controls & Progress */}
          <div className="relative z-10 w-full max-w-xl mx-auto space-y-3 font-mono">
            <div className="flex justify-between items-end text-xs">
              <span className="text-zinc-400 text-[11px] tracking-wider uppercase font-medium">
                {stages[stageIndex]}
              </span>
              <span className="text-white font-extrabold text-sm tracking-tight">
                {progress}%
              </span>
            </div>

            {/* Precision Brutalist Progress Line */}
            <div className="w-full h-[2px] bg-zinc-900 overflow-hidden relative">
              <motion.div
                className="h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-zinc-600 tracking-widest pt-1">
              <span>STATUS: BOOTING</span>
              <span>BUFFER: OPTIMAL</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
