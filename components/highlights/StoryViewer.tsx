'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, Send, X } from 'lucide-react';
import type { Highlight } from './highlightsData';

const STORY_MS = 5000; // time per story before auto-advancing
const HOLD_MS = 220; // a press longer than this is a "hold to pause", not a tap
const MESSAGE_HREF = 'https://api.whatsapp.com/send?phone=639917944729';

// Instagram-style story viewer: full-bleed 9:16 card, auto-advancing progress
// bars, tap left/right to go back/forward, press and hold to pause, swipe down
// (or Esc) to close. Portaled to <body> so no stacking context can trap it.
export default function StoryViewer({
  stories,
  startIndex,
  onClose,
}: {
  stories: Highlight[];
  startIndex: number;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const elapsed = useRef(0);
  const pressAt = useRef(0);

  const goTo = useCallback(
    (i: number) => {
      if (i >= stories.length) return onClose();
      elapsed.current = 0;
      setProgress(0);
      setIndex(Math.max(0, i));
    },
    [stories.length, onClose],
  );

  // Progress clock — runs unless paused (button) or held (press and hold).
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!paused && !held) {
        elapsed.current += dt;
        const p = elapsed.current / STORY_MS;
        if (p >= 1) {
          goTo(index + 1);
          return;
        }
        setProgress(p);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, paused, held, goTo]);

  // Keyboard + page scroll lock.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(index + 1);
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, goTo, onClose]);

  // Preload the next image so it's ready when the story changes.
  useEffect(() => {
    const next = stories[index + 1]?.image;
    if (next) new Image().src = next;
  }, [index, stories]);

  const story = stories[index];

  // Tap zones: a quick press navigates; a long press only pauses.
  const press = () => {
    pressAt.current = performance.now();
    setHeld(true);
  };
  const release = (dir: 1 | -1) => {
    setHeld(false);
    if (performance.now() - pressAt.current < HOLD_MS) goTo(index + dir);
  };

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={story.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
    >
      {/* Desktop: close + side arrows outside the card */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close stories"
        className="absolute right-5 top-5 hidden rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white sm:block"
      >
        <X className="h-6 w-6" />
      </button>
      {/* Card with side arrows (desktop) in one centered row */}
      <div className="flex h-full w-full items-center justify-center sm:h-auto sm:w-auto sm:gap-5">
        <SideArrow side="left" hidden={index === 0} onClick={() => goTo(index - 1)} />

        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="relative h-full w-full overflow-hidden bg-black sm:aspect-[9/16] sm:h-[min(88vh,820px)] sm:w-auto sm:rounded-2xl"
          initial={{ scale: reduce ? 1 : 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          // Swipe down to close (phones)
          drag={reduce ? false : 'y'}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragStart={() => setHeld(true)}
          onDragEnd={(_, info) => {
            setHeld(false);
            if (info.offset.y > 120 || info.velocity.y > 600) onClose();
          }}
        >
          {/* Media */}
          <AnimatePresence initial={false}>
            <motion.div
              key={story.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.35 }}
            >
              {story.image ? (
                 
                <motion.img
                  src={story.image}
                  alt=""
                  className="h-full w-full object-cover grayscale"
                  // Slow Ken Burns push-in while the story plays
                  initial={{ scale: 1 }}
                  animate={{ scale: reduce ? 1 : 1.08 }}
                  transition={{ duration: STORY_MS / 1000, ease: 'linear' }}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-neutral-700 via-neutral-900 to-black" />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Readability gradients */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Tap zones: left third = back, right two-thirds = forward; hold = pause */}
          <div className="absolute inset-0 z-10 flex">
            <button
              type="button"
              aria-label="Previous story"
              className="h-full w-1/3 cursor-default"
              onPointerDown={press}
              onPointerUp={() => release(-1)}
              onPointerLeave={() => setHeld(false)}
            />
            <button
              type="button"
              aria-label="Next story"
              className="h-full w-2/3 cursor-default"
              onPointerDown={press}
              onPointerUp={() => release(1)}
              onPointerLeave={() => setHeld(false)}
            />
          </div>

          {/* Top: progress bars + header */}
          <div className="absolute inset-x-0 top-0 z-20 px-3 pt-3">
            <div className="flex gap-1">
              {stories.map((s, i) => (
                <span
                  key={s.id}
                  className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35"
                >
                  <span
                    className="block h-full rounded-full bg-white"
                    style={{
                      width: `${(i < index ? 1 : i === index ? progress : 0) * 100}%`,
                    }}
                  />
                </span>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero/hero.png"
                alt=""
                className="h-8 w-8 rounded-full object-cover ring-1 ring-white/40 grayscale"
              />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-sm font-semibold text-white">jaymark</p>
                <p className="truncate text-xs text-white/70">{story.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Play' : 'Pause'}
                className="rounded-full p-1.5 text-white/90 transition hover:bg-white/10"
              >
                {paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-white/90 transition hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Story text */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={story.id}
              className="pointer-events-none absolute inset-x-0 bottom-24 z-20 px-6 text-[22px] font-semibold leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              initial={{ opacity: 0, y: reduce ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : 0.1 }}
            >
              {story.body}
            </motion.p>
          </AnimatePresence>

          {/* Reply bar, like Instagram's "Send message" */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 px-4 pb-5 pt-2">
            <a
              href={MESSAGE_HREF}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-full border border-white/50 px-4 py-2.5 text-sm text-white/80 transition hover:border-white hover:text-white"
            >
              Send message…
            </a>
            <a
              href={MESSAGE_HREF}
              target="_blank"
              rel="noreferrer"
              aria-label="Send message"
              className="text-white transition hover:scale-110"
            >
              <Send className="h-6 w-6" />
            </a>
          </div>
        </motion.div>

        <SideArrow
          side="right"
          hidden={index === stories.length - 1}
          onClick={() => goTo(index + 1)}
        />
      </div>
    </motion.div>,
    document.body,
  );
}

// Desktop-only round arrow beside the card. Keeps its space when hidden so
// the card stays centered.
function SideArrow({
  side,
  hidden,
  onClick,
}: {
  side: 'left' | 'right';
  hidden: boolean;
  onClick: () => void;
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={side === 'left' ? 'Previous story' : 'Next story'}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition hover:bg-white sm:flex ${
        hidden ? 'invisible' : ''
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
