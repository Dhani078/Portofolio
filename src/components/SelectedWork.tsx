'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, ArrowUpRight, X, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';

export interface ProjectMetrics {
  perf: number;
  a11y: number;
  build: string;
}

export interface ProjectItem {
  id?: string;
  index: string;
  title: string;
  category?: string;
  year: number;
  tags: string[];
  summary?: string;
  metrics: ProjectMetrics;
  case_study_url: string;
  image_url?: string;
  live_url?: string;
  github_url?: string;
  sort_order?: number;
}

interface SelectedWorkProps {
  projects?: ProjectItem[];
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const defaultProjects: ProjectItem[] = [
  {
    index: '01',
    title: 'Embun-Laundry',
    category: 'FULL-STACK',
    year: 2026,
    tags: ['Cloudflare Workers', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    summary: 'Aplikasi pengelolaan operasional layanan laundry modern terintegrasi dengan dashboard kasir, tracking status cucian real-time, dan manajemen transaksi online otomatis.',
    metrics: { perf: 99, a11y: 100, build: '100%' },
    case_study_url: 'https://embun-laundry.dhanisepeda.workers.dev/dashboard',
    image_url: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=1000&auto=format&fit=crop',
    live_url: 'https://embun-laundry.dhanisepeda.workers.dev/dashboard',
    github_url: 'https://github.com/Dhani078/Embun-Laundry',
  },
  {
    index: '02',
    title: 'EquipRent MS — PT. Surya Bangun Sarana',
    category: 'SISTEM WEB',
    year: 2026,
    tags: ['React 18', 'TypeScript', 'Cloudflare Workers', 'TiDB Cloud Serverless', 'Tailwind CSS'],
    summary: 'Sistem Informasi Monitoring dan Penyewaan Alat Berat terintegrasi (Excavator, Bulldozer, Crane) dengan pelacakan GPS telemetri, jam operasional (Hour Meter), alur tanda tangan digital (E-Sign), dan verifikasi pembayaran multi-role.',
    metrics: { perf: 98, a11y: 100, build: '100%' },
    case_study_url: 'https://equiprent-pt-surya-bangun-sarana.dhanisepeda.workers.dev/',
    image_url: '/equiprent-cover.jpg',
    live_url: 'https://equiprent-pt-surya-bangun-sarana.dhanisepeda.workers.dev/',
    github_url: 'https://github.com/Dhani078/equiprent-pt-surya-bangun-sarana',
  },
  {
    index: '03',
    title: 'GymVault — Fitness & Gym Companion',
    category: 'FULL-STACK',
    year: 2026,
    tags: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    summary: 'Aplikasi pendamping latihan kebugaran dan pelacak program gym modern dengan visualisasi progres real-time, pencatatan beban/reps kinetik, dan deployment performa tinggi di Vercel Edge.',
    metrics: { perf: 99, a11y: 100, build: '100%' },
    case_study_url: 'https://gymvault-app.vercel.app/',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
    live_url: 'https://gymvault-app.vercel.app/',
    github_url: 'https://github.com/Dhani078/GymVault',
  },
];

const categories = [
  { id: 'ALL', label: 'ALL PROJECTS' },
  { id: 'FULL-STACK', label: 'FULL-STACK WEB' },
  { id: 'SISTEM WEB', label: 'DASHBOARDS' },
  { id: 'GITHUB OSS', label: 'OPEN SOURCE' },
];

function TiltCard({ project, onSelect }: { project: ProjectItem; onSelect: () => void }) {
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
          src={project.image_url || defaultProjects[0].image_url!}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-xl bg-[#000000]/80 backdrop-blur-md border border-white/20 text-xs font-mono text-white shadow-md">
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

export default function SelectedWork({ projects }: SelectedWorkProps) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [githubProjects, setGithubProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Abortable fetch: without this, navigating away mid-request triggers a
    // "setState on unmounted component" warning and a wasted request.
    const controller = new AbortController();

    async function fetchGithubRepos() {
      try {
        const res = await fetch('/api/github', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        if (data.repos) {
          // Exclude repos that are already primary featured projects or internal config
          const excludedRepos = ['embun-laundry', 'gymvault', 'equiprent-pt-surya-bangun-sarana', 'portofolio', 'dhani078'];
          const standaloneRepos = data.repos.filter((repo: any) => {
            const nameLower = (repo.name || '').toLowerCase();
            return !excludedRepos.some((ex) => nameLower === ex || nameLower.includes(ex));
          });

          const mapped = standaloneRepos.map((repo: any, index: number) => ({
            index: `GH-0${index + 1}`,
            title: repo.name,
            category: 'GITHUB OSS',
            year: new Date(repo.updated_at).getFullYear(),
            tags: repo.language ? [repo.language, 'Open Source'] : ['Open Source'],
            summary: repo.description || 'Repositori open-source publik di GitHub.',
            metrics: { perf: 100, a11y: 100, build: 'Pass' },
            case_study_url: repo.html_url,
            live_url: repo.html_url,
            github_url: repo.html_url,
            image_url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1000&auto=format&fit=crop',
          }));
          setGithubProjects(mapped);
        }
      } catch (err: any) {
        // An aborted request is intentional (component unmounted) - stay quiet.
        if (err?.name === 'AbortError') return;
        console.error('Failed to load GitHub repos:', err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    
    fetchGithubRepos();

    return () => controller.abort();
  }, []);

  // Combine DB/Default projects with live GitHub repos (preventing duplicates)
  const baseProjects = (projects && projects.length > 0) ? projects : defaultProjects;
  const uniqueGithubProjects = githubProjects.filter((gh) => 
    !baseProjects.some((bp) => (bp.title || '').toLowerCase().replace(/[-_.\s]/g, '').includes((gh.title || '').toLowerCase().replace(/[-_.\s]/g, '')) ||
    (gh.title || '').toLowerCase().replace(/[-_.\s]/g, '').includes((bp.title || '').toLowerCase().replace(/[-_.\s]/g, ''))
  ));
  const allProjects = [...baseProjects, ...uniqueGithubProjects];

  const normalizedProjects = allProjects.map((p, i) => {
    let img = p.image_url;

    // Cocokkan proyek dengan default berdasarkan JUDUL, bukan posisi array.
    // Tabel `projects` tidak punya kolom image_url, jadi p.image_url selalu
    // undefined. Logika lama memakai indeks (i === 0/1/2) sehingga cover
    // salah pasang: EquipRent justru dapat foto Unsplash generik, sementara
    // /equiprent-cover.jpg (foto excavator asli) tidak pernah tampil.
    const norm = (s?: string) => (s || '').toLowerCase().replace(/[-_.\s]/g, '');
    const matchByTitle = defaultProjects.find((d) => {
      const a = norm(d.title);
      const b = norm(p.title);
      return a && b && (a.includes(b) || b.includes(a));
    });

    // Prioritas: image_url dari DB > cover milik proyek yang cocok > fallback.
    if (!img || img.includes('photo-1517677208171')) {
      img = matchByTitle?.image_url;
    }
    if (!img) {
      if (i === 0) img = 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=1000&auto=format&fit=crop';
      else if (i === 1) img = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop';
      else if (i === 2) img = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop';
    }
    const cat = p.category || (i === 1 ? 'SISTEM WEB' : 'FULL-STACK');
    
    // Judul juga diambil dari proyek yang cocok, bukan dari posisi.
    let rawTitle = p.title || matchByTitle?.title || (i === 0 ? 'Embun-Laundry' : i === 1 ? 'EquipRent MS — PT. Surya Bangun Sarana' : 'GymVault — Fitness & Gym Companion');
    let title = rawTitle;

    const isLaundry = rawTitle.toLowerCase().includes('embun') || rawTitle.toLowerCase().includes('laundry') || i === 0;
    const isGym = rawTitle.toLowerCase().includes('gym') || rawTitle.toLowerCase().includes('vault') || i === 2;
    const isEquip = rawTitle.toLowerCase().includes('surya') || rawTitle.toLowerCase().includes('equiprent') || i === 1;

    let liveUrl = p.live_url;
    let githubUrl = p.github_url;
    let summary = p.summary;
    let tags = p.tags && p.tags.length > 0 ? p.tags : [];

    if (isLaundry) {
      title = 'Embun-Laundry';
      liveUrl = 'https://embun-laundry.dhanisepeda.workers.dev/dashboard';
      githubUrl = 'https://github.com/Dhani078/Embun-Laundry';
      summary = 'Aplikasi pengelolaan operasional layanan laundry modern terintegrasi dengan dashboard kasir, tracking status cucian real-time, dan manajemen transaksi online otomatis.';
      tags = tags.length > 0 ? tags : ['Cloudflare Workers', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'];
    } else if (isGym) {
      title = 'GymVault — Fitness & Gym Companion';
      liveUrl = 'https://gymvault-app.vercel.app/';
      githubUrl = 'https://github.com/Dhani078/GymVault';
      summary = summary || 'Aplikasi pendamping latihan kebugaran dan pelacak program gym modern dengan visualisasi progres real-time, pencatatan beban/reps kinetik, dan deployment performa tinggi di Vercel Edge.';
      tags = tags.length > 0 ? tags : ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Vercel'];
    } else if (isEquip) {
      title = 'EquipRent MS — PT. Surya Bangun Sarana';
      liveUrl = 'https://equiprent-pt-surya-bangun-sarana.dhanisepeda.workers.dev/';
      githubUrl = 'https://github.com/Dhani078/equiprent-pt-surya-bangun-sarana';
      tags = tags.length > 0 ? tags : ['React 18', 'TypeScript', 'Cloudflare Workers', 'TiDB Cloud Serverless'];
    }

    return { 
      ...p, 
      index: p.index || (i < defaultProjects.length ? `0${i + 1}` : `GH-${i}`),
      year: p.year || 2026,
      title,
      summary: summary || defaultProjects[i]?.summary || 'Aplikasi web modern skala produksi.',
      image_url: img, 
      category: cat,
      tags,
      live_url: liveUrl,
      case_study_url: liveUrl || '#',
      github_url: githubUrl
    };
  });

  const filteredProjects = activeCategory === 'ALL'
    ? normalizedProjects
    : normalizedProjects.filter((p) => {
        const cat = (p.category || '').toUpperCase();
        if (activeCategory === 'GITHUB OSS') {
          return cat.includes('GITHUB OSS') || Boolean(p.github_url && p.github_url.includes('github.com/Dhani078'));
        }
        return cat.includes(activeCategory.toUpperCase());
      });

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Modal UX: close on Escape and lock background scroll, matching the
  // Certificates viewer so behaviour is consistent across the site.
  useEffect(() => {
    if (!selectedProject) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedProject]);

  return (
    <section className="py-24 border-t border-white/10 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 scroll-mt-24" id="work">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
      >
        <div>
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>PORTOFOLIO REKAYASA PRODUK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Selected Work.
          </h2>
        </div>
        <p className="text-base text-zinc-400 max-w-lg font-light">
          Aplikasi berskala produksi yang dirancang untuk performa tinggi, kestabilan data, dan pengalaman pengguna yang mulus.
        </p>
      </motion.div>

      {/* Category Filter Pills with Liquid White Slider */}
      <div className="flex flex-wrap gap-2 mb-10 p-1.5 rounded-2xl bg-[#09090B] w-fit border border-white/10">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                isActive ? 'text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeProjectCategory"
                  className="absolute inset-0 bg-white rounded-xl shadow-md shadow-white/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Projects Grid: 3D Gyroscope Tilt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, idx) => (
          <TiltCard
            key={project.id || project.index || `proj-${idx}`}
            project={project}
            onSelect={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl"
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
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
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-[#121215] border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-xs font-mono text-zinc-400 mb-2 font-bold">
                Proyek {selectedProject.index} · {selectedProject.year}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 font-display">
                {selectedProject.title}
              </h3>

              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 border border-white/10 bg-[#121215]">
                <Image
                  src={selectedProject.image_url || defaultProjects[0].image_url!}
                  alt={selectedProject.title}
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
                  {selectedProject.summary}
                </p>
              </div>

              {/* Metrics Grid — stack on phones so labels like "A11y (WCAG)"
                  and "100% Strict" never get squeezed/overflow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 text-center">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Lighthouse</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    {selectedProject.metrics?.perf || 98}/100
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 text-center">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">A11y (WCAG)</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    {selectedProject.metrics?.a11y || 100}/100
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
                  {(selectedProject.tags || []).map((tag, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-xl bg-[#121215] border border-white/10 text-xs font-mono text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {(() => {
                const isSelLaundry = selectedProject.title?.toLowerCase().includes('laundry') || selectedProject.title?.toLowerCase().includes('embun') || selectedProject.index === '01';
                const isSelGym = selectedProject.title?.toLowerCase().includes('gym') || selectedProject.title?.toLowerCase().includes('vault');
                const isSelEquip = selectedProject.title?.toLowerCase().includes('surya') || selectedProject.title?.toLowerCase().includes('equiprent');

                const liveLink = isSelLaundry
                  ? 'https://embun-laundry.dhanisepeda.workers.dev/dashboard'
                  : isSelGym
                  ? 'https://gymvault-app.vercel.app/'
                  : isSelEquip
                  ? 'https://equiprent-pt-surya-bangun-sarana.dhanisepeda.workers.dev/'
                  : selectedProject.live_url || selectedProject.case_study_url;

                const ghLink = isSelLaundry
                  ? 'https://github.com/Dhani078/Embun-Laundry'
                  : isSelGym
                  ? 'https://github.com/Dhani078/GymVault'
                  : isSelEquip
                  ? 'https://github.com/Dhani078/equiprent-pt-surya-bangun-sarana'
                  : selectedProject.github_url;

                return (
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
                      onClick={() => setSelectedProject(null)}
                      className="px-6 py-3 rounded-xl bg-[#121215] hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-sm font-mono transition-colors cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
