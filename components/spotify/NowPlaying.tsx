'use client';

import { useEffect, useState } from 'react';

type Track = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
};

export default function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/now-playing');
        const data = (await res.json()) as Track;
        if (active) setTrack(data);
      } catch {
        /* ignore */
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  if (!track || !track.isPlaying) return null;

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noreferrer"
      title={`${track.title} — ${track.artist}`}
      className="relative inline-flex items-center gap-1.5 rounded-2xl border bg-[var(--muted)] py-1 pl-1 pr-2.5 shadow-md transition-colors hover:bg-[var(--accent)]"
    >
      {track.albumImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={track.albumImageUrl}
          alt={track.album ?? ''}
          className="h-5 w-5 shrink-0 rounded-md object-cover"
        />
      )}
      {/* Equalizer */}
      <span className="flex h-2.5 items-end gap-[2px]" aria-hidden>
        <span className="eq-bar w-[2px] flex-1" style={{ height: '100%', animationDelay: '0s', backgroundColor: '#1DB954' }} />
        <span className="eq-bar w-[2px] flex-1" style={{ height: '100%', animationDelay: '0.25s', backgroundColor: '#1DB954' }} />
        <span className="eq-bar w-[2px] flex-1" style={{ height: '100%', animationDelay: '0.5s', backgroundColor: '#1DB954' }} />
      </span>
      <span className="max-w-[120px] truncate text-[11px] font-semibold text-[var(--foreground)]">
        {track.title}
      </span>

      {/* Chat-bubble tail pointing down to the avatar */}
      <span className="absolute -bottom-1.5 left-3 h-2.5 w-2.5 rounded-full border bg-[var(--muted)]" aria-hidden />
      <span className="absolute -bottom-3 left-2 h-1.5 w-1.5 rounded-full border bg-[var(--muted)]" aria-hidden />
    </a>
  );
}
