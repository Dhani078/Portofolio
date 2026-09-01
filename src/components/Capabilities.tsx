'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Database, 
  Layers, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  Server,
  Zap
} from 'lucide-react';

export interface SkillNode {
  id?: string;
  category?: string;
  name: string;
  level?: string;
  depth?: string;
  icon?: string;
  sort_order?: number;
}

interface CapabilitiesProps {
  skillNodes?: SkillNode[];
}

const defaultSkills: SkillNode[] = [
  // FRONTEND & MOBILE
  { category: 'Frontend & Mobile', name: 'Next.js 16 & React 19', level: 'Expert', depth: 'Server Components (RSC), Streaming SSR, Server Actions, Turbopack Engine' },
  { category: 'Frontend & Mobile', name: 'TypeScript (Strict)', level: 'Expert', depth: 'Strict Typing, Generics, Discriminated Unions, Type Narrowing & Inference' },
  { category: 'Frontend & Mobile', name: 'React Native & Expo v54', level: 'Expert', depth: 'Cross-Platform Native Apps, Hardware-Accelerated Skia, FlashList Performance' },
  { category: 'Frontend & Mobile', name: 'Tailwind CSS & Design Systems', level: 'Expert', depth: 'Token-Based Design Architecture, Monochromatic Systems, Fluid Layouts' },
  { category: 'Frontend & Mobile', name: 'Framer Motion Physics', level: 'Advanced', depth: '120fps GPU Transitions, Spring Dynamics, Layout Projection, Gesture Handling' },

  // BACKEND & DATABASE
  { category: 'Backend & DB', name: 'Supabase & PostgreSQL', level: 'Expert', depth: 'Row-Level Security (RLS), Relational Data Modeling, Foreign Key Cascades, Realtime Channels' },
  { category: 'Backend & DB', name: 'FastAPI & Python Async', level: 'Advanced', depth: 'Asynchronous REST APIs (asyncio), SQLAlchemy ORM, Pydantic Schema Validation' },
  { category: 'Backend & DB', name: 'MySQL & Enterprise Schemas', level: 'Advanced', depth: 'Schema Normalization (3NF), ACID Transactions, Indexing & Query Optimization' },
  { category: 'Backend & DB', name: 'Node.js REST & Edge Handlers', level: 'Advanced', depth: 'Edge Route Handlers, Zod Runtime Validation, Webhook Ingestion Pipelines' },

  // AI & MEDIA PIPELINE
  { category: 'AI & Media', name: 'Multimodal AI Integration', level: 'Expert', depth: 'Structured JSON Outputs, Multimodal Vision Prompting, Google Gemini API' },
  { category: 'AI & Media', name: 'Computer Vision & Audio', level: 'Advanced', depth: 'OpenCV Video Manipulation, Faster-Whisper Automated Transcription, Frame Extraction' },
  { category: 'AI & Media', name: 'Media Automation Pipeline', level: 'Advanced', depth: 'Headless Video Clipping, Audio Spectrum Analysis, Dynamic Subtitle Synthesis' },

  // DEVOPS & SYSTEMS
  { category: 'DevOps & Systems', name: 'Git & GitHub Engineering', level: 'Expert', depth: 'Trunk-Based Development, Multi-Stage CI/CD Workflows, Semantic Versioning' },
  { category: 'DevOps & Systems', name: 'PWA & Offline Architecture', level: 'Expert', depth: 'Service Worker Lifecycle, Cache Storage API, Optimistic State Synchronization' },
  { category: 'DevOps & Systems', name: 'Payment & API Security', level: 'Advanced', depth: 'Midtrans Snap / QRIS Webhooks, Signature Verification, Token Authentication' },
];

const categoryTabs = [
  { id: 'ALL', label: 'SEMUA KEAHLIAN' },
  { id: 'Frontend & Mobile', label: 'FRONTEND & MOBILE' },
  { id: 'Backend & DB', label: 'BACKEND & DATABASE' },
  { id: 'AI & Media', label: 'AI & MEDIA PIPELINE' },
  { id: 'DevOps & Systems', label: 'DEVOPS & SISTEM' },
];

export default function Capabilities({ skillNodes }: CapabilitiesProps) {
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Verify if incoming database skillNodes are valid and populated
  const isPopulated = skillNodes && skillNodes.length > 0 && skillNodes.some(s => s.name && s.name !== 'Skill' && s.category);
  const allSkills = isPopulated ? skillNodes! : defaultSkills;

  // Defensive filtering with null-safety and robust category matching
  const filteredSkills = activeCategory === 'ALL'
    ? allSkills
    : allSkills.filter((s) => {
        const cat = (s?.category || '').toLowerCase();
        const target = activeCategory.toLowerCase();
        if (target.includes('front')) return cat.includes('front');
        if (target.includes('back') || target.includes('db')) return cat.includes('back') || cat.includes('db') || cat.includes('data');
        if (target.includes('tool') || target.includes('devops')) return cat.includes('tool') || cat.includes('dev');
        return cat.includes(target);
      });

  return (
    <section className="py-24 border-t border-white/10 max-w-[1400px] mx-auto w-full px-4 sm:px-8 lg:px-12 scroll-mt-24" id="skills">
      {/* Header */}
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
            <span>ARSITEKTUR & KOMPETENSI TEKNIS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Matriks Keahlian.
          </h2>
        </div>
        <p className="text-base text-zinc-400 max-w-lg font-light">
          Standar rekayasa perangkat lunak modern dengan penguasaan mendalam pada ekosistem JavaScript/TypeScript dan PostgreSQL.
        </p>
      </motion.div>

      {/* Category Tabs with Liquid White Slider */}
      <div className="flex flex-wrap gap-2 mb-10 p-1.5 rounded-2xl bg-[#09090B] w-fit border border-white/10">
        {categoryTabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`relative px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                isActive ? 'text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSkillTab"
                  className="absolute inset-0 bg-white rounded-xl shadow-md shadow-white/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="p-7 rounded-3xl bg-[#09090B]/95 border border-white/10 flex flex-col justify-between hover:border-white/40 transition-colors shadow-2xl backdrop-blur-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                {skill?.category || 'General'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-mono text-white font-bold">
                {skill?.level || 'Expert'}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-display">
                {skill?.name || 'Skill'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-light">
                {skill?.depth || 'Advanced Production Experience'}
              </p>
            </div>

            {/* Proficiency Indicator Bar in White */}
            <div className="pt-2">
              <div className="w-full bg-[#121215] rounded-full h-1.5 overflow-hidden border border-white/5">
                <div 
                  className="bg-white h-full rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                  style={{ width: skill?.level === 'Expert' ? '95%' : '85%' }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
