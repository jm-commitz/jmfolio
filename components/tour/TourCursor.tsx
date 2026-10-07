'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ARROW_PATH,
  BUBBLE_OFFSET,
  Bubble,
  CURSOR_COLOR,
  NameTag,
  TYPE_MS,
  TYPE_START_DELAY,
} from './cursorParts';

// Guided "cursor tour" in the style of bryllim.com: a fake cursor glides to
// each [data-tour] target and explains it in a speech bubble. Like the hello
// splash, it plays on every full page load, right after the splash.

type Step = { id: string; text: string; point?: 'text' | 'center' };

const STEPS: Step[] = [
  { id: 'profile', text: "Hey, I'm Jaymark! 👋 Let me show you around." },
  { id: 'cta', text: 'Follow me on GitHub or send me a message here 💬' },
  { id: 'highlights', text: 'Tap these to get to know me a little better ✨' },
  { id: 'experience', text: "Where I've been working lately 💼" },
  { id: 'availability', text: "Need something built? I'm open for work. Grab my CV here 📄" },
  { id: 'recent', text: 'And what I’ve been listening to lately 🎶' },
  { id: 'featured', text: 'My favorite build 🏆 Tap it to read the full case study.' },
  { id: 'projects', text: 'My projects 🚀 Filter by category, or click one for details.' },
  { id: 'github', text: 'My GitHub activity 🔥 Hover a dot or drag to scroll.' },
  { id: 'tools', text: 'The tools and tech I use day to day 🧰' },
  // Floating rail — icon-only, so the cursor points at the button itself.
  { id: 'viewers', text: "These are people checking out the site right now 👀", point: 'center' },
  { id: 'spotify', text: "Here's my Spotify 🎧 Tap to play my playlist right here.", point: 'center' },
  { id: 'theme', text: 'Prefer light mode? ☀️ Switch themes here.', point: 'center' },
];

// Once per page load, same as the splash: navigating back to the homepage
// inside the site (no reload) doesn't replay it.
let playedThisLoad = false;
const START_DELAY = 0; // the splash signals the start 3s before it ends
// Said over the splash, before it fades, so visitors know a tour is coming.
const INTRO: Step = { id: 'intro', text: 'Psst… stick around, I’ll give you a quick tour 👀' };
const HOLD_MS = 2400; // after the text finishes typing
const BUBBLE_W = 240;
// Only flip to the left when the cursor is right at the screen's edge (e.g.
// the bottom-right rail); otherwise the bubble stays on the right and slides
// left just enough to fit, so phones don't get every stop mirrored.
const FLIP_X_EDGE = 72;
const TAG_W = 80; // rough width of the "Jaymark" name tag
const BUBBLE_MAX_H = 150; // fully typed bubble, used to decide if it fits below
type Point = { x: number; y: number };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Spotlight: the text the cursor points at smoothly enlarges, then settles
// back when the cursor moves on. Uses the CSS `scale` property (not
// `transform`) so it never fights ScrollColumn's scroll-fade transforms.
type Saved = {
  scale: string;
  transition: string;
  zIndex: string;
  position: string;
  transformOrigin: string;
  display: string;
};
const saved = new WeakMap<HTMLElement, Saved>();

function spotlight(el: HTMLElement) {
  if (!saved.has(el)) {
    saved.set(el, {
      scale: el.style.scale,
      transition: el.style.transition,
      zIndex: el.style.zIndex,
      position: el.style.position,
      transformOrigin: el.style.transformOrigin,
      display: el.style.display,
    });
  }
  const cs = getComputedStyle(el);
  // scale doesn't apply to plain inline elements.
  if (cs.display === 'inline') el.style.display = 'inline-block';
  // Size from the text itself, so a word in a wide block still pops.
  const range = document.createRange();
  range.selectNodeContents(el);
  const tr = range.getBoundingClientRect();
  const r = tr.width > 0 ? tr : el.getBoundingClientRect();
  const amount = 1 + Math.min(0.12, 16 / Math.max(r.width, r.height, 1));
  // Grow from where the text sits, so it doesn't drift sideways.
  el.style.transformOrigin =
    cs.textAlign === 'center' || cs.justifyContent === 'center' ? 'center' : 'left center';
  if (cs.position === 'static') el.style.position = 'relative';
  el.style.zIndex = '15';
  el.style.transition = 'scale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  el.style.scale = String(amount);
}

function unspotlight(el: HTMLElement) {
  const prev = saved.get(el);
  if (!prev) return;
  el.style.transition = 'scale 0.35s ease-out';
  el.style.scale = '1';
  const restore = () => {
    // Only restore if it hasn't been spotlit again in the meantime.
    if (el.style.scale !== '1') return;
    el.style.scale = prev.scale;
    el.style.transition = prev.transition;
    el.style.zIndex = prev.zIndex;
    el.style.position = prev.position;
    el.style.transformOrigin = prev.transformOrigin;
    el.style.display = prev.display;
    saved.delete(el);
  };
  el.addEventListener('transitionend', restore, { once: true });
  setTimeout(restore, 400);
}

// Resolves once the hello splash has faded (or after a safety timeout).
function splashGone() {
  return new Promise<void>((resolve) => {
    if (document.documentElement.dataset.splashDone) return resolve();
    window.addEventListener('hello-splash-done', () => resolve(), { once: true });
    setTimeout(resolve, 6000);
  });
}

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

/**
 * What to enlarge for a step: the element holding the exact text the cursor
 * points at (the name, a heading, a button label) — not the whole section.
 * Icon-only stops (point: 'center') enlarge the element itself.
 */
function customSpot(id: string) {
  return document.querySelector<HTMLElement>(`[data-tour-spot="${id}"]`);
}

function spotTarget(el: HTMLElement, step: Step): HTMLElement {
  // A stop can name its own group to enlarge, e.g. the name + verified badge.
  const custom = customSpot(step.id);
  if (custom) return custom;
  const point = step.point ?? 'text';
  if (point === 'center') return el;
  const scope = el.matches('h1, h2') ? el : (el.querySelector<HTMLElement>('h1, h2') ?? el);
  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
  let holder: HTMLElement | null = null;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim() || !node.parentElement) continue;
    if (node.parentElement.getClientRects().length) holder = node.parentElement;
  }
  return holder ?? el;
}

/** Where to point for a step: past a custom spot group, else the usual anchor. */
function stepAnchor(el: HTMLElement, step: Step): Point {
  const custom = customSpot(step.id);
  if (custom) {
    const b = custom.getBoundingClientRect();
    return {
      x: Math.max(8, Math.min(b.right + 2, window.innerWidth - 24)),
      y: Math.max(8, Math.min(b.top + b.height * 0.6, window.innerHeight - 24)),
    };
  }
  return anchor(el, step.point);
}

function anchor(el: HTMLElement, point: Step['point'] = 'text'): Point {
  if (point === 'center') {
    const b = el.getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
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
  const stepRef = useRef(-1);

  // Start as soon as "hello" finishes drawing — over the splash, before it
  // fades — so visitors see the tour coming.
  useEffect(() => {
    if (playedThisLoad) return;

    let timer: ReturnType<typeof setTimeout>;
    const start = () => {
      timer = setTimeout(() => {
        playedThisLoad = true;
        setActive(true);
      }, START_DELAY);
    };

    const { splashDrawn, splashDone } = document.documentElement.dataset;
    if (splashDrawn || splashDone) start();
    else window.addEventListener('hello-splash-drawn', start, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hello-splash-drawn', start);
    };
  }, []);

  // Run the steps; any visitor interaction ends the tour.
  useEffect(() => {
    if (!active) return;
    let alive = true;
    let lit: HTMLElement | null = null; // element currently enlarged
    const release = () => {
      if (lit) unspotlight(lit);
      lit = null;
    };

    // Bubble collapses first, then the cursor shrinks away.
    const stop = () => {
      if (!alive) return;
      alive = false;
      release();
      setBubble(false);
      setTimeout(() => setActive(false), reduce ? 0 : 180);
    };
    const onResize = () => {
      const s = STEPS[stepRef.current];
      const el = s && target(s.id);
      if (el) setPos(stepAnchor(el, s));
    };

    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchmove', stop, { passive: true });
    window.addEventListener('keydown', stop);
    window.addEventListener('pointerdown', stop);
    window.addEventListener('resize', onResize);

    (async () => {
      await sleep(0);

      if (!document.documentElement.dataset.splashDone) {
        // Intro over the splash: pop in right after the end of "hello", say a
        // tour is coming, then carry on once the splash has faded.
        const helloW = Math.min(window.innerWidth * 0.7, 480);
        setPos({
          x: Math.min(window.innerWidth / 2 + helloW * 0.47, window.innerWidth - 24),
          y: window.innerHeight / 2 - helloW * 0.04,
        });
        await sleep(reduce ? 0 : 450);
        if (!alive) return;
        setBubble(true);
        await splashGone();
        if (!alive) return;
        setBubble(false);
        await sleep(reduce ? 0 : 250);
      } else {
        // Pop in near the bottom-right corner, then glide to the first stop.
        setPos({ x: window.innerWidth - 72, y: window.innerHeight - 72 });
        await sleep(reduce ? 0 : 550);
      }

      for (let i = 0; i < STEPS.length && alive; i++) {
        const el = target(STEPS[i].id);
        // Missing (e.g. GitHub failed to load) or tucked inside the collapsed rail.
        if (!el || el.closest('[data-collapsed="true"]')) continue;

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
        // Glide to the target first; the previous text settles back as we leave.
        release();
        setPos(stepAnchor(el, STEPS[i]));
        await sleep(reduce ? 100 : 650);
        if (!alive) return;
        // Arrived: only now does the pointed text enlarge, and the cursor
        // follows its growing edge so it stays right at the end of the text.
        if (!reduce) {
          const spot = spotTarget(el, STEPS[i]);
          spotlight(spot);
          lit = spot;
          await sleep(220);
          if (!alive) return;
          setPos(stepAnchor(el, STEPS[i]));
          await sleep(200);
        }
        if (!alive) return;

        setBubble(true);
        // Hold long enough to finish typing, then a beat to read it.
        await sleep(
          (reduce ? 0 : TYPE_START_DELAY + Array.from(STEPS[i].text).length * TYPE_MS) + HOLD_MS,
        );
      }
      stop();
    })();

    return () => {
      alive = false;
      release();
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', stop);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('resize', onResize);
    };
  }, [active, reduce]);

  const current = step === -1 ? INTRO : STEPS[step];
  // Rail buttons (point: 'center') hug the bottom-right corner, so their bubble
  // opens beside the button, to its left, instead of stacking over the rail.
  const side = current?.point === 'center';
  // Otherwise flip the bubble left/up when it wouldn't fit on screen. Uses the
  // bubble's worst-case (fully typed) height so it never grows past the edge.
  const vw = pos ? window.innerWidth : 0;
  const bubbleMaxW = Math.min(BUBBLE_W, vw - 24);
  const flipX = side || (pos ? pos.x > vw - FLIP_X_EDGE : false);
  // Right-side bubble: as far left as needed to keep its full width on screen.
  const shiftX = pos ? Math.min(BUBBLE_OFFSET.x, vw - 12 - pos.x - bubbleMaxW) : 0;
  const tagFlipX = flipX || (pos ? pos.x + BUBBLE_OFFSET.x + TAG_W > vw - 8 : false);
  const flipY =
    side || (pos ? pos.y + BUBBLE_OFFSET.y + BUBBLE_MAX_H > window.innerHeight - 8 : false);
  // The arrow turns with the bubble so its tail always leads into it: up-left
  // normally, up-right when the bubble opens left, down-left when it opens
  // upward near the bottom, down-right for both.
  const rotate = flipX ? (flipY ? 180 : 90) : flipY ? -90 : 0;

  return (
    <AnimatePresence>
      {active && pos && (
        <motion.div
          key="tour-cursor"
          className="pointer-events-none fixed left-0 top-0 z-[210]" // above the splash (z-200)
          // Scales about the cursor tip: pops in, shrinks away on exit.
          style={{ originX: 0, originY: 0 }}
          initial={{ opacity: 0, scale: 0.4, x: pos.x, y: pos.y }}
          animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y }}
          // Leaves slowly, drifting off the screen at the centre of the left edge.
          exit={{
            x: -80,
            y: pos ? window.innerHeight / 2 : 0,
            opacity: 0,
            transition: reduce
              ? { duration: 0 }
              : {
                  x: { duration: 1.8, ease: [0.45, 0, 0.25, 1] },
                  y: { duration: 1.8, ease: [0.45, 0, 0.25, 1] },
                  opacity: { duration: 0.8, delay: 1.0 },
                },
          }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  type: 'spring',
                  stiffness: 90,
                  damping: 18,
                  mass: 0.9,
                  opacity: { duration: 0.3 },
                  scale: { type: 'spring', stiffness: 260, damping: 18 },
                }
          }
        >
          {/* Figma-style multiplayer arrow — tip at (0, 0), rotated about the tip */}
          <motion.svg
            width="20"
            height="22"
            viewBox="0 0 20 22"
            className="-ml-[2px] -mt-[2px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
            style={{ originX: '2px', originY: '2px' }}
            animate={{ rotate }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 20 }}
            aria-hidden
          >
            <path
              d={ARROW_PATH}
              fill={CURSOR_COLOR}
              stroke="var(--background)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </motion.svg>

          {/* Name tag while gliding; swaps for the chat bubble at each stop */}
          <AnimatePresence mode="wait">
            {bubble && current ? (
              <Bubble
                key={current.id}
                text={current.text}
                side={side}
                flipX={flipX}
                flipY={flipY}
                shiftX={shiftX}
                maxW={bubbleMaxW}
                reduce={Boolean(reduce)}
              />
            ) : (
              <NameTag
                key="name-tag"
                label="Jaymark"
                flipX={tagFlipX}
                flipY={flipY}
                reduce={Boolean(reduce)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
