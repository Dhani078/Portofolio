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
  // FRONTEND
  { category: 'Frontend', name: 'Next.js 16 (App Router)', level: 'Expert', depth: 'Server Actions, RSC, Turbopack, Streaming SSR' },
  { category: 'Frontend', name: 'React 19', level: 'Expert', depth: 'Server Components, useActionState, Transitions' },
  { category: 'Frontend', name: 'TypeScript (Strict)', level: 'Expert', depth: 'Strict Mode, Generics, Discriminated Unions' },
  { category: 'Frontend', name: 'Tailwind CSS', level: 'Expert', depth: 'Design Systems, Custom Tokens, Responsive Layouts' },
  { category: 'Frontend', name: 'Framer Motion', level: 'Advanced', depth: '120fps GPU Transitions, Spring Physics, Layout Animations' },

  // BACKEND & DATABASE
  { category: 'Backend & DB', name: 'Supabase & PostgreSQL', level: 'Expert', depth: 'RLS Security Policies, Triggers, Realtime Subscriptions' },
  { category: 'Backend & DB', name: 'Node.js REST APIs', level: 'Advanced', depth: 'Zod Runtime Validation, Edge Handlers, Webhooks' },
  { category: 'Backend & DB', name: 'Database Architecture', level: 'Advanced', depth: 'Relational Modeling, Indexing, Foreign Key Integrity' },

  // TOOLS & DEVOPS
  { category: 'Tools & DevOps', name: 'Git & GitHub Workflows', level: 'Expert', depth: 'Branching Strategy, CI/CD Actions, Release Tags' },
  { category: 'Tools & DevOps', name: 'Vercel Edge Platform', level: 'Expert', depth: 'Global CDN Routing, Serverless Functions, Analytics' },
  { category: 'Tools & DevOps', name: 'Midtrans Payment Gateway', level: 'Advanced', depth: 'Snap API, Webhook Verification, QRIS & Virtual Accounts' },
];

const categoryTabs = [
  { id: 'ALL', label: 'SEMUA KEAHLIAN' },
  { id: 'Frontend', label: 'FRONTEND ARCHITECTURE' },
  { id: 'Backend & DB', label: 'BACKEND & DATABASE' },
  { id: 'Tools & DevOps', label: 'TOOLS & DEVOPS' },
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
