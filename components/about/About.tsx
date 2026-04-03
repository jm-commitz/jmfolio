'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Ticker from '../ui/Ticker';

export default function About() {
  return (
    <section id="about" className="relative min-h-screen lg:h-screen w-full bg-[var(--bg)] border-y border-[var(--fg)]/[0.08] flex items-center overflow-hidden px-6 md:px-10 py-20 lg:py-0">

      <div className="max-w-[1400px] mx-auto w-full">

        {/* Standardized Minimal Header */}
        <div className="text-[0.65rem] text-[var(--red)] uppercase tracking-[0.3em] mb-8 flex items-center gap-2.5">
          <span className="w-[20px] md:w-[25px] h-[2px] bg-[var(--red)] inline-block"></span>The Human
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-start">

          {/* Left Column: Massive Statement */}
          <div className="mb-4 lg:mb-0">
            <h2 className="font-[family-name:var(--D)] text-[clamp(3.2rem,12vw,8rem)] leading-[0.9] lg:leading-[0.85] tracking-tight uppercase">
              I ARCHITECT<br />
              THE <span className="text-[var(--red)] text-shadow-sm">ENGINES</span><br />
              OF GROWTH.
            </h2>
          </div>

          {/* Right Column: Simple Narrative */}
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-6 md:space-y-8 max-w-xl">
              <p className="text-[1.05rem] md:text-[1.45rem] font-[family-name:var(--M)] text-[var(--fg)] leading-relaxed italic opacity-90">
                "I don't just build features; I architect revenue-generating products for businesses that need more than a generic website."
              </p>
              <p className="text-[0.75rem] md:text-[0.85rem] text-[var(--fg2)] leading-loose font-[family-name:var(--M)] uppercase tracking-[0.15em] md:tracking-widest font-bold opacity-60">
                Based in the Philippines, I specialize in full-stack ownership—taking concepts from raw friction to global production with a focus on SaaS and mobile ecosystems.
              </p>
            </div>

            {/* Ticker Row: Tech Stack Icons */}
            <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-[var(--fg)]/[0.1] -mx-6 md:mx-0">
              <Ticker
                items={[
                  { src: "/images/techstack/laravel.svg", alt: "Laravel" },
                  { src: "/images/techstack/flutter.svg", alt: "Flutter" },
                  { src: "/images/techstack/nextjs2.svg", alt: "Next.js" },
                  { src: "/images/techstack/nodejs.svg", alt: "Node.js" },
                  { src: "/images/techstack/typescript.svg", alt: "TypeScript" },
                  { src: "/images/techstack/docker.svg", alt: "Docker" },
                  { src: "/images/techstack/mysql.svg", alt: "MySQL" },
                  { src: "/images/techstack/php.svg", alt: "PHP" },
                  { src: "/images/techstack/react.svg", alt: "React" },
                  { src: "/images/techstack/expo.svg", alt: "Expo" }
                ]}
                theme="red"
                speed="rev"
                emIcon="★"
              />
            </div>

            {/* Simple CTA Row */}
            <div className="mt-10 md:mt-12 flex flex-wrap gap-6 md:gap-8">
              <a href="mailto:anchetajaymark69@gmail.com" className="text-[0.7rem] md:text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[var(--yellow)] hover:underline underline-offset-4">Msg me&rarr;</a>
              <a href="#" className="text-[0.7rem] md:text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[var(--fg2)] hover:text-[var(--fg)]">Download CV &darr;</a>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
