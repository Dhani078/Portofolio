import React from 'react';
import { supabase } from '@/lib/supabase';
import PortfolioView from '@/components/PortfolioView';

export const revalidate = 0;

export default async function Home() {
  let projects: any[] = [];
  let stats: any[] = [];
  let skillNodes: any[] = [];

  try {
    const { data: pData } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });
    if (pData) projects = pData;

    const { data: sData } = await supabase
      .from('stats')
      .select('*')
      .order('sort_order', { ascending: true });
    if (sData) stats = sData;

    const { data: snData } = await supabase
      .from('skill_nodes')
      .select('*');
    if (snData) skillNodes = snData;
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
