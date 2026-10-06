'use client';

import { useSyncExternalStore } from 'react';
import type { AvatarMood, Track } from './useNowPlaying';

// Tiny shared store: is a VISITOR playing my playlist in the rail's mini
// player right now, what's the song, and what mood is it? The avatar reads it to switch
// to its music GIF, the same way it does when I'm playing Spotify myself.
type State = { playing: boolean; mood: AvatarMood; track: Track | null };

let state: State = { playing: false, mood: 'normal', track: null };
const listeners = new Set<() => void>();

export function setVisitorPlayback(next: Partial<State>) {
  const merged = { ...state, ...next };
  if (
    merged.playing === state.playing &&
    merged.mood === state.mood &&
    merged.track === state.track
  )
    return;
  state = merged;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const SERVER: State = { playing: false, mood: 'normal', track: null };

export function useVisitorPlayback() {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}
