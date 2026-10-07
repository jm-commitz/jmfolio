'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNowPlaying } from './useNowPlaying';
import { useVisitorPlayback } from './visitorPlayback';
import { playlistUri } from './spotifyConfig';
import PlaylistEmbed from './PlaylistEmbed';

const SPOTIFY_GREEN = '#1DB954';
const PLAYLIST_URI = playlistUri();

function SpotifyLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

// Floating-rail Spotify button.
// - With a playlist configured (spotifyConfig.ts): clicking opens a mini player
//   (Spotify's embed) so visitors can play the playlist on their own device.
//   The embed loads on first open and stays alive when closed, so music keeps
//   playing.
// - Without one: playing → spinning album art linking to the song; idle → a
//   greyed logo that explains itself on hover.
export default function SpotifyRail() {
  const track = useNowPlaying();
  const playing = Boolean(track?.isPlaying);
  // What's spinning on the button: my live song, else the visitor's song from
  // the mini player.
  const visitor = useVisitorPlayback();
  const coverArt = playing
    ? track?.albumImageUrl
    : visitor.playing
      ? visitor.track?.albumImageUrl
      : undefined;
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // embed loaded at least once
  const wrap = useRef<HTMLDivElement>(null);

  // Close on Esc or a click outside (the iframe stays mounted).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  const toggle = () => {
    setMounted(true);
    setOpen((o) => !o);
  };

  const base =
    'relative inline-flex h-11 w-11 items-center justify-center rounded-full border bg-[var(--background)] shadow-lg transition-colors hover:bg-[var(--accent)]';

  const face = coverArt ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={coverArt}
      alt=""
      className="h-9 w-9 animate-[spin_6s_linear_infinite] rounded-full object-cover"
    />
  ) : (
    <SpotifyLogo
      className={`h-5 w-5 transition-colors ${
        playing || open
          ? 'text-[#1DB954]'
          : 'text-[var(--muted-foreground)] group-hover:text-[#1DB954]'
      }`}
    />
  );

  return (
    <div
      ref={wrap}
      data-tour="spotify"
      // Cursor bubble line (desktop); the hover card below covers keyboard/touch.
      data-say={
        playing && track?.title
          ? `Now playing: ${track.title} — ${track.artist} 🎧`
          : visitor.playing && visitor.track?.title
            ? `Playing: ${visitor.track.title} 🎶`
            : PLAYLIST_URI
              ? 'Play my playlist 🎧'
              : 'Nothing playing right now 🎧'
      }
      className="group relative"
    >
      {PLAYLIST_URI ? (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label={open ? 'Close music player' : 'Play my playlist'}
          className={base}
        >
          {face}
          {(playing || mounted) && (
            <span
              className={`absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[var(--background)] ${
                mounted && !playing ? 'animate-pulse' : ''
              }`}
              style={{ backgroundColor: SPOTIFY_GREEN }}
              aria-hidden
            />
          )}
        </button>
      ) : playing && track?.songUrl ? (
        <a
          href={track.songUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Now playing on Spotify: ${track.title} by ${track.artist}`}
          className={base}
        >
          {face}
          <span
            className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[var(--background)]"
            style={{ backgroundColor: SPOTIFY_GREEN }}
            aria-hidden
          />
        </a>
      ) : (
        <button type="button" aria-label="Spotify — nothing playing right now" className={base}>
          {face}
        </button>
      )}

      {/* Hover card, to the left of the rail (hidden while the player is open) */}
      {!open && (
        <div
          role="tooltip"
          // .hover-card: hidden on desktop, where the cursor bubble says it instead
          className="hover-card pointer-events-none absolute right-full top-1/2 mr-3 w-56 -translate-y-1/2 translate-x-1 rounded-xl border bg-[var(--background)] px-3 py-2 text-left opacity-0 shadow-lg transition duration-200 group-hover:translate-x-0 group-hover:opacity-100"
        >
          {playing ? (
            <>
              <p
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: SPOTIFY_GREEN }}
              >
                Now playing
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold text-[var(--foreground)]">
                {track?.title}
              </p>
              <p className="truncate text-xs text-[var(--muted-foreground)]">{track?.artist}</p>
              {PLAYLIST_URI && (
                <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
                  Click to play my playlist 🎧
                </p>
              )}
            </>
          ) : PLAYLIST_URI ? (
            <>
              <p className="text-sm font-semibold text-[var(--foreground)]">Play my playlist 🎧</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted-foreground)]">
                Listen right here, on your device.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-[var(--foreground)]">Nothing playing 🎧</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted-foreground)]">
                When Jaymark is listening on Spotify, the song shows up here.
              </p>
            </>
          )}
        </div>
      )}

      {/* Mini player — mounted on first open, then only hidden so music keeps playing */}
      {PLAYLIST_URI && mounted && (
        <motion.div
          role="dialog"
          aria-label="Jaymark's playlist"
          aria-hidden={!open}
          className={`absolute bottom-0 right-full mr-3 w-[min(340px,calc(100vw-96px))] overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--foreground)_10%,transparent)] bg-[color-mix(in_srgb,var(--background)_78%,transparent)] shadow-[0_24px_48px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_color-mix(in_srgb,var(--foreground)_8%,transparent)] backdrop-blur-2xl backdrop-saturate-150 ${
            open ? '' : 'pointer-events-none'
          }`}
          style={{ transformOrigin: 'bottom right' }}
          initial={false}
          animate={
            open
              ? { opacity: 1, scale: 1, y: 0, visibility: 'visible' }
              : {
                  opacity: 0,
                  scale: reduce ? 1 : 0.92,
                  y: reduce ? 0 : 8,
                  transitionEnd: { visibility: 'hidden' },
                }
          }
          transition={
            reduce
              ? { duration: 0.15 }
              : open
                ? { type: 'spring', stiffness: 420, damping: 30 }
                : { duration: 0.16, ease: 'easeIn' }
          }
        >
          <div className="flex items-start gap-2.5 px-3.5 pb-2.5 pt-3">
            <SpotifyLogo className="mt-0.5 h-5 w-5 shrink-0 text-[#1DB954]" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Jaymark&apos;s playlist
              </p>
              {playing && track?.title ? (
                <a
                  href={track.songUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:underline"
                >
                  Now playing: {track.title} — {track.artist}
                </a>
              ) : (
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Press play to listen here
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close music player"
              className="rounded-full p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-2.5">
            {/* Spotify embed via the IFrame API — reports play/pause so the
                avatar can switch to its music GIF while a visitor listens */}
            <PlaylistEmbed uri={PLAYLIST_URI} />
          </div>

          <p className="px-3.5 pb-3 pt-2 text-center text-[10px] text-[var(--muted-foreground)]">
            Log in to Spotify in this browser to hear full songs.
          </p>
        </motion.div>
      )}
    </div>
  );
}
