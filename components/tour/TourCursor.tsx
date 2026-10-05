'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

// Guided "cursor tour" in the style of bryllim.com: a fake cursor glides to
// each [data-tour] target and explains it in a speech bubble. Plays once, on
// the visitor's first visit, after the hello splash.

type Step = { id: string; text: string; point?: 'text' | 'center' };

const STEPS: Step[] = [
  { id: 'profile', text: "Hey, I'm Jaymark! 👋 Let me show you around." },
  { id: 'cta', text: 'Follow me on GitHub or send me a message here 💬' },
  { id: 'highlights', text: 'Tap these to get to know me a little better ✨' },
  { id: 'experience', text: "Where I've been working lately 💼" },
  { id: 'projects', text: 'My projects 🚀 Filter by category, or click one for details.' },
  { id: 'tools', text: 'The tools and tech I use day to day 🧰' },
  { id: 'github', text: 'My GitHub activity 🔥 Hover a square or drag to scroll.' },
  // Floating rail — icon-only, so the cursor points at the button itself.
  { id: 'viewers', text: "These are people checking out the site right now 👀", point: 'center' },
  { id: 'spotify', text: "Here's my Spotify 🎧 When I'm listening, you'll see the song.", point: 'center' },
  { id: 'theme', text: 'Prefer light mode? ☀️ Switch themes here.', point: 'center' },
];

const STORAGE_KEY = 'tourSeen';
const START_DELAY = 800;
const HOLD_MS = 2400; // after the text finishes typing
const TYPE_MS = 28; // per character
const BUBBLE_W = 240;
// Figma's multiplayer purple — cursor, name tag and chat bubble share it.
const CURSOR_COLOR = '#7B61FF';

type Point = { x: number; y: number };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function target(id: string) {
  return document.querySelector<HTMLElement>(`[data-tour="${id}"]`);
}

// Cursor tip lands right after the last letter of the target's text. Sections
// point at their heading ("Experience", "GitHub"…); other targets at their last
// visible text (e.g. the "Message" button label).
function lastTextRect(root: HTMLElement): DOMRect | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let last: DOMRect | null = null;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = range.getClientRects();
    const rect = rects[rects.length - 1];
    if (rect && rect.width > 0) last = rect; // skips hidden text
  }
  return last;
}

function anchor(el: HTMLElement, point: Step['point'] = 'text'): Point {
  if (point === 'center') {
    const b = el.getBoundingClientRect();
    return { x: b.left + b.width * 0.55, y: b.top + b.height * 0.6 };
  }
  const scope = el.matches('h1, h2') ? el : el.querySelector<HTMLElement>('h1, h2') ?? el;
  const r = lastTextRect(scope) ?? el.getBoundingClientRect();
  const x = r.right + 2;
  const y = r.top + r.height * 0.6;
  return {
    x: Math.max(8, Math.min(x, window.innerWidth - 24)),
    y: Math.max(8, Math.min(y, window.innerHeight - 24)),
  };
}

export default function TourCursor() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(-1);
  const [pos, setPos] = useState<Point | null>(null);
  const [bubble, setBubble] = useState(false);
  const reduce = useReducedMotion();
  const bubbleRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(-1);

  // Start once, after the splash has uncovered the page.
  useEffect(() => {
    let seen = false;
    try {
      seen = Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {}
    if (seen) return;

    let timer: ReturnType<typeof setTimeout>;
    const start = () => {
      timer = setTimeout(() => {
        // Marked at start so a reload mid-tour doesn't replay it.
        try {
          localStorage.setItem(STORAGE_KEY, '1');
        } catch {}
        setActive(true);
      }, START_DELAY);
    };

    if (document.documentElement.dataset.splashDone) start();
    else window.addEventListener('hello-splash-done', start, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hello-splash-done', start);
    };
  }, []);

  // Run the steps; any visitor interaction ends the tour.
  useEffect(() => {
    if (!active) return;
    let alive = true;

    const stop = () => {
      if (!alive) return;
      alive = false;
      setBubble(false);
      setActive(false);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!bubbleRef.current?.contains(e.target as Node)) stop();
    };
    const onResize = () => {
      const s = STEPS[stepRef.current];
      const el = s && target(s.id);
      if (el) setPos(anchor(el, s.point));
    };

    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchmove', stop, { passive: true });
    window.addEventListener('keydown', stop);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', onResize);

    (async () => {
      await sleep(0);
      // Enter from the bottom-right corner.
      setPos({ x: window.innerWidth - 48, y: window.innerHeight - 48 });
      await sleep(300);

      for (let i = 0; i < STEPS.length && alive; i++) {
        const el = target(STEPS[i].id);
        if (!el) continue; // e.g. GitHub section failed to load

        setBubble(false);
        const r = el.getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight) {
          el.scrollIntoView({
            behavior: reduce ? 'auto' : 'smooth',
            block: r.height > window.innerHeight * 0.6 ? 'start' : 'center',
          });
          await sleep(reduce ? 50 : 700);
        }
        if (!alive) return;

        stepRef.current = i;
        setStep(i);
        setPos(anchor(el, STEPS[i].point));
        await sleep(reduce ? 100 : 750);
        if (!alive) return;

        setBubble(true);
        // Hold long enough to finish typing, then a beat to read it.
        await sleep((reduce ? 0 : Array.from(STEPS[i].text).length * TYPE_MS) + HOLD_MS);
      }
      stop();
    })();

    return () => {
      alive = false;
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', stop);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', onResize);
    };
  }, [active, reduce]);

  const current = STEPS[step];
  // Flip the bubble left/up when it would run off-screen.
  const flipX = pos ? pos.x + 20 + BUBBLE_W > window.innerWidth - 8 : false;
  const flipY = pos ? pos.y + 140 > window.innerHeight : false;

  return (
    <AnimatePresence>
      {active && pos && (
        <motion.div
          key="tour-cursor"
          className="pointer-events-none fixed left-0 top-0 z-[120]"
          initial={{ opacity: 0, x: pos.x, y: pos.y }}
          animate={{ opacity: 1, x: pos.x, y: pos.y }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: 'spring', stiffness: 90, damping: 18, mass: 0.9, opacity: { duration: 0.3 } }
          }
        >
          {/* Figma-style multiplayer arrow — tip at (0, 0) */}
          <svg
            width="20"
            height="22"
            viewBox="0 0 20 22"
            className="-ml-[2px] -mt-[2px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
            aria-hidden
          >
            <path
              d="M2 2L18 9.2L10.6 11.4L7.6 19.2L2 2Z"
              fill={CURSOR_COLOR}
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>

          {/* Name tag while gliding; swaps for the chat bubble at each stop */}
          <AnimatePresence mode="wait">
            {bubble && current ? (
              <motion.div
                ref={bubbleRef}
                key={current.id}
                role="status"
                className={`pointer-events-auto absolute rounded-[18px] px-3.5 py-2.5 text-white shadow-[0_6px_20px_rgba(0,0,0,0.25)] ${
                  flipY ? (flipX ? 'rounded-br-[4px]' : 'rounded-bl-[4px]') : flipX ? 'rounded-tr-[4px]' : 'rounded-tl-[4px]'
                }`}
                style={{
                  width: BUBBLE_W,
                  backgroundColor: CURSOR_COLOR,
                  ...(flipX ? { right: 6 } : { left: 14 }),
                  ...(flipY ? { bottom: 6 } : { top: 20 }),
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
                transition={{ duration: reduce ? 0 : 0.2, ease: 'easeOut' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white/75">Jaymark</span>
                  <span className="text-[10px] tabular-nums text-white/60">
                    {step + 1}/{STEPS.length}
                  </span>
                </div>
                <TypingText text={current.text} instant={Boolean(reduce)} />
                <button
                  type="button"
                  onClick={() => setActive(false)}
                  className="mt-1.5 text-[11px] font-semibold text-white/70 underline-offset-2 transition-colors hover:text-white hover:underline"
                >
                  Skip tour
                </button>
              </motion.div>
            ) : (
              <motion.span
                key="name-tag"
                className="absolute left-[14px] top-[18px] whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
                style={{ backgroundColor: CURSOR_COLOR }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: reduce ? 0 : 0.15 }}
              >
                Jaymark
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Types the message out character by character. The full text is laid out
// invisibly underneath so the bubble keeps its final size while typing.
function TypingText({ text, instant }: { text: string; instant: boolean }) {
  // Array.from keeps emoji (surrogate pairs) whole.
  const chars = Array.from(text);
  const [count, setCount] = useState(instant ? chars.length : 0);
  const done = count >= chars.length;

  useEffect(() => {
    if (instant) return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= chars.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, TYPE_MS);
    return () => clearInterval(id);
  }, [chars.length, instant]);

  return (
    <p className="mt-0.5 grid text-sm font-medium leading-snug">
      <span className="invisible col-start-1 row-start-1" aria-hidden>
        {text}
      </span>
      <span className="sr-only">{text}</span>
      <span className="col-start-1 row-start-1" aria-hidden>
        {chars.slice(0, count).join('')}
        {!done && (
          <span className="ml-px inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-white/80 align-baseline" aria-hidden />
        )}
      </span>
    </p>
  );
}
