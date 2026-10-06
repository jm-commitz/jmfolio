'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const FADE_OVER = 240; // max px past the top over which an item fully fades
const BAR_INSET = 72; // left column: items fade out under the floating ProfileBar card

// Desktop column scroller where content fades away as it scrolls off the top
// — the same effect as the profile: it dims, shrinks a touch, drifts down and
// softly blurs, and comes back when you scroll up.
//
// It works on "fade units" found automatically: the column's children, except
// that anything taller than half the column is split into its own children
// (recursively), so a long project list fades row by row, not all at once.
// Zero-height elements (like the sticky ProfileBar) are skipped.
export default function ScrollColumn({
  as: Tag = 'div',
  bar = false,
  className = '',
  children,
}: {
  as?: 'div' | 'aside';
  bar?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const col = ref.current;
    if (!col) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Each unit with its natural (untransformed) offset in the column content.
    let units: { el: HTMLElement; top: number; height: number }[] = [];
    let raf = 0;

    const collect = () => {
      const out: HTMLElement[] = [];
      const limit = col.clientHeight * 0.5;
      const walk = (el: Element) => {
        for (const child of Array.from(el.children)) {
          if (!(child instanceof HTMLElement)) continue;
          const h = child.offsetHeight;
          if (h === 0) continue;
          if (h > limit && child.children.length > 0) walk(child);
          else out.push(child);
        }
      };
      walk(col);
      // Clear styles on anything that is no longer a unit.
      for (const old of units) if (!out.includes(old.el)) clear(old.el);
      // offsetTop ignores transforms, so the fade never feeds back into the
      // measurement. Sum up to the column (it's the offsetParent, see className).
      units = out.map((el) => {
        let top = 0;
        let node: HTMLElement | null = el;
        while (node && node !== col) {
          top += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        return { el, top, height: el.offsetHeight };
      });
    };

    const clear = (el: HTMLElement) => {
      el.style.opacity = '';
      el.style.transform = '';
      el.style.filter = '';
    };

    const apply = () => {
      raf = 0;
      if (!desktop.matches) {
        units.forEach((u) => clear(u.el));
        return;
      }
      const inset = bar ? BAR_INSET : 0;
      for (const { el, top, height } of units) {
        // Fade starts when the item reaches the fade line (the top, or the
        // ProfileBar's bottom). Items that already sit above that line at rest
        // (the profile) start fading only once the column actually scrolls.
        const passed = col.scrollTop - Math.max(0, top - inset);
        const t = Math.min(1, Math.max(0, passed / Math.min(height, FADE_OVER)));
        if (t === 0) {
          clear(el);
          continue;
        }
        el.style.opacity = String(1 - t);
        if (reduce.matches) continue;
        el.style.transformOrigin = 'top center';
        el.style.transform = `translateY(${t * 24}px) scale(${1 - t * 0.06})`;
        el.style.filter = `blur(${t * 4}px)`;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const relayout = () => {
      collect();
      schedule();
    };

    relayout();
    col.addEventListener('scroll', schedule, { passive: true });
    // Content can grow after load (images, GitHub data, Spotify list).
    const ro = new ResizeObserver(relayout);
    ro.observe(col);
    for (const child of Array.from(col.children)) ro.observe(child);
    desktop.addEventListener('change', relayout);

    return () => {
      cancelAnimationFrame(raf);
      col.removeEventListener('scroll', schedule);
      ro.disconnect();
      desktop.removeEventListener('change', relayout);
      units.forEach((u) => clear(u.el));
    };
  }, [bar]);

  return (
    // `relative` makes the column the offsetParent for the offset measurement.
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={`relative ${className}`}>
      {children}
    </Tag>
  );
}
