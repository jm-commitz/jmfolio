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


export default function Home() {
  return (
    <main
      className={`min-h-screen transition-colors duration-700 bg-[var(--bg)] text-[var(--fg)]`}
    >
      <Nav />
      <Hero />
      <Ticker
        items={['DESIGN', 'DEVELOPMENT', 'PERFORMANCE', 'SEO', 'CONVERSION', 'STRATEGY', 'DESIGN', 'DEVELOPMENT', 'PERFORMANCE', 'SEO', 'CONVERSION']}
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
        theme="red"
        emIcon="★"
      />
      <Footer />
    </main>
  );
}
