'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeaturedProjects() {
  const projects = [
    {
      num: "01",
      name: "OMNICHANNEL SALES DASHBOARD",
      img: "/images/projects/omnichannel.png",
      techs: ["React.js", "Zustand", "TanStack Query", "Laravel", "MySQL"],
      year: "2025",
      desc: "Centralized dashboard for managing and monitoring multi-platform sales across Lazada, Shopee, TikTok, and Shopify. Features revenue tracking, product syncing, multi-store management, top-selling insights, and delivery monitoring, powered by a Laravel REST API."
    },
    {
      num: "02",
      name: "MRP + INVENTORY + POS SYSTEM",
      img: "/images/projects/inventory.png",
      techs: ["React.js", "Zustand", "TanStack Query", "Laravel"],
      year: "2025",
      desc: "Integrated system combining MRP, inventory, and POS in a single dashboard. Enables businesses to manage stock, track production, monitor sales, and analyze revenue in real time."
    },
    {
      num: "03",
      name: "COMPANY LANDING PAGE",
      img: "/images/projects/landing.png",
      techs: ["Next.js", "Tailwind CSS"],
      year: "2026",
      desc: "Modern company website showcasing projects, blog content, and inquiry forms. Built with a clean layout focused on clarity, responsiveness, and lead generation."
    },
    {
      num: "04",
      name: "AIRBNB BOOKING SYSTEM",
      img: "/images/projects/airbnb.png",
      techs: ["Next.js", "Node.js", "Prisma"],
      year: "2026",
      desc: "Full booking platform inspired by Airbnb. Includes property listings, availability management, reservations, and user flows for both guests and property owners."
    },
    {
      num: "05",
      name: "MULTI-TENANT POS SYSTEM",
      img: "/images/projects/salepoint.png",
      techs: ["Flutter", "Laravel", "MySQL"],
      year: "2026",
      desc: "Scalable POS platform designed for multiple businesses under one system. Supports tenant isolation, sales tracking, and centralized management for growing operations."
    },
    {
      num: "06",
      name: "WATER REFILLING POS & DELIVERY",
      img: "/images/projects/refillpro.png",
      techs: ["Flutter", "Laravel"],
      year: "2024",
      desc: "POS and delivery management system tailored for water refilling stations. Handles order tracking, delivery scheduling, and daily sales operations."
    },
    {
      num: "07",
      name: "CONDO RENTAL SYSTEM",
      img: "/images/projects/dale.png",
      techs: ["Next.js", "Laravel", "MySQL"],
      year: "2026",
      desc: "Rental platform with both landing page and admin dashboard. Includes property listings, tenant management, and booking workflows for condo rentals."
    }
  ];


  const [visibleCount, setVisibleCount] = useState<number>(3);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 2, projects.length));
  };

  return (
    <div id="projects" className="py-24 max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col items-start gap-12 relative overflow-visible">

      {/* Header Section */}
      <div className="w-full">
        <div className="text-[0.65rem] text-[var(--red)] uppercase tracking-[0.3em] mb-2 flex items-center gap-2.5">
          <span className="w-[25px] h-[2px] bg-[var(--red)] inline-block"></span>Selected Work
        </div>
        <h2 className="font-[family-name:var(--D)] text-[clamp(4.5rem,10vw,8.5rem)] leading-[0.88] tracking-[-0.01em]">FEATURED<br />PROJECTS</h2>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 lg:gap-20 items-start">

        {/* Left Column: Project List */}
        <div className="relative border-t border-[var(--fg)]/[0.07]">
          {visibleProjects.map((p, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              className="proj-group"
            >
              {/* DESKTOP ROW VIEW */}
              <div className={`hidden lg:grid proj-row group grid-cols-[60px_1fr_auto] gap-8 items-start py-12 border-b border-[var(--fg)]/[0.07] relative transition-all duration-300 cursor-pointer ${hoveredIndex === i ? 'pl-8' : ''}`}>
                <div className={`absolute left-0 bottom-0 h-[1.5px] w-full bg-[var(--red)] origin-left transition-transform duration-500 ease-out ${hoveredIndex === i ? 'scale-x-100' : 'scale-x-0'}`}></div>

                <div className={`font-[family-name:var(--D)] text-[1.1rem] tracking-[0.1em] pt-1 transition-colors duration-300 ${hoveredIndex === i ? 'text-[var(--red)]' : 'text-[var(--fg3)]'}`}>
                  {p.num}
                </div>

                <div className="flex-1">
                  <div className={`font-[family-name:var(--D)] text-[5rem] leading-[0.9] mb-4 tracking-[0.01em] transition-all duration-300 ${hoveredIndex === i ? 'text-[var(--fg)] translate-x-2' : 'text-[var(--fg2)] opacity-20'}`}>
                    {p.name}
                  </div>
                </div>

                <div className={`hidden md:block text-right pt-2 transition-all duration-300 ${hoveredIndex === i ? 'opacity-100' : 'opacity-20'}`}>
                  <div className="text-[0.6rem] text-[var(--fg3)] uppercase tracking-[0.2em] mb-2">{p.year}</div>
                  <span className="text-[1.8rem] text-[var(--fg2)]">↗</span>
                </div>
              </div>

              {/* MOBILE CARD VIEW (As requested, uses the full card on small screens) */}
              <div className="lg:hidden block py-8 border-b border-[var(--fg)]/[0.07]">
                <div className="bg-[var(--bg2)] border border-[var(--fg)]/[0.1] overflow-hidden rounded-sm shadow-xl">
                  <div className="w-full overflow-hidden relative">
                    <img src={p.img} alt={p.name} className="w-full h-auto object-contain" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="bg-[var(--red)] px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-widest text-[#fff]">{p.year}</div>
                      <div className="bg-[var(--fg)]/[0.1] backdrop-blur-md px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-widest text-[var(--fg)] border border-[var(--fg)]/[0.2]">SELECTED</div>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div>
                      <div className="text-[0.65rem] text-[var(--red)] font-bold mb-1 tracking-widest">{p.num}</div>
                      <h3 className="font-[family-name:var(--D)] text-[var(--fg)] text-3xl tracking-widest uppercase leading-none mb-4">{p.name}</h3>
                      <p className="text-[0.75rem] text-[var(--fg2)] leading-relaxed italic font-[family-name:var(--M)]">"{p.desc}"</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--fg)]/[0.08]">
                      {p.techs.map(t => (
                        <span key={t} className="text-[0.45rem] text-[var(--fg2)] font-bold uppercase tracking-[0.2em] px-2 py-1 bg-[var(--bg3)] border border-[var(--fg)]/[0.1]">{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-[var(--red)] text-[0.6rem] font-bold uppercase tracking-[0.3em]">PROD_LIVE_V.25</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--fg3)]"></span>
                      <span className="text-[var(--fg3)] text-[0.5rem] uppercase tracking-[0.2em]">Git: Private</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--red)]"></div>
                </div>
              </div>
            </div>
          ))}

          {/* Load More Button Container */}
          {hasMore && (
            <div className="py-12 flex justify-center md:justify-start">
              <button
                onClick={loadMore}
                className="btn-y hover-trigger transition-all duration-300"
              >
                View More Projects &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Preview Card */}
        <div className="hidden lg:block sticky top-24 w-full h-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={hoveredIndex}
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-[var(--bg2)] border border-[var(--fg)]/[0.1] overflow-hidden rounded-sm shadow-2xl"
            >
              {/* Card Image */}
              <div className="w-full overflow-hidden relative group">
                <img
                  src={projects[hoveredIndex].img}
                  alt={projects[hoveredIndex].name}
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 flex gap-3">
                  <div className="bg-[var(--red)] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-[#fff]">{projects[hoveredIndex].year}</div>
                  <div className="bg-[var(--fg)]/[0.1] backdrop-blur-md px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-[var(--fg)] border border-[var(--fg)]/[0.2] font-[family-name:var(--M)]">SELECTED</div>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-10 space-y-8">
                <div>
                  <h3 className="font-[family-name:var(--D)] text-[var(--fg)] text-4xl tracking-widest uppercase leading-none mb-6">{projects[hoveredIndex].name}</h3>
                  <p className="text-[0.8rem] text-[var(--fg2)] leading-relaxed opacity-80 font-[family-name:var(--M)] italic">"{projects[hoveredIndex].desc}"</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-6 border-t border-[var(--fg)]/[0.08]">
                  {projects[hoveredIndex].techs.map(t => (
                    <span key={t} className="text-[0.5rem] text-[var(--fg2)] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-[var(--bg3)] border border-[var(--fg)]/[0.1]">{t}</span>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-2 pb-2">
                  <span className="text-[var(--red)] text-[0.65rem] font-bold uppercase tracking-[0.4em]">PROD_LIVE_V.25</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--fg3)] animate-pulse"></span>
                  <span className="text-[var(--fg3)] text-[0.55rem] uppercase tracking-[0.3em] font-[family-name:var(--M)]">Git: Private Deployment</span>
                </div>
              </div>

              {/* Decorative Red Line */}
              <div className="h-2 w-full bg-[var(--red)]"></div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
