'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowUp, Sparkles, Send } from 'lucide-react';

export default function FloatingDock() {
  const whatsapp = '+6282251972512';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* 1-Click WhatsApp Quick Action */}
      <motion.a
        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2.5 rounded-2xl bg-white hover:bg-zinc-200 text-black font-mono font-extrabold text-xs flex items-center gap-2 shadow-2xl shadow-white/20 transition-all cursor-pointer"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">WhatsApp Fast Hub</span>
      </motion.a>

      {/* Back to Top Quick Trigger */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-2xl bg-[#09090B]/90 hover:bg-white hover:text-black border border-white/20 text-zinc-300 flex items-center justify-center shadow-2xl backdrop-blur-2xl transition-all cursor-pointer"
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
