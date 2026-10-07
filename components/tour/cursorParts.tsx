'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';

// Shared pieces of the Figma-style cursor, used by the guided tour
// (TourCursor, "Jaymark") and the visitor's own cursor (CursorFollower, "You").

export const TYPE_MS = 28; // per character
export const TYPE_START_DELAY = 220; // ms — matches the bubble's pop-in
// The bubble only reserves room for the next couple of characters — it hugs
// the typed text rather than the full message.
const LOOKAHEAD = 2;

// Monochrome: cursor, name tag and bubble use the theme's text colour, with
// the background colour for their text and outline, so they invert per theme.
export const CURSOR_COLOR = 'var(--foreground)';

// Bubble and name tag hug the end of the arrow's tail on whichever side they
// open: below-right by default, mirrored left/up when they wouldn't fit.
export const BUBBLE_OFFSET = { x: 14, y: 18 };

export function tagPosition(flipX: boolean, flipY: boolean): CSSProperties {
  return {
    ...(flipX ? { right: BUBBLE_OFFSET.x } : { left: BUBBLE_OFFSET.x }),
    ...(flipY ? { bottom: BUBBLE_OFFSET.y } : { top: BUBBLE_OFFSET.y }),
  };
}

// `side`: rail stops sit beside their 44px button, clear of the rail.
// `shiftX` slides a right-side bubble left so it stays on screen (phones).
export function bubblePosition(
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

/** The rounded Figma-style arrow path (tip near 2,2 in a 20×22 box). */
export const ARROW_PATH =
  'M4.01 2.9L16.36 8.46Q18 9.2 16.27 9.71L11.75 11.06Q10.6 11.4 10.17 12.52L8.25 17.52Q7.6 19.2 7.04 17.49L2.68 4.09Q2 2 4.01 2.9Z';

/** Small name pill that follows the arrow ("Jaymark" / "You"). */
export function NameTag({
  label,
  flipX,
  flipY,
  reduce,
  hidden = false,
}: {
  label: string;
  flipX: boolean;
  flipY: boolean;
  reduce: boolean;
  /** Fade out (stays mounted) — e.g. while a bubble is showing. */
  hidden?: boolean;
}) {
  return (
    <motion.span
      style={{ backgroundColor: CURSOR_COLOR, ...tagPosition(flipX, flipY) }}
      className="absolute whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold text-[var(--background)] shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={hidden ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      transition={{ duration: reduce ? 0 : 0.15 }}
    >
      {label}
    </motion.span>
  );
}

// Speech bubble that grows with the text as it types (width and height),
// anchored at the corner the cursor holds and growing away from it: to the
// right/down normally, mirrored to the left/up when flipped. The content
// (name label and text) is always left-aligned.
export function Bubble({
  text,
  label = 'Jaymark',
  side,
  flipX,
  flipY,
  shiftX,
  maxW,
  reduce,
}: {
  text: string;
  label?: string;
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
        <span className="block text-[11px] font-semibold opacity-60">{label}</span>
        <TypingText text={text} instant={reduce} />
      </div>
    </motion.div>
  );
}

// Types the message out character by character; the bubble resizes with it.
// The next couple of characters are laid out invisibly after the caret, so the
// bubble is always a step ahead of the letter about to appear.
export function TypingText({ text, instant }: { text: string; instant: boolean }) {
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
          <span
            className="ml-px inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-current align-baseline opacity-80"
            aria-hidden
          />
        )}
        {!done && (
          <span className="invisible">{chars.slice(count, count + LOOKAHEAD).join('')}</span>
        )}
      </span>
    </p>
  );
}
