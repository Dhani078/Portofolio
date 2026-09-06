'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function EntryScreen({ onEnter }: { onEnter: () => void }) {
  const [isEntering, setIsEntering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pressedKey, setPressedKey] = useState<'space' | 'enter' | null>(null);
  const [currentTime, setCurrentTime] = useState('02:00:00');
  const cardRef = useRef<HTMLDivElement>(null);

  // Smooth mouse parallax physics for 3D card tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardMouseX = useMotionValue(250);
  const cardMouseY = useMotionValue(250);

  const springX = useSpring(mouseX, { stiffness: 90, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 24 });

  const bgTranslateX = useTransform(springX, [-600, 600], [-25, 25]);
  const bgTranslateY = useTransform(springY, [-600, 600], [-25, 25]);
  const cardRotateX = useTransform(springY, [-350, 350], [8, -8]);
  const cardRotateY = useTransform(springX, [-350, 350], [-8, 8]);

  // Live WITA Clock
  useEffect(() => {
    setMounted(true);

    const updateClock = () => {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Makassar',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setCurrentTime(timeStr);
      } catch {
        const now = new Date();
        setCurrentTime(now.toTimeString().split(' ')[0]);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mouse move listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX - innerWidth / 2);
      mouseY.set(e.clientY - innerHeight / 2);

      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        cardMouseX.set(e.clientX - rect.left);
        cardMouseY.set(e.clientY - rect.top);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, cardMouseX, cardMouseY]);

  // Keyboard trigger listener (Space & Enter)
  const handleTriggerEnter = () => {
    if (isEntering) return;
    setIsEntering(true);
    setTimeout(() => {
      onEnter();
    }, 120);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEntering) return;
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setPressedKey('space');
        handleTriggerEnter();
      } else if (e.key === 'Enter' || e.code === 'Enter') {
        e.preventDefault();
        setPressedKey('enter');
        handleTriggerEnter();
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isEntering]);

  return (
    <motion.div
      key="clean-entry"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        filter: 'blur(20px)',
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
      }}
      className="fixed inset-0 z-[99999] bg-[#000000] text-white flex flex-col justify-between p-5 sm:p-8 lg:p-12 select-none overflow-hidden"
    >
          {/* Subtle Ambient Radial Lighting */}
          <motion.div
            style={{ x: bgTranslateX, y: bgTranslateY }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
          >
            <div className="absolute w-[800px] h-[800px] rounded-full bg-radial from-white/[0.04] via-transparent to-transparent blur-[140px]" />
            <div className="absolute inset-0 bg-tech-grid opacity-20" />
          </motion.div>

          {/* Top Bar */}
          <motion.header
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 flex items-center justify-between font-mono text-xs tracking-wider text-zinc-400"
          >
            {/* Left Brand */}
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-white font-bold tracking-widest font-display text-sm">DAN.DEV</span>
            </div>

            {/* Center Live Clock */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#121215] border border-white/10 text-zinc-300 font-mono text-xs">
              <span className="text-white font-semibold tracking-wider">{mounted ? currentTime : '02:00:00'}</span>
              <span className="text-zinc-500 text-[10px]">WITA</span>
            </div>

            {/* Right Location Tag */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-[#121215] border border-white/10 text-zinc-300 text-[11px]">
                Banjarmasin (UTC+8)
              </span>
            </div>
          </motion.header>

          {/* Centerpiece 3D Card */}
          <main className="relative z-20 my-auto flex flex-col items-center justify-center text-center px-4 w-full">
            <motion.div
              ref={cardRef}
              style={{
                rotateX: cardRotateX,
                rotateY: cardRotateY,
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-8 sm:p-12 rounded-3xl bg-[#09090B]/95 border border-white/15 backdrop-blur-2xl shadow-[0_0_80px_rgba(255,255,255,0.04)] max-w-lg w-full flex flex-col items-center group transition-colors duration-300 overflow-hidden"
            >
              {/* Subtle Corner Brackets */}
              <div className="absolute top-4 left-4 w-2.5 h-2.5 border-t border-l border-white/30 pointer-events-none" />
              <div className="absolute top-4 right-4 w-2.5 h-2.5 border-t border-r border-white/30 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-2.5 h-2.5 border-b border-l border-white/30 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-2.5 h-2.5 border-b border-r border-white/30 pointer-events-none" />

              {/* Logo Emblem */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#000000] border border-white/20 p-3 mb-6 flex items-center justify-center shadow-xl cursor-pointer"
              >
                <img
                  src="/Logo.png"
                  alt="DAN Logo"
                  className="w-full h-full object-contain filter brightness-125"
                />
                <div className="absolute inset-0 rounded-2xl bg-white/[0.04] pointer-events-none" />
              </motion.div>

              {/* Identity & Role */}
              <div className="space-y-2 mb-6">
                <h1 className="font-display font-extrabold text-sm sm:text-base tracking-[0.3em] text-white uppercase">
                  MUHAMMAD RIZKI RAMADHANI
                </h1>
                <p className="font-mono text-xs text-zinc-400 tracking-wider">
                  Full-Stack Software Engineer
                </p>
              </div>

              {/* Technology Badges */}
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8 max-w-sm">
                {[
                  'Next.js 16',
                  'React 19',
                  'TypeScript',
                  'Cloudflare Workers',
                  'PostgreSQL',
                  'Supabase',
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-xl bg-[#121215] border border-white/10 font-mono text-[11px] text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Master Trigger Button */}
              <motion.button
                onClick={handleTriggerEnter}
                disabled={isEntering}
                whileHover={!isEntering ? { scale: 1.03 } : {}}
                whileTap={!isEntering ? { scale: 0.97 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative w-full sm:w-auto px-9 py-3.5 rounded-2xl bg-white hover:bg-zinc-100 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-xl shadow-white/20 transition-all cursor-pointer group/btn disabled:opacity-90"
              >
                <span>{isEntering ? 'MEMBUKA...' : 'BUKA PORTOFOLIO'}</span>
                <span className={`w-1.5 h-1.5 rounded-full bg-black ${isEntering ? 'animate-ping' : ''}`} />
                <svg
                  className={`w-4 h-4 transform transition-transform ${isEntering ? 'translate-x-1' : 'group-hover/btn:translate-x-1'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>

              {/* Keyboard Shortcut Indicator */}
              <div className="mt-4 flex items-center gap-2 font-mono text-xs text-zinc-400">
                <span>atau tekan</span>
                <kbd
                  className={`px-2 py-0.5 rounded border text-[10px] font-bold transition-all ${
                    pressedKey === 'space'
                      ? 'bg-white text-black border-white scale-95'
                      : 'bg-[#121215] border-white/20 text-zinc-300'
                  }`}
                >
                  Space
                </kbd>
                <span>atau</span>
                <kbd
                  className={`px-2 py-0.5 rounded border text-[10px] font-bold transition-all ${
                    pressedKey === 'enter'
                      ? 'bg-white text-black border-white scale-95'
                      : 'bg-[#121215] border-white/20 text-zinc-300'
                  }`}
                >
                  Enter ↵
                </kbd>
              </div>
            </motion.div>
          </main>

          {/* Bottom Bar */}
          <motion.footer
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-zinc-500 tracking-wider gap-2"
          >
            <div>Banjarmasin, Kalimantan Selatan, Indonesia</div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-zinc-400">Portofolio 2026</span>
            </div>
          </motion.footer>

          {/* Expanding Shockwave on Enter Trigger */}
          {isEntering && (
            <motion.div
              initial={{ scale: 0.3, opacity: 0.8 }}
              animate={{ scale: 8, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 m-auto w-48 h-48 rounded-full border border-white pointer-events-none z-30"
            />
          )}
        </motion.div>
  );
}
