'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

// Guided "cursor tour" in the style of bryllim.com: a fake cursor glides to
// each [data-tour] target and explains it in a speech bubble. Like the hello
// splash, it plays on every full page load, right after the splash.

type Step = { id: string; text: string; point?: 'text' | 'center' };

const STEPS: Step[] = [
  { id: 'profile', text: "Hey, I'm Jaymark! 👋 Let me show you around." },
  { id: 'cta', text: 'Follow me on GitHub or send me a message here 💬' },
  { id: 'highlights', text: 'Tap these to get to know me a little better ✨' },
  { id: 'experience', text: "Where I've been working lately 💼" },
  { id: 'recent', text: 'And what I’ve been listening to lately 🎶' },
  { id: 'featured', text: 'My favorite build 🏆 Tap it to read the full case study.' },
  { id: 'projects', text: 'My projects 🚀 Filter by category, or click one for details.' },
  { id: 'github', text: 'My GitHub activity 🔥 Hover a square or drag to scroll.' },
  { id: 'tools', text: 'The tools and tech I use day to day 🧰' },
  { id: 'availability', text: "Need something built? I'm open for work. Grab my CV here 📄" },
  // Floating rail — icon-only, so the cursor points at the button itself.
  { id: 'viewers', text: "These are people checking out the site right now 👀", point: 'center' },
  { id: 'spotify', text: "Here's my Spotify 🎧 When I'm listening, you'll see the song.", point: 'center' },
  { id: 'theme', text: 'Prefer light mode? ☀️ Switch themes here.', point: 'center' },
];

// Once per page load, same as the splash: navigating back to the homepage
// inside the site (no reload) doesn't replay it.
let playedThisLoad = false;
const START_DELAY = 0; // the splash signals the start 3s before it ends
// Said over the splash, before it fades, so visitors know a tour is coming.
const INTRO: Step = { id: 'intro', text: 'Psst… stick around, I’ll give you a quick tour 👀' };
const HOLD_MS = 2400; // after the text finishes typing
const TYPE_MS = 28; // per character
const BUBBLE_W = 240;
// Bubble and name tag hug the end of the (rotated) arrow's tail on whichever
// side they open: below-right by default, mirrored left/up when they wouldn't
// fit. Rail stops sit beside their 44px button, clear of the rail.
const BUBBLE_OFFSET = { x: 14, y: 18 };

function tagPosition(flipX: boolean, flipY: boolean): CSSProperties {
  return {
    ...(flipX ? { right: BUBBLE_OFFSET.x } : { left: BUBBLE_OFFSET.x }),
    ...(flipY ? { bottom: BUBBLE_OFFSET.y } : { top: BUBBLE_OFFSET.y }),
  };
}

// `shiftX` slides a right-side bubble left so it stays on screen (phones).
function bubblePosition(
  side: boolean,
  flipX: boolean,
  flipY: boolean,
  shiftX: number,
): CSSProperties {
  if (side) return { right: 34, bottom: 10 };
  const base = { ...tagPosition(flipX, flipY), ...(flipX ? {} : { left: shiftX }) };
  // Slid under the cursor: drop a little lower so the arrow doesn't overlap it.
  if (!flipX && !flipY && shiftX < 0) return { ...base, top: BUBBLE_OFFSET.y + 8 };
  if (!flipX && flipY && shiftX < 0) return { ...base, bottom: BUBBLE_OFFSET.y + 8 };
  return base;
}
// Only flip to the left when the cursor is right at the screen's edge (e.g.
// the bottom-right rail); otherwise the bubble stays on the right and slides
// left just enough to fit, so phones don't get every stop mirrored.
const FLIP_X_EDGE = 72;
const TAG_W = 80; // rough width of the "Jaymark" name tag
const BUBBLE_MAX_H = 150; // fully typed bubble, used to decide if it fits below
// Monochrome: cursor, name tag and bubble use the theme's text colour, with
// the background colour for their text and outline, so they invert per theme.
const CURSOR_COLOR = 'var(--foreground)';

type Point = { x: number; y: number };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

    // Bubble collapses first, then the cursor shrinks away.
    const stop = () => {
      if (!alive) return;
      alive = false;
      setBubble(false);
      setTimeout(() => setActive(false), reduce ? 0 : 180);
    };
    const onResize = () => {
      const s = STEPS[stepRef.current];
      const el = s && target(s.id);
      if (el) setPos(anchor(el, s.point));
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
        setPos(anchor(el, STEPS[i].point));
        await sleep(reduce ? 100 : 750);
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
          // Leaves by gliding off the left edge of the screen.
          exit={{
            x: -80,
            opacity: 0,
            transition: reduce
              ? { duration: 0 }
              : {
                  x: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.5, delay: 0.2 },
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
              // Same arrow with softened corners (quadratic curves at each vertex)
              d="M4.01 2.9L16.36 8.46Q18 9.2 16.27 9.71L11.75 11.06Q10.6 11.4 10.17 12.52L8.25 17.52Q7.6 19.2 7.04 17.49L2.68 4.09Q2 2 4.01 2.9Z"
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
              <motion.span
                key="name-tag"
                style={{ backgroundColor: CURSOR_COLOR, ...tagPosition(tagFlipX, flipY) }}
                className={`absolute whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold text-[var(--background)] shadow-[0_2px_6px_rgba(0,0,0,0.25)]`}
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

// Speech bubble that grows with the text as it types (width and height),
// anchored at the corner the cursor holds and growing away from it: to the
// right/down normally, mirrored to the left/up when flipped. The content
// ("Jaymark" label and text) is always left-aligned.
function Bubble({
  text,
  side,
  flipX,
  flipY,
  shiftX,
  maxW,
  reduce,
}: {
  text: string;
  side: boolean;
  flipX: boolean;
  flipY: boolean;
  shiftX: number;
  maxW: number;
  reduce: boolean;
}) {
  const live = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = live.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const corner = flipY
    ? flipX
      ? 'rounded-br-[4px]'
      : 'rounded-bl-[4px]'
    : flipX
      ? 'rounded-tr-[4px]'
      : 'rounded-tl-[4px]';
  const anchor: CSSProperties = {
    ...(flipX ? { right: 0 } : { left: 0 }),
    ...(flipY ? { bottom: 0 } : { top: 0 }),
  };

  return (
    <motion.div
      role="status"
      className={`absolute overflow-hidden rounded-[18px] text-[var(--background)] shadow-[0_6px_20px_rgba(0,0,0,0.25)] ${corner}`}
      style={{
        ...bubblePosition(side, flipX, flipY, shiftX),
        backgroundColor: CURSOR_COLOR,
        originX: flipX ? 1 : 0,
        originY: flipY ? 1 : 0,
      }}
      initial={{ opacity: 0, scale: 0.85, width: 0, height: 0 }}
      animate={{
        opacity: size ? 1 : 0,
        scale: size ? 1 : 0.85,
        width: size?.w ?? 0,
        height: size?.h ?? 0,
      }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: reduce ? 0 : 0.15 } }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              // Hugs the typed text: grows smoothly as each letter lands, kept
              // just ahead by the couple of upcoming characters it measures.
              width: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
              height: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
              scale: { type: 'spring', stiffness: 420, damping: 26 },
              opacity: { duration: 0.15 },
            }
      }
    >
      <div
        ref={live}
        className="absolute w-max px-3.5 py-2.5 text-left"
        style={{ ...anchor, maxWidth: maxW }}
      >
        <span className="block text-[11px] font-semibold opacity-60">Jaymark</span>
        <TypingText text={text} instant={reduce} />
      </div>
    </motion.div>
  );
}

// Types the message out character by character; the bubble resizes with it.
// The next couple of characters are laid out invisibly after the caret, so the
// bubble is always a step ahead of the letter about to appear.
// The bubble only reserves room for the next couple of characters — it hugs
// the typed text rather than the full message.
const LOOKAHEAD = 2;
const TYPE_START_DELAY = 220; // ms — matches the bubble's pop-in

function TypingText({ text, instant }: { text: string; instant: boolean }) {
  // Array.from keeps emoji (surrogate pairs) whole.
  const chars = Array.from(text);
  const [count, setCount] = useState(instant ? chars.length : 0);
  const done = count >= chars.length;

  useEffect(() => {
    if (instant) return;
    let id: ReturnType<typeof setInterval>;
    // Wait for the bubble to pop open before the first letter appears.
    const start = setTimeout(() => {
      id = setInterval(() => {
        setCount((c) => {
          if (c >= chars.length) {
            clearInterval(id);
            return c;
          }
          return c + 1;
        });
      }, TYPE_MS);
    }, TYPE_START_DELAY);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [chars.length, instant]);

  return (
    <p className="mt-0.5 text-sm font-medium leading-snug">
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {chars.slice(0, count).join('')}
        {!done && (
          <span className="ml-px inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-current opacity-80 align-baseline" aria-hidden />
        )}
        {!done && (
          <span className="invisible">{chars.slice(count, count + LOOKAHEAD).join('')}</span>
        )}
      </span>
    </p>
  );
}
