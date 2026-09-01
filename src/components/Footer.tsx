'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Makassar',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WITA'
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/10 bg-[#000000] py-14 relative z-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <span>MRR.DEV</span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs text-zinc-400 font-normal">
              Muhammad Rizki Ramadhani
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-mono">
            Mahasiswa S1 Teknik Informatika UNISKA Banjarmasin · © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>

        {/* Live WITA Clock & Back to Top */}
        <div className="flex items-center gap-4">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#121215] border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{time || '12:00:00 WITA'}</span>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-[#121215] hover:bg-white hover:text-black border border-white/10 hover:border-white text-zinc-300 transition-all cursor-pointer shadow-sm"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
