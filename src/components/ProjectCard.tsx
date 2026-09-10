'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { ProjectItem } from '@/components/SelectedWork';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface ProjectCardProps {
  project: ProjectItem;
  onSelect: () => void;
  defaultImageUrl?: string;
}

export default function ProjectCard({ project, onSelect, defaultImageUrl }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [7, -7]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-7, 7]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const isEmbunLaundry = project.title?.toLowerCase().includes('laundry') || project.title?.toLowerCase().includes('embun') || project.index === '01';
  const isGymVault = project.title?.toLowerCase().includes('gym') || project.title?.toLowerCase().includes('vault');
  const isEquipRent = project.title?.toLowerCase().includes('surya') || project.title?.toLowerCase().includes('equiprent');

  const targetLiveUrl = isEmbunLaundry
    ? 'https://embun-laundry.dhanisepeda.workers.dev/dashboard'
    : isGymVault
    ? 'https://gymvault-app.vercel.app/'
    : isEquipRent
    ? 'https://equiprent-pt-surya-bangun-sarana.dhanisepeda.workers.dev/'
    : project.live_url || project.case_study_url || '#';

  const targetGithubUrl = isEmbunLaundry
    ? 'https://github.com/Dhani078/Embun-Laundry'
    : isGymVault
    ? 'https://github.com/Dhani078/GymVault'
    : isEquipRent
    ? 'https://github.com/Dhani078/equiprent-pt-surya-bangun-sarana'
    : project.github_url;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      whileHover={{ y: -6 }}
      className="group rounded-3xl bg-[#09090B]/95 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-white/40 transition-colors duration-300 shadow-2xl backdrop-blur-2xl relative"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-all" />

      {/* Image Preview */}
      <div 
        onClick={onSelect}
        className="relative aspect-[16/10] w-full bg-[#121215] overflow-hidden cursor-pointer"
      >
        <Image
          src={project.image_url || defaultImageUrl || '/equiprent-cover.jpg'}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-xl bg-[#000000]/80 backdrop-blur-md border border-white/20 text-xs font-mono text-white shadow-md preserve-dark">
            {project.index} · {project.year}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-7 flex flex-col justify-between flex-grow space-y-5">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(project.tags || []).map((tag, tIdx) => (
              <span
                key={tIdx}
                className="px-2.5 py-1 rounded-lg bg-[#121215] border border-white/10 text-[11px] font-mono text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-white group-hover:text-zinc-200 transition-colors font-display">
            {project.title}
          </h3>

          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mt-2 font-light">
            {project.summary}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={onSelect}
            className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer font-bold transition-colors"
          >
            <span>Spesifikasi</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            {targetGithubUrl && targetGithubUrl !== '#' && (
              <a
                href={targetGithubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-xl bg-[#121215] hover:bg-white hover:text-black border border-white/15 text-zinc-300 text-xs font-mono transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="GitHub Repository"
                aria-label={`GitHub Repository ${project.title}`}
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span className="font-bold">Code</span>
              </a>
            )}

            {targetLiveUrl && targetLiveUrl !== '#' && (
              <a
                href={targetLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-mono font-extrabold flex items-center gap-1.5 transition-all shadow-lg shadow-white/15 active:scale-95 cursor-pointer"
              >
                <span>Kunjungi</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
