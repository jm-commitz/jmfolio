'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

// Xbox/PlayStation-style "Achievement unlocked" toast for clicking the
// profile photo — gold so it stands out from the monochrome site. Portaled to
// <body> so the columns' scroll-fade transforms can't trap the fixed position.
export default function AchievementToast({ show, repeat }: { show: boolean; repeat: boolean }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed right-4 top-4 z-[160] flex justify-end sm:right-6 sm:top-6"
          // Slides in from the top-right corner
          initial={{ opacity: 0, x: reduce ? 0 : 40, y: reduce ? 0 : -12, scale: reduce ? 1 : 0.92 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: reduce ? 0 : 40, transition: { duration: 0.25, ease: 'easeIn' } }}
          transition={reduce ? { duration: 0.15 } : { type: 'spring', stiffness: 320, damping: 24 }}
        >
          <div className="relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-[#fff3c4]/70 bg-gradient-to-br from-[#ffe48a] via-[#f6c445] to-[#d99a1b] py-3 pl-3 pr-6 text-[#2b1d00] shadow-[0_24px_48px_-16px_rgba(217,154,27,0.55),inset_0_1px_0_rgba(255,255,255,0.6)]">
            {/* Trophy badge pops in after the card */}
            <motion.span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2b1d00] text-xl shadow-md ring-2 ring-[#fff3c4]/60"
              initial={{ scale: reduce ? 1 : 0, rotate: reduce ? 0 : -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={
                reduce ? { duration: 0 } : { delay: 0.15, type: 'spring', stiffness: 420, damping: 14 }
              }
              aria-hidden
            >
              🏆
            </motion.span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2b1d00]/70">
                {repeat ? 'Achievement' : 'Achievement unlocked'}
              </p>
              <p className="text-base font-extrabold leading-tight tracking-tight text-[#2b1d00]">
                Curious Clicker
              </p>
              <p className="text-xs font-medium text-[#2b1d00]/75">
                {repeat ? "Already unlocked — you're persistent 😄" : 'You clicked the profile 🤫'}
              </p>
            </div>

            {/* Shine sweeping across the card once */}
            {!reduce && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                initial={{ left: '-40%' }}
                animate={{ left: '140%' }}
                transition={{ delay: 0.35, duration: 0.9, ease: 'easeInOut' }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
