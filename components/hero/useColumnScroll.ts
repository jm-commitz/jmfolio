'use client';

import { useEffect, useRef } from 'react';

/**
 * Calls `onScroll(y)` with how far the left column has scrolled: the column's
 * own scrollTop on desktop (it's a scroller there), the page's scrollY on
 * mobile. Re-picks the scroller on resize. Also fires once on mount.
 */
export function useColumnScroll(onScroll: (y: number) => void) {
  const cb = useRef(onScroll);
  useEffect(() => {
    cb.current = onScroll;
  });

  useEffect(() => {
    const aside = document.querySelector('[data-tour="profile"]')?.closest('aside') ?? null;
    let target: HTMLElement | Window = window;

    const update = () =>
      cb.current(target === window ? window.scrollY : (target as HTMLElement).scrollTop);

    const pick = () => {
      const scrolls = aside && getComputedStyle(aside).overflowY !== 'visible';
      const next: HTMLElement | Window = scrolls && aside ? aside : window;
      if (next !== target) {
        target.removeEventListener('scroll', update);
        target = next;
        target.addEventListener('scroll', update, { passive: true });
      }
      update();
    };

    target.addEventListener('scroll', update, { passive: true });
    pick();
    window.addEventListener('resize', pick);
    return () => {
      target.removeEventListener('scroll', update);
      window.removeEventListener('resize', pick);
    };
  }, []);
}
