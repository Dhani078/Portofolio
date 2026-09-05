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

const defaultProjects: ProjectItem[] = [
  {
    index: '01',
    title: 'Laundry Online System',
    category: 'FULL-STACK',
    year: 2025,
    tags: ['Next.js 16', 'Supabase', 'Tailwind CSS', 'Midtrans'],
    summary: 'Aplikasi pemesanan layanan laundry terintegrasi dengan penjemputan cucian, pelacakan status pengerjaan secara real-time, dan sistem pembayaran online otomatis.',
    metrics: { perf: 98, a11y: 100, build: '100%' },
    case_study_url: '#',
    image_url: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=1000&auto=format&fit=crop',
    live_url: 'https://laundry-demo.example.com',
    github_url: 'https://github.com',
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
    github_url: 'https://github.com',
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

  const targetLiveUrl = project.live_url || project.case_study_url || (project.title?.toLowerCase().includes('gym') || project.title?.toLowerCase().includes('vault') ? 'https://gymvault-app.vercel.app/' : '#');

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
            {project.index} // {project.year}
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
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onSelect}
            className="text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer font-bold transition-colors"
          >
            <span>Spesifikasi Teknis</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {targetLiveUrl && targetLiveUrl !== '#' && (
            <a
              href={targetLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-mono font-extrabold flex items-center gap-1 transition-all shadow-lg shadow-white/15 active:scale-95"
            >
              <span>Kunjungi</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
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
    async function fetchGithubRepos() {
      try {
        const res = await fetch('/api/github');
        const data = await res.json();
        
        if (data.repos) {
          const mapped = data.repos.map((repo: any, index: number) => ({
            index: `GH-0${index + 1}`,
            title: repo.name,
            category: 'GITHUB OSS',
            year: new Date(repo.updated_at).getFullYear(),
            tags: repo.language ? [repo.language, 'Open Source'] : ['Open Source'],
            summary: repo.description || 'No description provided.',
            metrics: { perf: 100, a11y: 100, build: 'Pass' },
            case_study_url: repo.html_url,
            live_url: repo.html_url,
            image_url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1000&auto=format&fit=crop',
          }));
          setGithubProjects(mapped);
        }
      } catch (err) {
        console.error('Failed to load GitHub repos:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGithubRepos();
  }, []);

  // Combine DB/Default projects with live GitHub repos
  const allProjects = [...defaultProjects, ...githubProjects];

  const normalizedProjects = allProjects.map((p, i) => {
    let img = p.image_url;
    if (!img || img.includes('photo-1517677208171')) {
      if (i === 0) img = 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=1000&auto=format&fit=crop';
      else if (i === 1) img = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop';
      else if (i === 2) img = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop';
    }
    const cat = p.category || (i === 1 ? 'SISTEM WEB' : 'FULL-STACK');
    
    let title = p.title || (i === 0 ? 'Laundry Online System' : i === 1 ? 'Surya Heavy Rental Hub' : 'GymVault — Fitness & Gym Companion');
    let liveUrl = p.live_url;
    let summary = p.summary;
    let tags = p.tags && p.tags.length > 0 ? p.tags : (i === 0 ? ['Next.js 16', 'Supabase', 'Tailwind CSS', 'Midtrans'] : i === 1 ? ['React 19', 'TypeScript', 'Dashboard', 'PostgreSQL'] : ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Vercel']);

    return { 
      ...p, 
      index: p.index || (i < defaultProjects.length ? `0${i + 1}` : `GH-${i}`),
      year: p.year || (i === 2 ? 2026 : 2025),
      title,
      summary: summary || defaultProjects[i]?.summary || 'Aplikasi web modern skala produksi.',
      image_url: img, 
      category: cat,
      tags,
      live_url: liveUrl || (i === 2 ? 'https://gymvault-app.vercel.app/' : p.case_study_url && p.case_study_url !== '#' ? p.case_study_url : undefined),
      case_study_url: liveUrl || 'https://gymvault-app.vercel.app/'
    };
  });

  const filteredProjects = activeCategory === 'ALL'
    ? normalizedProjects
    : normalizedProjects.filter((p) => (p.category || '').toUpperCase().includes(activeCategory.toUpperCase()));

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl bg-[#09090B] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-[#121215] border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-xs font-mono text-zinc-400 mb-2 font-bold">
                PROYEK {selectedProject.index} // {selectedProject.year}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 font-display">
                {selectedProject.title}
              </h3>

              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 border border-white/10 bg-[#121215]">
                <Image
                  src={selectedProject.image_url || defaultProjects[0].image_url!}
                  alt={selectedProject.title}
                  fill
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

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
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

              <div className="flex gap-3.5 pt-2">
                {selectedProject.live_url || selectedProject.case_study_url ? (
                  <a
                    href={selectedProject.live_url || selectedProject.case_study_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-5 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-center text-sm font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-white/20 active:scale-95"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Kunjungi Live App</span>
                  </a>
                ) : null}

                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-3 rounded-xl bg-[#121215] hover:bg-white/10 border border-white/10 text-white text-sm font-mono transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
