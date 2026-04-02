'use client';
import { useEffect, useState } from 'react';
import Nav from '@/components/nav/Nav';
import Hero from '@/components/hero/Hero';
import Ticker from '@/components/ui/Ticker';
import Arsenal from '@/components/arsenal/Arsenal';
import Interlude from '@/components/ui/Interlude';
import FeaturedProjects from '@/components/featuredProjects/FeaturedProjects';
import About from '@/components/about/About';
import Testimonials from '@/components/testimonials/Testimonials';
import WhyChooseMe from '@/components/whyChooseMe/WhyChooseMe';
import Footer from '@/components/footer/Footer';
import Cursor from '@/components/ui/Cursor';

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = (e: React.MouseEvent) => {
    // Only toggle if clicking the actual background/container, not a child link/button
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('a, button, .hover-trigger, .proj-row, .tc, .ac, .wc, .btn-y, input, textarea');

    if (!isInteractive) {
      setTheme(prev => {
        const next = prev === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        return next;
      });
    }
  };

  return (
    <main
      onClick={toggleTheme}
      className={`min-h-screen transition-colors duration-700 bg-[var(--bg)] text-[var(--fg)]`}
    >
      <Cursor />
      <Nav />
      <Hero />
      <Ticker
        items={['FLUTTER', 'LARAVEL', 'NEXT.JS', 'NODE.JS', 'MYSQL', 'REACT.JS', 'DOCKER', 'VERCEL', 'TAILWIND', 'EXPO', 'TYPESCRIPT']}
        theme="red"
        emIcon="★"
      />
      <Arsenal />
      <Interlude />
      <FeaturedProjects />
      <About />
      <Testimonials />
      <WhyChooseMe />
      <Ticker
        items={['AVAILABLE FOR FREELANCE', 'OPEN TO CONTRACTS', 'BASED IN THE PHILIPPINES', 'WEB DEV', 'MOBILE DEV', 'SAAS BUILDER']}
        theme={theme === 'dark' ? 'dark' : 'red'}
        emIcon="★"
      />
      <Footer />
    </main>
  );
}
