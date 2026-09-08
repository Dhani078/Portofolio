'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Award, ChevronLeft, ChevronRight, Download, ExternalLink, X, ZoomIn } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  fileName: string;
  pdfUrl: string;
  imageUrl: string;
  webpUrl: string;
}

const certificates: Certificate[] = [
  {
    id: 'algo-1',
    title: 'Praktikum Algoritma dan Pemrograman 1',
    fileName: 'Praktikum Algoritma Dan Pemrograman 1.pdf',
    pdfUrl: '/sertifikat/Praktikum Algoritma Dan Pemrograman 1.pdf',
    imageUrl: '/certificates/praktikum-algoritma-dan-pemrograman-1.jpg',
    webpUrl: '/certificates/praktikum-algoritma-dan-pemrograman-1.webp',
  },
  {
    id: 'algo-2',
    title: 'Praktikum Algoritma dan Pemrograman 2',
    fileName: 'Praktikum Algoritma Dan Pemrograman 2.pdf',
    pdfUrl: '/sertifikat/Praktikum Algoritma Dan Pemrograman 2.pdf',
    imageUrl: '/certificates/praktikum-algoritma-dan-pemrograman-2.jpg',
    webpUrl: '/certificates/praktikum-algoritma-dan-pemrograman-2.webp',
  },
  {
    id: 'android',
    title: 'Praktikum Android',
    fileName: 'Praktikum Android.pdf',
    pdfUrl: '/sertifikat/Praktikum Android.pdf',
    imageUrl: '/certificates/praktikum-android.jpg',
    webpUrl: '/certificates/praktikum-android.webp',
  },
  {
    id: 'network-1',
    title: 'Praktikum Jaringan Komputer 1',
    fileName: 'Praktikum Jaringan Komputer 1.pdf',
    pdfUrl: '/sertifikat/Praktikum Jaringan Komputer 1.pdf',
    imageUrl: '/certificates/praktikum-jaringan-komputer-1.jpg',
    webpUrl: '/certificates/praktikum-jaringan-komputer-1.webp',
  },
  {
    id: 'network-2',
    title: 'Praktikum Jaringan Komputer 2',
    fileName: 'Praktikum Jaringan Komputer 2.pdf',
    pdfUrl: '/sertifikat/Praktikum Jaringan Komputer 2.pdf',
    imageUrl: '/certificates/praktikum-jaringan-komputer-2.jpg',
    webpUrl: '/certificates/praktikum-jaringan-komputer-2.webp',
  },
  {
    id: 'web-1',
    title: 'Praktikum Pemrograman Web 1',
    fileName: 'Praktikum Pemrograman Web 1.pdf',
    pdfUrl: '/sertifikat/Praktikum Pemrograman Web 1.pdf',
    imageUrl: '/certificates/praktikum-pemrograman-web-1.jpg',
    webpUrl: '/certificates/praktikum-pemrograman-web-1.webp',
  },
  {
    id: 'ppn',
    title: 'Praktikum Program Paket Niaga (PPN)',
    fileName: 'Praktikum Program Paket Niaga (ppn).pdf',
    pdfUrl: '/sertifikat/Praktikum Program Paket Niaga (ppn).pdf',
    imageUrl: '/certificates/praktikum-program-paket-niaga-(ppn).jpg',
    webpUrl: '/certificates/praktikum-program-paket-niaga-(ppn).webp',
  },
  {
    id: 'web-2',
    title: 'Praktikum Pemrograman Web 2',
    fileName: 'sertifikat pemrograman web 2.pdf',
    pdfUrl: '/sertifikat/sertifikat pemrograman web 2.pdf',
    imageUrl: '/certificates/sertifikat-pemrograman-web-2.jpg',
    webpUrl: '/certificates/sertifikat-pemrograman-web-2.webp',
  },
];

export default function Certificates() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = e.currentTarget.src.replace('.webp', '.jpg');
  };

  const openPDF = (cert: Certificate) => {
    window.open(cert.pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const downloadPDF = (cert: Certificate) => {
    const link = document.createElement('a');
    link.href = cert.pdfUrl;
    link.download = cert.fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (viewMode === 'carousel' && selectedIndex !== null) {
    const cert = certificates[selectedIndex];
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 text-white">
              <h3 className="text-lg font-bold font-mono tracking-tight">{cert.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); downloadPDF(cert); }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Download PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); openPDF(cert); }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Buka PDF di tab baru"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Viewer */}
            <div className="relative flex-1 overflow-auto">
              <picture>
                <source srcSet={cert.webpUrl} type="image/webp" />
                <Image
                  src={cert.imageUrl}
                  alt={cert.title}
                  width={1684}
                  height={1191}
                  className="max-w-full h-auto mx-auto block"
                  onError={handleImageError}
                  priority
                />
              </picture>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex - 1 + certificates.length) % certificates.length); }}
                disabled={certificates.length === 1}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Sertifikat sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-zinc-400 font-mono text-sm">
                {selectedIndex + 1} / {certificates.length}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex + 1) % certificates.length); }}
                disabled={certificates.length === 1}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Sertifikat selanjutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Hint */}
            <p className="text-center text-zinc-500 text-xs mt-4 font-mono">
              Klik di luar area atau tekan ESC untuk menutup
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <section className="py-24 border-t border-white/10 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 scroll-mt-24" id="certificates">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
      >
        <div>
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-white" />
            <span>SERTIFIKAT & PRAKTIKUM</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Bukti Kompetensi.
          </h2>
        </div>
        <p className="text-base text-zinc-400 max-w-lg font-light">
          Sertifikat praktikum mata kuliah Teknik Informatika UNISKA Banjarmasin. Klik untuk perbesar, download PDF asli.
        </p>
      </motion.div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {certificates.map((cert, idx) => (
          <motion.article
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="group relative bg-[#09090B]/95 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-colors cursor-pointer"
            onClick={() => setSelectedIndex(idx)}
          >
            {/* Thumbnail */}
            <div className="aspect-[4/3] relative overflow-hidden bg-[#121215]">
              <picture>
                <source srcSet={cert.webpUrl} type="image/webp" />
                <Image
                  src={cert.imageUrl}
                  alt={cert.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={handleImageError}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </picture>
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
        <p className="text-xs font-mono text-zinc-400 flex items-center justify-center gap-2">
          <span>Total: {certificates.length} sertifikat</span>
          <span className="px-2 py-0.5 rounded bg-white/10">WebP optimized</span>
          <span className="px-2 py-0.5 rounded bg-white/10">PDF downloadable</span>
        </p>
      </div>
    </section>
  );
}