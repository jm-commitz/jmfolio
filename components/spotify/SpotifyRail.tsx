'use client';

import { useNowPlaying } from './useNowPlaying';

const SPOTIFY_GREEN = '#1DB954';

function SpotifyLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

// Floating-rail Spotify button. Playing: spinning album art linking to the
// song. Idle: a greyed Spotify logo that explains itself on hover.
export default function SpotifyRail() {
  const track = useNowPlaying();
  const playing = Boolean(track?.isPlaying);

  const base =
    'relative inline-flex h-11 w-11 items-center justify-center rounded-full border bg-[var(--background)] shadow-lg transition-colors hover:bg-[var(--accent)]';

  return (
    <div data-tour="spotify" className="group relative">
      {playing && track?.songUrl ? (
        <a
          href={track.songUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Now playing on Spotify: ${track.title} by ${track.artist}`}
          className={base}
        >
          {track.albumImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={track.albumImageUrl}
              alt=""
              className="h-9 w-9 animate-[spin_6s_linear_infinite] rounded-full object-cover"
            />
          ) : (
            <SpotifyLogo className="h-5 w-5 text-[#1DB954]" />
          )}
          {/* Live dot */}
          <span
            className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[var(--background)]"
            style={{ backgroundColor: SPOTIFY_GREEN }}
            aria-hidden
          />
        </a>
      ) : (
        <button type="button" aria-label="Spotify — nothing playing right now" className={base}>
          <SpotifyLogo className="h-5 w-5 text-[var(--muted-foreground)] transition-colors group-hover:text-[#1DB954]" />
        </button>
      )}

      {/* Hover card, to the left of the rail */}
      <div
        role="tooltip"
        className="pointer-events-none absolute right-full top-1/2 mr-3 w-56 -translate-y-1/2 translate-x-1 rounded-xl border bg-[var(--background)] px-3 py-2 text-left opacity-0 shadow-lg transition duration-200 group-hover:translate-x-0 group-hover:opacity-100"
      >
        {playing ? (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: SPOTIFY_GREEN }}>
              Now playing
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-[var(--foreground)]">{track?.title}</p>
            <p className="truncate text-xs text-[var(--muted-foreground)]">{track?.artist}</p>
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
    </div>
  );
}
