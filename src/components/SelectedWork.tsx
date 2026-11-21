'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';

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

export const defaultProjects: ProjectItem[] = [
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
  {
    index: '04',
    title: 'KasDesk — Personal Finance & Wealth Tracker',
    category: 'MOBILE & PWA',
    year: 2026,
    tags: ['Next.js 16', 'React 19', 'Drizzle ORM', 'TiDB Cloud', 'PWA', 'Auth.js'],
    summary: 'PWA manajemen keuangan pribadi modern berkecepatan tinggi dengan kesiapan offline-first, Drizzle ORM + TiDB Serverless, pemindaian OCR struk otomatis, QuickLog 2-tap, kalkulator ekspresi di kolom nominal, dan proteksi biometrik/PIN.',
    metrics: { perf: 99, a11y: 100, build: '100%' },
    case_study_url: 'https://kas-desk.vercel.app/',
    image_url: '/kasdesk-cover.jpg',
    live_url: 'https://kas-desk.vercel.app/',
    github_url: 'https://github.com/Dhani078/KasDesk',
  },
  {
    index: '05',
    title: 'SIPASD — E-Arsip Dispora Kalsel',
    category: 'SISTEM WEB',
    year: 2026,
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS v4', 'PostgreSQL', 'E-Arsip', 'UNISKA'],
    summary: 'Sistem Informasi Pengelolaan Arsip Persuratan dan Disposisi resmi Dinas Kepemudaan dan Olahraga Provinsi Kalsel dengan 5 format laporan kearsipan resmi, disposisi hierarkis, pelacakan naskah surat, dan audit trail aktivitas.',
    metrics: { perf: 99, a11y: 100, build: '100%' },
    case_study_url: 'https://sipasd.my.id/',
    image_url: 'https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1000&auto=format&fit=crop',
    live_url: 'https://sipasd.my.id/',
    github_url: 'https://github.com/Dhani078/SIPASD',
  },
  {
    index: '06',
    title: 'KiosAI — Toko AI & Multi-Model Platform',
    category: 'FULL-STACK',
    year: 2026,
    tags: ['Next.js 15', 'React 19', 'TiDB Cloud Serverless', 'DOKU QRIS', '9Router'],
    summary: 'Platform e-commerce token AI dan agregator model cerdas dengan integrasi gateway pembayaran DOKU QRIS real-time (sinkronisasi saldo CAS HMAC), manajemen sesi HttpOnly defensif, dan routing inferensi AI terpadu.',
    metrics: { perf: 98, a11y: 100, build: '100%' },
    case_study_url: 'https://tokoai.my.id/',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    live_url: 'https://tokoai.my.id/',
    github_url: 'https://github.com/Dhani078/KiosAI',
  },
  {
    index: '07',
    title: 'WarTicket — Flash-Sale Booking Engine',
    category: 'BACKEND',
    year: 2026,
    tags: ['FastAPI', 'Python Async', 'Redis v8 Lua EVALSHA', 'Neon PgBouncer', 'React 18'],
    summary: 'Engine pemesanan tiket flash-sale berkecepatan tinggi dengan garansi zero overselling via atomik Redis Lua EVALSHA, rollback transaksi terdistribusi Saga, dan connection pool PgBouncer.',
    metrics: { perf: 100, a11y: 100, build: 'Pass' },
    case_study_url: 'https://github.com/Dhani078/WarTicket',
    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop',
    live_url: 'https://github.com/Dhani078/WarTicket',
    github_url: 'https://github.com/Dhani078/WarTicket',
  },
];

export const categories = [
  { id: 'ALL', label: 'ALL PROJECTS' },
  { id: 'FULL-STACK', label: 'FULL-STACK WEB' },
  { id: 'SISTEM WEB', label: 'ENTERPRISE & GOV' },
  { id: 'MOBILE', label: 'MOBILE & PWA' },
  { id: 'BACKEND', label: 'BACKEND & ENGINE' },
  { id: 'GITHUB OSS', label: 'OPEN SOURCE' },
];

interface GithubRepoItem {
  name: string;
  html_url: string;
  description?: string;
  language?: string;
  updated_at: string;
}

export default function SelectedWork({ projects }: SelectedWorkProps) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [githubProjects, setGithubProjects] = useState<ProjectItem[]>([]);

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
          const excludedRepos = [
            'embun-laundry',
            'gymvault',
            'equiprent-pt-surya-bangun-sarana',
            'kasdesk',
            'kas-desk',
            'portofolio',
            'dhani078',
            'sipasd',
            'kiosai',
            'warticket',
            'autoclip'
          ];
          const standaloneRepos = data.repos.filter((repo: GithubRepoItem) => {
            const nameLower = (repo.name || '').toLowerCase();
            return !excludedRepos.some((ex) => nameLower === ex || nameLower.includes(ex));
          });

          const mapped = standaloneRepos.map((repo: GithubRepoItem, index: number) => ({
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
      } catch (err: unknown) {
        // An aborted request is intentional (component unmounted) - stay quiet.
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('Failed to load GitHub repos:', err);
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
    const norm = (s?: string) => (s || '').toLowerCase().replace(/[-_.\s]/g, '');
    const matchByTitle = defaultProjects.find((d) => {
      const a = norm(d.title);
      const b = norm(p.title);
      return a && b && (a.includes(b) || b.includes(a));
    });

    const title = p.title || matchByTitle?.title || defaultProjects[i]?.title || `Project ${i + 1}`;
    const img = p.image_url || matchByTitle?.image_url || defaultProjects[i]?.image_url || '/equiprent-cover.jpg';
    const cat = p.category || matchByTitle?.category || defaultProjects[i]?.category || 'FULL-STACK';
    const liveUrl = p.live_url || matchByTitle?.live_url || defaultProjects[i]?.live_url;
    const githubUrl = p.github_url || matchByTitle?.github_url || defaultProjects[i]?.github_url;
    const summary = p.summary || matchByTitle?.summary || defaultProjects[i]?.summary || 'Aplikasi web modern skala produksi.';
    const tags = p.tags && p.tags.length > 0 ? p.tags : (matchByTitle?.tags || defaultProjects[i]?.tags || ['Full-Stack']);

    return { 
      ...p, 
      index: p.index || (i < defaultProjects.length ? `0${i + 1}` : `GH-${i}`),
      year: p.year || matchByTitle?.year || 2026,
      title,
      summary,
      image_url: img, 
      category: cat,
      tags,
      live_url: liveUrl,
      case_study_url: p.case_study_url || liveUrl || '#',
      github_url: githubUrl
    };
  });

  const filteredProjects = activeCategory === 'ALL'
    ? normalizedProjects
    : normalizedProjects.filter((p) => {
        const cat = (p.category || '').toUpperCase();
        const tags = (p.tags || []).map((t) => t.toUpperCase());
        const title = (p.title || '').toUpperCase();
        const summary = (p.summary || '').toUpperCase();

        if (activeCategory === 'GITHUB OSS') {
          return cat.includes('GITHUB OSS') || Boolean(p.github_url && p.github_url.includes('github.com/Dhani078'));
        }

        if (activeCategory === 'MOBILE') {
          return (
            cat.includes('MOBILE') ||
            cat.includes('PWA') ||
            tags.some((t) => t.includes('MOBILE') || t.includes('PWA') || t.includes('REACT NATIVE') || t.includes('EXPO')) ||
            title.includes('KASDESK') ||
            title.includes('GYM') ||
            summary.includes('PWA') ||
            summary.includes('MOBILE')
          );
        }

        if (activeCategory === 'SISTEM WEB') {
          return cat.includes('SISTEM') || cat.includes('ENTERPRISE') || cat.includes('GOV') || title.includes('SIPASD') || title.includes('EQUIPRENT');
        }

        if (activeCategory === 'BACKEND') {
          return cat.includes('BACKEND') || tags.some((t) => t.includes('FASTAPI') || t.includes('REDIS') || t.includes('LUA')) || title.includes('WARTICKET');
        }

        if (activeCategory === 'FULL-STACK') {
          return cat.includes('FULL-STACK') || title.includes('KIOSAI') || title.includes('KASDESK') || title.includes('GYM') || title.includes('LAUNDRY');
        }

        return cat.includes(activeCategory.toUpperCase());
      });

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
          <ProjectCard
            key={project.id || project.index || `proj-${idx}`}
            project={project}
            onSelect={() => setSelectedProject(project)}
            defaultImageUrl={defaultProjects[0].image_url}
          />
        ))}
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        defaultImageUrl={defaultProjects[0].image_url}
      />
    </section>
  );
}
