'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import TechTicker from '@/components/TechTicker';
import SelectedWork, { ProjectItem } from '@/components/SelectedWork';
import About, { StatItem } from '@/components/About';
import Experience from '@/components/Experience';
import Capabilities, { SkillNode } from '@/components/Capabilities';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import FaqSection from '@/components/FaqSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import FloatingDock from '@/components/FloatingDock';
import LoadingScreen from '@/components/LoadingScreen';

// Dynamic components for optimal performance
const SpotlightCursor = dynamic(() => import('@/components/SpotlightCursor'), { ssr: false });
const TechConsoleHub = dynamic(() => import('@/components/TechConsoleHub'), { ssr: false });

interface PortfolioViewProps {
  projects?: ProjectItem[];
  stats?: StatItem[];
  skillNodes?: SkillNode[];
}

export default function PortfolioView({
  projects = [],
  stats = [],
  skillNodes = [],
}: PortfolioViewProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
  });

  const [loaded, setLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-sans relative selection:bg-white selection:text-black">
      <LoadingScreen onComplete={() => setLoaded(true)} />

      <AnimatePresence mode="wait">
        {loaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            {/* GPU Smooth Scroll Progress Indicator */}
            <motion.div
              className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-white via-zinc-200 to-white origin-left z-50 shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              style={{ scaleX }}
            />

            {/* Ambient Lighting Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[140px]" />
              <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[140px]" />
              <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[140px]" />
              {/* Subtle Cyber Grid Hairline Overlay */}
              <div className="absolute inset-0 bg-tech-grid opacity-30" />
            </div>

            {/* Spotlight Cursor Follower */}
            <SpotlightCursor />

            {/* Floating Navigation Header */}
            <Nav />

            {/* Main Content Sections */}
            <main className="relative z-10 flex flex-col">
              <Hero />
              <TechTicker />
              <SelectedWork projects={projects} />
              <About stats={stats} />
              <Experience />
              <Capabilities skillNodes={skillNodes} />
              <TechConsoleHub />
              <Process />
              <Testimonials />
              <FaqSection />
              <Contact />
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating Fast Contact Hub */}
            <FloatingDock />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
