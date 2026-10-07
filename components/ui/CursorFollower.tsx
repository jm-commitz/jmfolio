'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ARROW_PATH,
  BUBBLE_OFFSET,
  Bubble,
  CURSOR_COLOR,
  NameTag,
} from '@/components/tour/cursorParts';

// The visitor's own cursor on desktop: the tour's rounded Figma-style arrow
// with a "You" tag. Hovering anything with a `data-say="…"` line swaps the tag
// for a typing speech bubble, like the tour's. Desktop only (wide screen, a
// real mouse); phones and tablets keep their normal behaviour.

const QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const HOVER_DELAY = 150; // ms — don't flash bubbles while sweeping across the page
const BUBBLE_W = 240;
const BUBBLE_MAX_H = 120;
const TAG_W = 44;

export default function CursorFollower() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [say, setSay] = useState<{ text: string; key: number } | null>(null);
  // x/y: where the bubble opens; tagX: the short "You" tag only flips at the very edge.
  const [flip, setFlip] = useState({ x: false, y: false, tagX: false });
  const [pressed, setPressed] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // Only on desktop with a real mouse; re-checks when that changes.
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => setEnabled(mq.matches);
    const t = setTimeout(sync, 0);
    mq.addEventListener('change', sync);
    return () => {
      clearTimeout(t);
      mq.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add('custom-cursor');

    let hoverEl: Element | null = null;
    // Clicking closes the bubble and keeps it closed while the pointer stays
    // on that element; leaving it and coming back shows the bubble again.
    let suppressed: Element | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let n = 0;
    let lastFlip = '';

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const el = root.current;
      if (el) el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      setVisible(true);
      // Flip the tag/bubble near the right and bottom edges.
      const fx = e.clientX + BUBBLE_OFFSET.x + BUBBLE_W > window.innerWidth - 8;
      const fy = e.clientY + BUBBLE_OFFSET.y + BUBBLE_MAX_H > window.innerHeight - 8;
      const ftag = e.clientX + BUBBLE_OFFSET.x + TAG_W > window.innerWidth - 8;
      const f = `${fx}${fy}${ftag}`;
      if (f !== lastFlip) {
        lastFlip = f;
        setFlip({ x: fx, y: fy, tagX: ftag });
      }
    };

    const over = (e: PointerEvent) => {
      const found = (e.target as Element | null)?.closest?.('[data-say]') ?? null;
      if (found !== suppressed) suppressed = null; // moved to something else
      const target = found && found !== suppressed ? found : null;
      if (target === hoverEl) return;
      hoverEl = target;
      clearTimeout(timer);
      if (!target) {
        setSay(null);
        return;
      }
      const text = target.getAttribute('data-say') ?? '';
      timer = setTimeout(() => setSay(text ? { text, key: ++n } : null), HOVER_DELAY);
    };

    // Leaving the window (or entering an iframe, which has its own cursor).
    const out = (e: PointerEvent) => {
      if (!e.relatedTarget) {
        setVisible(false);
        hoverEl = null;
        clearTimeout(timer);
        setSay(null);
      }
    };
    const down = (e: PointerEvent) => {
      setPressed(true);
      const clicked = (e.target as Element | null)?.closest?.('[data-say]');
      if (clicked) {
        suppressed = clicked;
        clearTimeout(timer);
        hoverEl = null;
        setSay(null);
      }
    };
    const up = () => setPressed(false);

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerout', out, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    const blur = () => setVisible(false);
    window.addEventListener('blur', blur);
    return () => {
      html.classList.remove('custom-cursor');
      clearTimeout(timer);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerout', out);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('blur', blur);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={root}
      aria-hidden
      // Above content and dialogs, below the hello splash (z-200) and tour (z-210).
      className={`pointer-events-none fixed left-0 top-0 z-[190] transition-opacity duration-150 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <svg
        width="20"
        height="22"
        viewBox="0 0 20 22"
        className={`-ml-[2px] -mt-[2px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-100 ${
          pressed ? 'scale-90' : 'scale-100'
        }`}
        style={{ transformOrigin: '2px 2px' }}
      >
        <path
          d={ARROW_PATH}
          fill={CURSOR_COLOR}
          stroke="var(--background)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>

      {/* "You" tag is always mounted and only fades while a bubble is open,
          so a fast hover can never leave the cursor without its tag. */}
      <NameTag
        label="You"
        flipX={flip.tagX}
        flipY={flip.y}
        reduce={Boolean(reduce)}
        hidden={Boolean(say)}
      />
      <AnimatePresence>
        {say && (
          <Bubble
            key={say.key}
            text={say.text}
            label="You"
            side={false}
            flipX={flip.x}
            flipY={flip.y}
            shiftX={BUBBLE_OFFSET.x}
            maxW={BUBBLE_W}
            reduce={Boolean(reduce)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
