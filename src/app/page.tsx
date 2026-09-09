import React from 'react';
import { supabase } from '@/lib/supabase';
import PortfolioView from '@/components/PortfolioView';

export const revalidate = 300;

export default async function Home() {
  let projects: any[] = [];
  let stats: any[] = [];
  let skillNodes: any[] = [];

  try {
    const [pRes, sRes, snRes] = await Promise.all([
      supabase.from('projects').select('*').order('sort_order', { ascending: true }),
      supabase.from('stats').select('*').order('sort_order', { ascending: true }),
      supabase.from('skill_nodes').select('*'),
    ]);

    if (pRes?.data) projects = pRes.data;
    if (sRes?.data) stats = sRes.data;
    if (snRes?.data) skillNodes = snRes.data;
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
