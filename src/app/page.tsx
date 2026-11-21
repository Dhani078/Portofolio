import React from 'react';
import { supabase } from '@/lib/supabase';
import PortfolioView from '@/components/PortfolioView';
import type { ProjectItem } from '@/components/SelectedWork';
import type { StatItem } from '@/components/About';
import type { SkillNode } from '@/components/Capabilities';

export const revalidate = 300;

export default async function Home() {
  let projects: ProjectItem[] = [];
  let stats: StatItem[] = [];
  let skillNodes: SkillNode[] = [];

  try {
    const [pRes, sRes, snRes] = await Promise.all([
      supabase.from('projects').select('*').order('sort_order', { ascending: true }),
      supabase.from('stats').select('*').order('sort_order', { ascending: true }),
      supabase.from('skill_nodes').select('*'),
    ]);

    if (pRes?.data && !pRes.error) projects = pRes.data as unknown as ProjectItem[];
    if (sRes?.data && !sRes.error) stats = sRes.data as unknown as StatItem[];
    if (snRes?.data && !snRes.error) skillNodes = snRes.data as unknown as SkillNode[];
  } catch (error) {
    console.error('⚠️ Supabase data fallback active.', error);
  }

  return (
    <PortfolioView
      projects={projects}
      stats={stats}
      skillNodes={skillNodes}
    />
  );
}
