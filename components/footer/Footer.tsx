'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Footer() {
  const socials = [
    { name: "GitHub", url: "https://github.com/jm-commitz", img: "/images/social/github.jpg", id: "GH" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/jaymark-ancheta-8511b430b?utm_source=share_via&utm_content=profile&utm_medium=member_ios", img: "/images/social/linkedin.jpg", id: "LI" },
    { name: "Facebook", url: "https://www.facebook.com/share/19eJBkWPML/?mibextid=wwXIfr", img: "/images/social/facebook.jpg", id: "FB" },
    { name: "Instagram", url: "https://www.instagram.com/jmancheta404_", img: "/images/social/instagram.jpg", id: "IG" }
  ];

  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);

  return (
    <footer id="contact" className="bg-[var(--bg)] border-t border-[#f0ece0]/[0.06] overflow-hidden relative">

      {/* Social Preview Card (Fixed UI) */}
      <AnimatePresence>
        {hoveredSocial !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="hidden lg:block fixed bottom-24 right-10 z-[100] w-[280px] bg-[#0f0f0f] border border-[#f0ece0]/[0.1] rounded-sm overflow-hidden shadow-2xl pointer-events-none"
          >
            <div className="w-full overflow-hidden">
              <img src={socials[hoveredSocial].img} alt={socials[hoveredSocial].name} className="w-full h-auto object-contain" />
            </div>
            <div className="p-5 flex justify-between items-center">
              <span className="text-[0.6rem] text-[var(--fg2)] uppercase tracking-widest font-[family-name:var(--M)]">{socials[hoveredSocial].name} PROFILE</span>
              <span className="text-[var(--red)] font-bold text-[0.8rem] animate-pulse">LIVE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto pt-20 px-6 md:px-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-end border-b border-[#f0ece0]/[0.07] pb-16">
        <div>
          <div className="text-[0.65rem] text-[var(--red)] uppercase tracking-[0.3em] mb-5 flex items-center gap-2.5">
            <span className="w-[25px] h-[2px] bg-[var(--red)] inline-block"></span>Let's Work Together
          </div>
          <div className="font-[family-name:var(--D)] text-[clamp(4rem,10vw,9rem)] leading-[0.88] tracking-[-0.01em]">
            GOT A<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px var(--fg)' }}>PROJECT</span><br />
            IN <span className="text-[var(--red)]">MIND?</span>
          </div>
        </div>
        <div className="flex flex-col items-start lg:items-end gap-4">
          <a href="mailto:anchetajaymark69@gmail.com" className="font-[family-name:var(--D)] text-[1.5rem] text-[var(--fg2)] no-underline transition-colors duration-200 hover:text-[var(--yellow)]">anchetajaymark69@gmail.com ↗</a>
          <div className="flex flex-col gap-3 items-start lg:items-end mt-2">
            {socials.map((s, i) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredSocial(i)}
                onMouseLeave={() => setHoveredSocial(null)}
                className="group text-[0.7rem] text-[var(--fg3)] font-[family-name:var(--M)] no-underline uppercase tracking-[0.15em] transition-colors duration-200 hover:text-[var(--yellow)] flex items-center gap-2"
              >
                {s.name} <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-[1rem]">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto py-6 px-6 md:px-10 flex flex-col md:flex-row justify-between items-center flex-wrap gap-4 font-[family-name:var(--M)]">
        <div className="text-[0.6rem] text-[#f0ece0]/[0.18] uppercase tracking-[0.15em]">© 2025 JM — All rights reserved.</div>
        <div className="flex gap-2">
          {socials.map(s => (
            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[0.6rem] text-[var(--fg3)] no-underline uppercase tracking-[0.1em] py-1 px-2.5 border border-[#f0ece0]/[0.08] transition-all duration-200 hover:text-[var(--green)] hover:border-[var(--green)]">{s.id}</a>
          ))}
        </div>
        <div className="text-[0.6rem] text-[#f0ece0]/[0.18] uppercase tracking-[0.15em]">Built in the PH</div>
      </div>

      <div className="font-[family-name:var(--D)] text-[clamp(6rem,22vw,20rem)] text-[#f0ece0]/[0.018] leading-none text-center whitespace-nowrap select-none pointer-events-none -mt-8 pb-4">JM ANCHETA</div>
    </footer>
  );
}
