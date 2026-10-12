'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

// Apple-style "hola" handwriting splash. Lettering built from the "hello"
// paths in ncdai's Apple Hello Effect (MIT, chanhdai.com), based on
// JaceThings' SF-Hello: the same "h", "o" and "l", plus a matching "a".

// Pause on the finished word before fading out — long enough for the tour
// cursor to pop in over the splash and announce the tour.
const HOLD_MS = 2200;
const DRAW_MS = 2900; // "h" (0.8s) + "ola" (0.7s delay + 2.2s)
const FADE_MS = 600; // overlay exit
// The tour cursor appears this long before the splash has fully faded.
const TOUR_LEAD_MS = 3000;
const FALLBACK_MS = 9000; // never let the splash get stuck (e.g. animation interrupted)

export default function HelloSplash() {
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();

  // Lock scroll while the splash covers the page.
  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    const fallback = setTimeout(() => setVisible(false), FALLBACK_MS);
    return () => {
      root.style.overflow = prev;
      clearTimeout(fallback);
    };
  }, [visible]);

  // Signal the tour cursor TOUR_LEAD_MS before the splash ends, so it pops in
  // over the splash and announces the tour.
  useEffect(() => {
    const total = reduce ? 600 + FADE_MS : DRAW_MS + HOLD_MS + FADE_MS;
    const t = setTimeout(() => {
      document.documentElement.dataset.splashDrawn = '1';
      window.dispatchEvent(new Event('hello-splash-drawn'));
    }, Math.max(0, total - TOUR_LEAD_MS));
    return () => clearTimeout(t);
  }, [reduce]);

  const finish = () => {
    setTimeout(() => setVisible(false), reduce ? 600 : HOLD_MS);
  };

  // Initial state stays identical for SSR and reduced motion (no hydration
  // mismatch); reduced motion just draws instantly.
  const draw = (duration: number, delay = 0) =>
    reduce
      ? { duration: 0 }
      : {
          duration,
          delay,
          ease: 'easeInOut' as const,
          opacity: { duration: 0.4, delay },
        };

  return (
    <AnimatePresence
      onExitComplete={() => {
        // Lets the tour cursor start once the page is uncovered.
        document.documentElement.dataset.splashDone = '1';
        window.dispatchEvent(new Event('hello-splash-done'));
      }}
    >
      {visible && (
        <motion.div
          key="hello-splash"
          aria-hidden
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]"
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_MS / 1000, ease: 'easeInOut' }}
        >
          <motion.svg
            className="w-[min(60vw,411px)]"
            viewBox="0 0 546 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="14.8883"
            strokeLinecap="round"
            strokeLinejoin="round"
            exit={{ scale: 1.06, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {/* h — first stroke */}
            <motion.path
              d="M8.69214 166.553C36.2393 151.239 61.3409 131.548 89.8191 98.0295C109.203 75.1488 119.625 49.0228 120.122 31.0026C120.37 17.6036 113.836 7.43883 101.759 7.43883C88.3598 7.43883 79.9231 17.6036 74.7122 40.9363C69.005 66.5793 64.7866 96.0036 54.1166 190.356"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={draw(0.8)}
            />
            {/* h shoulder + "ola" — second stroke */}
            <motion.path
              d="M55.1624 181.135C60.6251 133.114 81.4118 98.0479 107.963 98.0479C123.844 98.0479 133.937 110.703 131.071 128.817C129.457 139.487 127.587 150.405 125.408 163.06C122.869 178.941 130.128 191.348 152.122 191.348C181.58 191.348 197.583 165.67 207.177 138.402C216.661 111.447 228.324 94.8221 252.641 94.8221C272.741 94.8221 288.622 109.71 288.622 137.75C288.622 168.768 268.498 192.093 243.068 192.341C220.69 192.589 205.991 174.475 207.48 147.179C209.217 116.907 227.579 94.8221 251.649 94.8221C265.545 94.8221 277.216 100.999 286.388 107.725C304 120.6 359.2 128.5 379.199 75.8585C385.788 58.513 388.26 42.4065 388.26 31.1512C388.26 17.8057 384.042 7.55823 372.131 7.55823C360.469 7.55823 352.777 16.6141 345.829 30.9129C337.688 47.4967 331.667 71.4162 329.203 98.4549C323 166.301 336.896 191.348 369.936 191.348C396 191.348 416 160 432 124C441 104 454 95 470 95C485 95 496 102 499 112C495 101 482 95 466 95C446.1 95 430 116.7 430 143.5C430 170.3 446.1 192 466 192C488 192 502 165 502 100C502 140 500 170 505 185C509 193 520 193 535 180"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={draw(2.2, 0.7)}
              onAnimationComplete={finish}
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
