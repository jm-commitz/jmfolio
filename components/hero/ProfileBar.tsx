'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { githubAvatar } from '@/lib/github';
import { FOLLOW_HREF, MESSAGE_HREF } from './profileLinks';
import { useColumnScroll } from './useColumnScroll';

// Compact profile header for the left column. Slides in, pinned to the top of
// the column, as soon as the column scrolls, and slides away at the top. Zero-height sticky wrapper, so it
// overlays the column instead of pushing content down.
const SHOW_AFTER = 8; // px scrolled before the bar slides in — any real scroll

export default function ProfileBar() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  // Show as soon as the column scrolls a little.
  useColumnScroll((y) => setShow(y > SHOW_AFTER));

  const backToTop = () =>
    document
      .querySelector('[data-tour="profile"]')
      ?.closest('section')
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  const spring = { type: 'spring' as const, stiffness: 380, damping: 32 };
  const item = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 6 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0.15 } : { ...spring, delay },
  });

  return (
    // Desktop only (lg+): on phones the page scrolls normally, no banner.
    <div className="sticky top-0 z-20 hidden h-0 lg:block">
      <AnimatePresence>
        {show && (
          // Floating glass card, inset from the column edges.
          <motion.div
            key="profile-bar"
            className="absolute inset-x-4 top-3 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--foreground)_10%,transparent)] bg-[color-mix(in_srgb,var(--background)_72%,transparent)] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55),inset_0_1px_0_color-mix(in_srgb,var(--foreground)_8%,transparent)] backdrop-blur-2xl backdrop-saturate-150 lg:inset-x-5"
            style={{ transformOrigin: 'top center' }}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: -16, scale: 0.96, filter: 'blur(6px)' }
            }
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.15 } }
                : {
                    opacity: 0,
                    y: -12,
                    scale: 0.97,
                    filter: 'blur(4px)',
                    transition: { duration: 0.2, ease: 'easeIn' },
                  }
            }
            transition={reduce ? { duration: 0.15 } : spring}
          >
            {/* Soft sheen across the top edge of the glass */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[color-mix(in_srgb,var(--foreground)_5%,transparent)] to-transparent"
            />

            <div className="relative flex items-center gap-3 py-2 pl-2 pr-2">
              <motion.button
                type="button"
                onClick={backToTop}
                aria-label="Back to profile"
                className="relative shrink-0"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduce ? { duration: 0.15 } : spring}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={githubAvatar(80)}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-xl object-cover ring-1 ring-[color-mix(in_srgb,var(--foreground)_12%,transparent)] grayscale-[60%]"
                />
                {/* Available for work */}
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--background)] bg-[#00c853]"
                />
              </motion.button>

              <motion.button
                type="button"
                onClick={backToTop}
                className="min-w-0 flex-1 text-left"
                {...item(0.04)}
              >
                <span className="flex items-center gap-1">
                  <span className="truncate text-sm font-bold tracking-tight text-[var(--foreground)]">
                    Jaymark Ancheta
                  </span>
                  <BadgeCheck
                    className="h-3.5 w-3.5 shrink-0"
                    fill="var(--foreground)"
                    stroke="var(--background)"
                    aria-label="Verified"
                  />
                </span>
                <span className="block truncate text-[11px] text-[var(--muted-foreground)]">
                  Full-Stack &amp; Mobile Developer · Building the Next Big Thing.
                </span>
              </motion.button>

              <motion.div className="flex shrink-0 items-center gap-1.5" {...item(0.08)}>
                <a
                  href={FOLLOW_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center rounded-full bg-[var(--foreground)] px-3.5 text-xs font-semibold text-[var(--background)] shadow-sm transition hover:opacity-90 active:scale-95"
                >
                  Follow
                </a>
                <a
                  href={MESSAGE_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center rounded-full border bg-[color-mix(in_srgb,var(--background)_60%,transparent)] px-3.5 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--accent)] active:scale-95"
                >
                  Message
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
