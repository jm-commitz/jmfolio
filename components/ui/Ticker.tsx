'use client';

import React from 'react';
import { motion } from 'framer-motion';

type TickerItem = string | { src: string; alt: string };

type TickerProps = {
  items: TickerItem[];
  theme: 'red' | 'yel' | 'dark';
  speed?: 'normal' | 'rev' | 'slow';
  emIcon?: string;
};

export default function Ticker({ items, theme, speed = 'normal', emIcon = '★' }: TickerProps) {
  // Use two sets of items for seamless loop
  const allItems = [...items, ...items];

  let containerBg = '';
  let containerBorder = '';
  let itemColor = '';
  let emColor = '';

  if (theme === 'dark') {
    containerBg = 'bg-[var(--red)]';
    containerBorder = 'border-y-[3px] border-[var(--yellow)]';
    itemColor = 'text-[var(--bg)]';
    emColor = 'text-[var(--yellow)]';
  } else if (theme === 'yel') {
    containerBg = 'bg-[var(--yellow)]';
    containerBorder = 'border-y-[3px] border-[var(--red)]';
    itemColor = 'text-[var(--bg)]';
    emColor = 'text-[var(--red)]';
  } else if (theme === 'red') {
    containerBg = 'bg-[var(--bg3)]';
    containerBorder = 'border-y border-[#f0ece0]/10';
    itemColor = 'text-[var(--fg3)]';
    emColor = 'text-[#f0ece0]/20';
  }

  let duration = 30;
  if (speed === 'rev') duration = 20;
  if (speed === 'slow') duration = 60;

  // For reverse, we go from -50% to 0
  const initialX = speed === 'rev' ? "-50%" : "0%";
  const animateX = speed === 'rev' ? "0%" : "-50%";

  return (
    <div className={`overflow-hidden py-4 relative z-10 ${containerBg} ${containerBorder}`}>
      <motion.div 
        className="flex items-center whitespace-nowrap"
        initial={{ x: initialX }}
        animate={{ x: animateX }}
        transition={{ 
          duration,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {allItems.map((item, i) => (
          <div key={i} className="flex items-center shrink-0">
             <span className={`font-[family-name:var(--D)] text-[1.1rem] tracking-[0.12em] px-10 transition-all ${itemColor}`}>
               {typeof item === 'string' ? (
                 <span>{item}</span>
               ) : (
                 <img src={item.src} alt={item.alt} className="h-8 w-auto opacity-100 transition-opacity" />
               )}
             </span>
             <em className={`not-italic ${emColor} text-lg`}>{emIcon}</em>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
