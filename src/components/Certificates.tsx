'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  X,
  ZoomIn,
} from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  fileName: string;
  pdfUrl: string;
  imageUrl: string;
}

const certificates: Certificate[] = [
  {
    id: 'algo-1',
    title: 'Praktikum Algoritma dan Pemrograman 1',
    fileName: 'Praktikum Algoritma Dan Pemrograman 1.pdf',
    pdfUrl: '/sertifikat/Praktikum%20Algoritma%20Dan%20Pemrograman%201.pdf',
    imageUrl: '/certificates/praktikum-algoritma-dan-pemrograman-1.jpg',
  },
  {
    id: 'algo-2',
    title: 'Praktikum Algoritma dan Pemrograman 2',
    fileName: 'Praktikum Algoritma Dan Pemrograman 2.pdf',
    pdfUrl: '/sertifikat/Praktikum%20Algoritma%20Dan%20Pemrograman%202.pdf',
    imageUrl: '/certificates/praktikum-algoritma-dan-pemrograman-2.jpg',
  },
  {
    id: 'android',
    title: 'Praktikum Android',
    fileName: 'Praktikum Android.pdf',
    pdfUrl: '/sertifikat/Praktikum%20Android.pdf',
    imageUrl: '/certificates/praktikum-android.jpg',
  },
  {
    id: 'network-1',
    title: 'Praktikum Jaringan Komputer 1',
    fileName: 'Praktikum Jaringan Komputer 1.pdf',
    pdfUrl: '/sertifikat/Praktikum%20Jaringan%20Komputer%201.pdf',
    imageUrl: '/certificates/praktikum-jaringan-komputer-1.jpg',
  },
  {
    id: 'network-2',
    title: 'Praktikum Jaringan Komputer 2',
    fileName: 'Praktikum Jaringan Komputer 2.pdf',
    pdfUrl: '/sertifikat/Praktikum%20Jaringan%20Komputer%202.pdf',
    imageUrl: '/certificates/praktikum-jaringan-komputer-2.jpg',
  },
  {
    id: 'web-1',
    title: 'Praktikum Pemrograman Web 1',
    fileName: 'Praktikum Pemrograman Web 1.pdf',
    pdfUrl: '/sertifikat/Praktikum%20Pemrograman%20Web%201.pdf',
    imageUrl: '/certificates/praktikum-pemrograman-web-1.jpg',
  },
  {
    id: 'ppn',
    title: 'Praktikum Program Paket Niaga (PPN)',
    fileName: 'Praktikum Program Paket Niaga (ppn).pdf',
    pdfUrl: '/sertifikat/Praktikum%20Program%20Paket%20Niaga%20%28ppn%29.pdf',
    imageUrl: '/certificates/praktikum-program-paket-niaga-(ppn).jpg',
  },
  {
    id: 'web-2',
    title: 'Praktikum Pemrograman Web 2',
    fileName: 'sertifikat pemrograman web 2.pdf',
    pdfUrl: '/sertifikat/sertifikat%20pemrograman%20web%202.pdf',
    imageUrl: '/certificates/sertifikat-pemrograman-web-2.jpg',
  },
];

export default function Certificates() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isOpen = selectedIndex !== null;
  const active = isOpen ? certificates[selectedIndex as number] : null;

  const close = useCallback(() => setSelectedIndex(null), []);
  const prev = useCallback(() => {
    setSelectedIndex((i) =>
      i === null ? null : (i - 1 + certificates.length) % certificates.length
    );
  }, []);
  const next = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : (i + 1) % certificates.length));
  }, []);

  // Keyboard: Escape to close, arrows to navigate.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close, prev, next]);

  // Lock background scroll while the viewer is open.
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);
  const openPDF = (cert: Certificate) => {
    window.open(cert.pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const downloadPDF = (cert: Certificate) => {
    const link = document.createElement('a');
    link.href = cert.pdfUrl;
    link.download = cert.fileName;
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      className="py-24 border-t border-white/10 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 scroll-mt-24"
      id="certificates"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
      >
        <div>
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-white" />
            <span>SERTIFIKAT &amp; PRAKTIKUM</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Bukti Kompetensi.
          </h2>
        </div>
        <p className="text-base text-zinc-400 max-w-lg font-light">
          Sertifikat praktikum mata kuliah Teknik Informatika UNISKA Banjarmasin.
          Klik untuk perbesar, lalu unduh PDF aslinya.
        </p>
      </motion.div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {certificates.map((cert, idx) => (
          <motion.article
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -6 }}
            className="group relative bg-[#09090B]/95 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-colors cursor-pointer"
            onClick={() => setSelectedIndex(idx)}
          >
            {/* Thumbnail */}
            <div className="aspect-[4/3] relative overflow-hidden bg-[#121215]">
              <Image
                src={cert.imageUrl}
                alt={cert.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs font-mono text-white/80 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur">
                    Klik untuk perbesar
                  </span>
                  <ZoomIn className="w-5 h-5 text-white ml-2" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-white text-sm sm:text-base font-display line-clamp-1 group-hover:text-zinc-200 transition-colors">
                {cert.title}
              </h3>
              <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#121215] border border-white/10">
                  <Award className="w-3 h-3 text-white" />
                  PDF
                </span>
                <span className="hidden sm:inline">~270 KB</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-10 p-4 rounded-2xl bg-[#09090B]/50 border border-white/5 text-center">
        <p className="text-xs font-mono text-zinc-400 flex items-center justify-center gap-2 flex-wrap">
          <span>Total: {certificates.length} sertifikat</span>
          <span className="px-2 py-0.5 rounded bg-white/10">Gambar teroptimasi</span>
          <span className="px-2 py-0.5 rounded bg-white/10">PDF dapat diunduh</span>
        </p>
      </div>

      {/* Lightbox viewer */}
      <AnimatePresence>
        {isOpen && active && (
          <motion.div
            key="cert-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-4 mb-4 text-white">
                <h3 className="text-base sm:text-lg font-bold font-mono tracking-tight min-w-0 truncate">
                  {active.title}
                </h3>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPDF(active);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Unduh PDF"
                    title="Unduh PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPDF(active);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Buka PDF di tab baru"
                    title="Buka PDF di tab baru"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Tutup"
                    title="Tutup (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Image viewer */}
              <div className="relative flex-1 overflow-auto rounded-2xl bg-[#09090B] border border-white/10">
                <Image
                  key={active.id}
                  src={active.imageUrl}
                  alt={active.title}
                  width={1684}
                  height={1191}
                  className="w-full h-auto mx-auto block"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Sertifikat sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-zinc-400 font-mono text-sm tabular-nums">
                  {(selectedIndex as number) + 1} / {certificates.length}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Sertifikat selanjutnya"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Hint */}
              <p className="text-center text-zinc-500 text-xs mt-4 font-mono">
                Esc untuk menutup · ← → untuk ganti sertifikat
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
