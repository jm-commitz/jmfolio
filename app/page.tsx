'use client';

import AsciiArt from '@/components/AsciiArt';
import Hero from '@/components/Hero';
import Header from '@/components/header/header';
import Section1 from '@/components/section1/page';
import Section2 from '@/components/section2/page';
import Section3 from '@/components/section3/page';
import Section4 from '@/components/section4/page';
import Section5 from '@/components/section5/page';
import Footer from '@/components/footer/footer';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroOffset = useTransform(scrollYProgress, [0, 0.5], ["0%", "-20%"]);

  return (
    <main ref={containerRef} className="relative bg-background">
      <Header />

      {/* Hero Section Container - Sticky */}
      <motion.div
        style={{ y: heroOffset }}
        className="sticky top-0 h-screen w-full flex overflow-hidden z-0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
          <div className="flex items-center justify-center p-4">
            <Hero />
          </div>
          <div className="flex items-center justify-center p-4">
            <AsciiArt />
          </div>
        </div>
      </motion.div>

      {/* Section 1 - Pulls Up */}
      <div className="relative z-10 shadow-[0_-50px_100px_rgba(0,0,0,0.1)]">
        <Section1 />
      </div>

      {/* Section 2 - Featured Projects */}
      <div className="relative z-10">
        <Section2 />
      </div>

      {/* Section 3 - About */}
      <div className="relative z-10">
        <Section3 />
      </div>

      {/* Section 4 - Testimonials */}
      <div className="relative z-10">
        <Section4 />
      </div>

      {/* Section 5 - Why Choose Me */}
      <div className="relative z-10">
        <Section5 />
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
