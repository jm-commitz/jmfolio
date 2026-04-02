'use client';
import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function Testimonials() {
  const reviews = [
    { name: "ELIAS M.", role: "E-commerce Director", text: "The Omnichannel Dashboard JM built is a game-changer. Managing Lazada, Shopee, and TikTok from one place saved us 20+ hours a week in manual syncing. Technical depth and API integration skills are top-tier.", initial: "EM", color: "var(--red)", bg: "var(--red)" },
    { name: "SOPHIA L.", role: "Operations Manager, MRP Systems", text: "We needed a custom MRP and Inventory solution that didn't feel bloated. JM delivered a streamlined React/Laravel system that handles our production tracking perfectly. Minimalist UI with maximum utility.", initial: "SL", color: "var(--yellow)", bg: "var(--yellow)", fg: "#000" },
    { name: "DANTE G.", role: "Founder, RefillPro Network", text: "The specialized Water Refilling POS JM architected for our stations is robust and offline-ready where it needs to be. His Flutter expertise made the delivery tracking app incredibly smooth for our riders.", initial: "DG", color: "var(--pink)", bg: "var(--pink)", fg: "#000" },
    { name: "MARCUS T.", role: "CEO, PropTech Solutions", text: "The Airbnb-style booking system was delivered with exceptional backend logic. Using Prisma and Node.js, JM ensured the availability management was bulletproof even during high-traffic load tests.", initial: "MT", color: "var(--red)", bg: "var(--red)" },
    { name: "ARIANNE K.", role: "Marketing Lead", text: "Our company landing page conversion increased by 40% after JM redesigned it. The focus on responsiveness and lead generation forms was exactly what we were missing before.", initial: "AK", color: "var(--yellow)", bg: "var(--yellow)", fg: "#000" },
    { name: "BENJAMIN V.", role: "SaaS Product Owner", text: "Building a multi-tenant POS is no small feat. JM handled the architectural isolation between tenants perfectly, ensuring each client has their own secure data space in a shared database.", initial: "BV", color: "var(--pink)", bg: "var(--pink)", fg: "#000" },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: carouselRef });
  const scaleX = useSpring(scrollXProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Auto-slide logic
  React.useEffect(() => {
    const interval = setInterval(() => {
      const container = carouselRef.current;
      if (!container) return;

      const cardWidth = 450 + 24; // Width + Gap
      const isAtEnd = container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10;

      if (isAtEnd) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="testimonials" className="py-24 max-w-[1400px] mx-auto px-6 md:px-10 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
        <div>
          <div className="text-[0.65rem] text-[var(--red)] uppercase tracking-[0.3em] mb-2 flex items-center gap-2.5">
            <span className="w-[25px] h-[2px] bg-[var(--red)] inline-block"></span>Social Proof
          </div>
          <h2 className="font-[family-name:var(--D)] text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.88] tracking-[-0.01em]">WHAT<br />THEY SAY</h2>
        </div>

        {/* Carousel Progress Bar */}
        <div className="hidden md:block w-full max-w-[250px] space-y-4">
          <div className="text-[0.6rem] uppercase tracking-widest text-[var(--fg3)] font-bold text-right">01 / DISCOVER</div>
          <div className="h-[2px] w-full bg-[var(--fg3)]/10 relative">
            <motion.div style={{ scaleX }} className="absolute inset-0 bg-[var(--red)] origin-left" />
          </div>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-10 cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((r, i) => (
          <div
            key={i}
            className="snap-center shrink-0 w-[85vw] md:w-[450px] group bg-[var(--bg2)] p-10 border border-[#f0ece0]/[0.06] relative overflow-hidden transition-all duration-300 hover:border-[#f0ece0]/15"
          >
            <div className="absolute bottom-0 left-0 w-full h-[3px] transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100" style={{ background: r.color }}></div>

            <div className="flex justify-between items-start mb-6">
              <span className="font-[family-name:var(--D)] text-7xl text-[var(--red)] leading-[0.45] block opacity-40">"</span>
              <div className="w-[42px] h-[42px] font-[family-name:var(--D)] text-[1.2rem] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:rotate-12" style={{ background: r.bg, color: r.fg || 'var(--bg)' }}>{r.initial}</div>
            </div>

            <p className="text-[0.8rem] md:text-[0.85rem] leading-[1.85] text-[var(--fg)] mb-10 h-[100px] line-clamp-4 italic opacity-80 group-hover:opacity-100 transition-opacity">
              "{r.text}"
            </p>

            <div className="border-t border-[#f0ece0]/[0.1] pt-6 flex justify-between items-end">
              <div>
                <div className="font-[family-name:var(--D)] text-[1.2rem] text-[var(--fg)] leading-none mb-1.5">{r.name}</div>
                <div className="text-[0.55rem] text-[var(--fg3)] uppercase tracking-[0.15em] font-[family-name:var(--M)]">{r.role}</div>
              </div>
              <div className="text-[0.6rem] text-[var(--red)] font-black uppercase tracking-tighter opacity-20">VERIFIED_LOG_0{i + 1}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
