'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { ProjectItem } from '@/components/SelectedWork';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  defaultImageUrl?: string;
}

export default function ProjectModal({ project, onClose, defaultImageUrl }: ProjectModalProps) {
  // Modal UX: close on Escape and lock background scroll
  useEffect(() => {
    if (!project) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  const isSelLaundry = project?.title?.toLowerCase().includes('laundry') || project?.title?.toLowerCase().includes('embun') || project?.index === '01';
  const isSelGym = project?.title?.toLowerCase().includes('gym') || project?.title?.toLowerCase().includes('vault');
  const isSelEquip = project?.title?.toLowerCase().includes('surya') || project?.title?.toLowerCase().includes('equiprent');

  const liveLink = isSelLaundry
    ? 'https://embun-laundry.dhanisepeda.workers.dev/dashboard'
    : isSelGym
    ? 'https://gymvault-app.vercel.app/'
    : isSelEquip
    ? 'https://equiprent-pt-surya-bangun-sarana.dhanisepeda.workers.dev/'
    : project?.live_url || project?.case_study_url;

  const ghLink = isSelLaundry
    ? 'https://github.com/Dhani078/Embun-Laundry'
    : isSelGym
    ? 'https://github.com/Dhani078/GymVault'
    : isSelEquip
    ? 'https://github.com/Dhani078/equiprent-pt-surya-bangun-sarana'
    : project?.github_url;

  return (
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#09090B] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-[#121215] border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-xs font-mono text-zinc-400 mb-2 font-bold">
            Proyek {project.index} · {project.year}
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 font-display">
            {project.title}
          </h3>

          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 border border-white/10 bg-[#121215]">
            <Image
              src={project.image_url || defaultImageUrl || '/equiprent-cover.jpg'}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover"
            />
          </div>

          <div className="space-y-4 mb-6">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              Ringkasan Arsitektur
            </h4>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              {project.summary}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 text-center">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Lighthouse</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {project.metrics?.perf || 98}/100
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 text-center">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">A11y (WCAG)</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {project.metrics?.a11y || 100}/100
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 text-center">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Type Safety</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                100% Strict
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2.5">
              Teknologi Terpakai
            </h4>
            <div className="flex flex-wrap gap-2">
              {(project.tags || []).map((tag, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl bg-[#121215] border border-white/10 text-xs font-mono text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 pt-2">
            {liveLink && liveLink !== '#' ? (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-5 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-center text-sm font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-white/20 active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Kunjungi Live App</span>
              </a>
            ) : null}

            {ghLink && ghLink !== '#' ? (
              <a
                href={ghLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#121215] hover:bg-white/15 border border-white/20 text-white text-center text-sm font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Repo</span>
              </a>
            ) : null}

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-[#121215] hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-sm font-mono transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
  );
}
