'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface EntryScreenProps {
  onEnter: () => void;
  enabled?: boolean;
}

export default function EntryScreen({ onEnter, enabled = true }: EntryScreenProps) {
  const [isEntering, setIsEntering] = useState(false);
  const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pressedKey, setPressedKey] = useState<'space' | 'enter' | null>(null);
  const [currentTime, setCurrentTime] = useState('02:00:00');
  const cardRef = useRef<HTMLDivElement>(null);

  // Smooth mouse parallax physics for 3D card tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardMouseX = useMotionValue(250);
  const cardMouseY = useMotionValue(250);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 26 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 26 });

  const bgTranslateX = useTransform(springX, [-600, 600], [-20, 20]);
  const bgTranslateY = useTransform(springY, [-600, 600], [-20, 20]);
  const cardRotateX = useTransform(springY, [-350, 350], [7, -7]);
  const cardRotateY = useTransform(springX, [-350, 350], [-7, 7]);

  // Live WITA Clock synchronized to Banjarmasin (UTC+8)
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

  // Mouse move listener with local card coordinates for specular spotlight
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

  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) {
        clearTimeout(enterTimeoutRef.current);
        enterTimeoutRef.current = null;
      }
    };
  }, []);

  // Master Trigger Launch Action
  const handleTriggerEnter = () => {
    if (!enabled || isEntering) return;
    setIsEntering(true);
    enterTimeoutRef.current = setTimeout(() => {
      enterTimeoutRef.current = null;
      onEnter();
    }, 120);
  };

  // Tactile Keyboard Listeners (Space & Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enabled || isEntering) return;
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
  }, [enabled, isEntering]);

  return (
    <motion.div
      key="cinematic-entry"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.04,
        filter: 'blur(16px)',
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      }}
      className="fixed inset-0 z-[99999] bg-[#000000] text-white flex flex-col justify-between p-5 sm:p-8 lg:p-12 select-none overflow-hidden"
    >
      {/* Ambient Lighting & Architectural Grid */}
      <motion.div
        style={{ x: bgTranslateX, y: bgTranslateY }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
      >
        <div className="absolute w-[900px] h-[900px] rounded-full bg-radial from-white/[0.035] via-transparent to-transparent blur-[160px]" />
        <div className="absolute inset-0 bg-tech-grid opacity-15" />
      </motion.div>

      {/* ── TOP BAR ── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex items-center justify-between font-mono text-xs tracking-wider text-zinc-400"
      >
        {/* Left Brand Identifier */}
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-white font-bold tracking-widest font-display text-sm">
            DAN.DEV
          </span>
        </div>

        {/* Center Live Synchronized WITA Clock */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121215] border border-white/10 text-zinc-300 font-mono text-xs shadow-inner">
          <span className="text-white font-bold tracking-wider tabular-nums">
            {mounted ? currentTime : '02:00:00'}
          </span>
          <span className="text-zinc-500 text-[10px]">WITA (UTC+8)</span>
        </div>

        {/* Right Geographic Tag */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <span className="px-3 py-1 rounded-xl bg-[#121215] border border-white/10 text-zinc-300 text-[11px]">
            Banjarmasin, ID
          </span>
        </div>
      </motion.header>

      {/* ── CENTER: 3D Engineering Spec Deck ── */}
      <main className="relative z-20 my-auto flex flex-col items-center justify-center text-center px-4 w-full">
        <motion.div
          ref={cardRef}
          style={{
            rotateX: cardRotateX,
            rotateY: cardRotateY,
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative p-8 sm:p-12 rounded-3xl bg-[#09090B]/95 border border-white/15 backdrop-blur-2xl shadow-[0_0_80px_rgba(255,255,255,0.03)] max-w-lg w-full flex flex-col items-center group transition-colors duration-300 overflow-hidden"
        >
          {/* Subtle Specular Highlight tracking cursor */}
          <div className="absolute inset-0 bg-radial from-white/[0.04] to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

          {/* Minimalist Header Status Pill */}
          <div className="mb-6 flex items-center gap-2 px-3 py-1 rounded-full bg-[#121215] border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>PORTFOLIO 2026 • PRODUCTION RELEASE</span>
          </div>

          {/* Logo Tile */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#000000] border border-white/20 p-3.5 mb-6 flex items-center justify-center shadow-2xl cursor-pointer"
          >
            <Image
              src="/Logo.png"
              alt="DAN Logo"
              width={72}
              height={72}
              priority
              className="w-full h-full object-contain brightness-125"
            />
            <div className="absolute inset-0 rounded-2xl bg-white/[0.03] pointer-events-none" />
          </motion.div>

          {/* Identity & Technical Role */}
          <div className="space-y-2 mb-6">
            <h1 className="font-display font-black text-base sm:text-lg tracking-[0.25em] text-white uppercase leading-tight">
              MUHAMMAD RIZKI RAMADHANI
            </h1>
            <p className="font-mono text-xs sm:text-sm text-zinc-400 tracking-wider">
              Full-Stack Software Engineer
            </p>
          </div>

          {/* Curated Technology Stack Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-sm">
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
                className="px-3 py-1 rounded-xl bg-[#121215] border border-white/10 font-mono text-[11px] text-zinc-300 hover:border-white/30 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Master Launch Trigger CTA */}
          <motion.button
            onClick={handleTriggerEnter}
            disabled={!enabled || isEntering}
            whileHover={enabled && !isEntering ? { scale: 1.03 } : {}}
            whileTap={enabled && !isEntering ? { scale: 0.97 } : {}}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="relative w-full sm:w-auto px-10 py-4 rounded-2xl bg-white hover:bg-zinc-100 text-black font-mono font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-2xl shadow-white/20 transition-all cursor-pointer group/btn disabled:opacity-90"
          >
            <span>{isEntering ? 'MEMBUKA PORTOFOLIO...' : 'BUKA PORTOFOLIO'}</span>
            <ArrowRight
              className={`w-4 h-4 transform transition-transform ${
                isEntering ? 'translate-x-1.5' : 'group-hover/btn:translate-x-1'
              }`}
            />
          </motion.button>

          {/* Tactile Keycap Prompt */}
          <div className="mt-5 flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span>atau tekan</span>
            <kbd
              className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold tracking-wider transition-all duration-100 ${
                pressedKey === 'space'
                  ? 'bg-white text-black border-white scale-90 shadow-none'
                  : 'bg-[#121215] border-white/20 text-zinc-300 shadow-sm'
              }`}
            >
              SPACE
            </kbd>
            <span>atau</span>
            <kbd
              className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold tracking-wider transition-all duration-100 ${
                pressedKey === 'enter'
                  ? 'bg-white text-black border-white scale-90 shadow-none'
                  : 'bg-[#121215] border-white/20 text-zinc-300 shadow-sm'
              }`}
            >
              ENTER ↵
            </kbd>
          </div>
        </motion.div>
      </main>

      {/* ── BOTTOM BAR ── */}
      <motion.footer
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-zinc-500 tracking-wider gap-2"
      >
        <div>Kalimantan Selatan, Indonesia</div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="text-zinc-400">Next.js 16 • React 19 • Rapier Physics</span>
        </div>
      </motion.footer>

      {/* Tactile Light Shockwave on Launch */}
      {isEntering && (
        <motion.div
          initial={{ scale: 0.4, opacity: 0.9 }}
          animate={{ scale: 9, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 m-auto w-48 h-48 rounded-full border border-white pointer-events-none z-30"
        />
      )}
    </motion.div>
  );
}
