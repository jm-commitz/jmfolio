'use client';

import { useEffect, useState } from 'react';

export type AvatarMood = 'party' | 'rock' | 'normal';

export type Track = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  mood?: AvatarMood;
};

export function useNowPlaying() {
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

  return track;
}
