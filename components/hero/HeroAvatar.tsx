'use client';

import { useRef, useState } from 'react';
import AchievementToast from './AchievementToast';
import Image from 'next/image';
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { githubAvatar } from '@/lib/github';
import NowPlaying from '@/components/spotify/NowPlaying';
import { useNowPlaying, type AvatarMood } from '@/components/spotify/useNowPlaying';
import { useVisitorPlayback } from '@/components/spotify/visitorPlayback';

// Filenames are case-sensitive on Vercel — party is .gif, the others .GIF.
const MOOD_AVATARS: Record<AvatarMood, string> = {
  party: '/hero/party.gif',
  rock: '/hero/rock.GIF',
  normal: '/hero/normal.GIF',
};

// Click the photo → "Achievement unlocked" toast + emoji confetti.
const SECRET_CLICKS = 1;
const CLICK_GAP_MS = 1200; // max pause between clicks before the count resets
const CELEBRATE_MS = 4200; // toast on screen; the ring spins fast meanwhile
const STORAGE_KEY = 'achievement:curious-clicker';
const CONFETTI = ['🎉', '✨', '🔥', '🕺', '💃', '🎶', '👋'];

type Bit = { id: number; emoji: string; x: number; y: number; rotate: number; scale: number };

export default function HeroAvatar() {
  const track = useNowPlaying();
  // A visitor playing my playlist in the rail's mini player also counts —
  // the avatar switches to its music GIF either way. My own live track wins
  // for the mood when both are playing.
  const visitor = useVisitorPlayback();
  const ownerPlaying = Boolean(track?.isPlaying);
  const reduce = useReducedMotion();

  const [celebrating, setCelebrating] = useState(false);
  const [repeat, setRepeat] = useState(false); // unlocked on an earlier visit/try
  const [confetti, setConfetti] = useState<Bit[]>([]);
  const clicks = useRef({ count: 0, last: 0 });
  const squish = useAnimationControls();

  const isPlaying = ownerPlaying || visitor.playing;
  const mood: AvatarMood = ownerPlaying ? (track?.mood ?? 'normal') : visitor.mood;

  const onClick = () => {
    if (!reduce) {
      squish.start({ scale: [1, 0.9, 1.04, 1], transition: { duration: 0.35 } });
    }
    if (celebrating) return;

    const now = Date.now();
    const c = clicks.current;
    c.count = now - c.last > CLICK_GAP_MS ? 1 : c.count + 1;
    c.last = now;
    if (c.count < SECRET_CLICKS) return;

    c.count = 0;
    // Unlocks once per visitor (remembered in their browser); later tries
    // still celebrate, with an "already unlocked" line.
    let seen = false;
    try {
      seen = localStorage.getItem(STORAGE_KEY) === '1';
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {}
    setRepeat(seen);
    setCelebrating(true);
    setConfetti(
      Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 60 + Math.random() * 80;
        return {
          id: now + i,
          emoji: CONFETTI[i % CONFETTI.length],
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          rotate: (Math.random() - 0.5) * 120,
          scale: 0.8 + Math.random() * 0.6,
        };
      }),
    );
    setTimeout(() => setConfetti([]), 1300);
    setTimeout(() => setCelebrating(false), CELEBRATE_MS);
  };

  return (
    <div className="group relative shrink-0">
      {/* Spotify now playing — absolutely positioned layer, reserves no space */}
      <div className="absolute bottom-full left-1 z-10 mb-1.5 origin-bottom-left lg:mb-3 lg:scale-150">
        {/* My live song first; otherwise what the visitor is playing */}
        <NowPlaying
          track={ownerPlaying ? track : visitor.playing && visitor.track ? visitor.track : null}
        />
      </div>

      {/* Breathing glow ring — shows on hover/focus, spins fast while celebrating */}
      <span
        aria-hidden
        className={`avatar-ring pointer-events-none absolute -inset-[5px] rounded-full transition duration-300 lg:-inset-[7px] ${
          celebrating
            ? 'avatar-ring--party scale-100 opacity-100'
            : 'scale-95 opacity-0 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100'
        }`}
      >
        <span className="avatar-ring__spin absolute inset-0 rounded-full" />
      </span>

      <motion.button
        type="button"
        onClick={onClick}
        animate={squish}
        aria-label="Jaymark Ancheta — click me"
        data-say="That's me 👋 Click me!"
        // Monochrome circle behind the photo and the music GIF alike
        className="avatar-backdrop relative block h-14 w-14 overflow-hidden rounded-full outline-none sm:h-16 sm:w-16 lg:h-44 lg:w-44"
      >
        <Image
          // Live GitHub avatar (see githubAvatar) — loaded straight from GitHub
          src={githubAvatar(352)}
          unoptimized
          alt="Jaymark Ancheta"
          fill
          priority
          sizes="(min-width: 1024px) 176px, 64px"
          className={`object-cover grayscale-[60%] transition-opacity duration-500 ${
            isPlaying ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {/* Music mode — the GIF depends on the mood.
            key remounts on mood change so the new GIF starts at frame one. */}
        <Image
          key={mood}
          src={MOOD_AVATARS[mood]}
          alt=""
          aria-hidden
          fill
          unoptimized
          sizes="(min-width: 1024px) 176px, 64px"
          className={`scale-75 object-contain transition-opacity duration-500 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </motion.button>

      {/* Emoji confetti bursting out of the photo */}
      <AnimatePresence>
        {confetti.map((b) => (
          <motion.span
            key={b.id}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 -ml-3 -mt-3 text-2xl"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
            animate={
              reduce
                ? { opacity: [0, 1, 0] }
                : { x: b.x, y: b.y, opacity: [0, 1, 1, 0], scale: b.scale, rotate: b.rotate }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {b.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      <AchievementToast show={celebrating} repeat={repeat} />
    </div>
  );
}
