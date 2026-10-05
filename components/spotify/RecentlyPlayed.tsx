'use client';

import { useEffect, useState } from 'react';
import type { RecentTrack } from '@/lib/spotify';

const SPOTIFY_GREEN = '#1DB954';

function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

// Left-column list of my last few Spotify tracks, so the profile still feels
// alive when nothing is playing. Hidden if Spotify returns nothing.
export default function RecentlyPlayed() {
  const [tracks, setTracks] = useState<RecentTrack[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/recently-played')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: RecentTrack[]) => alive && setTracks(Array.isArray(data) ? data : []))
      .catch(() => alive && setTracks([]));
    return () => {
      alive = false;
    };
  }, []);

  if (!tracks || !tracks.length) return null;

  return (
    <section data-tour="recent" className="mx-auto w-full max-w-2xl px-5 pb-10 lg:max-w-none lg:px-8">
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: SPOTIFY_GREEN }} aria-hidden />
        Recently played
      </h2>
      <ol className="flex flex-col gap-1">
        {tracks.map((t) => (
          <li key={t.id}>
            <a
              href={t.songUrl}
              target="_blank"
              rel="noreferrer"
              className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-[var(--accent)]"
            >
              {t.albumImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.albumImageUrl}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-md object-cover grayscale transition duration-300 group-hover:grayscale-0"
                />
              ) : (
                <span className="h-10 w-10 shrink-0 rounded-md bg-[var(--muted)]" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-[var(--foreground)]">
                  {t.title}
                </span>
                <span className="block truncate text-xs text-[var(--muted-foreground)]">
                  {t.artist}
                </span>
              </span>
              <time
                dateTime={t.playedAt}
                className="shrink-0 text-[11px] tabular-nums text-[var(--muted-foreground)]"
              >
                {timeAgo(t.playedAt)}
              </time>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
