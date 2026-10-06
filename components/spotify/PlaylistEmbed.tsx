'use client';

import { useEffect, useRef } from 'react';
import { setVisitorPlayback } from './visitorPlayback';
import type { AvatarMood, Track } from './useNowPlaying';

// Spotify's embed, driven by the official IFrame API so we hear about
// play/pause and the current track. While a visitor plays, the avatar switches
// to its music GIF and shows the song bubble (details from /api/track-mood).

type PlaybackEvent = {
  data: { isPaused: boolean; isBuffering?: boolean; playingURI?: string };
};
type Controller = {
  addListener: (event: 'playback_update', cb: (e: PlaybackEvent) => void) => void;
  destroy?: () => void;
};
type IFrameAPI = {
  createController: (
    el: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    cb: (controller: Controller) => void,
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
    __spotifyIframeApi?: Promise<IFrameAPI>;
  }
}

// Load the IFrame API script once per page.
function loadIframeApi(): Promise<IFrameAPI> {
  if (window.__spotifyIframeApi) return window.__spotifyIframeApi;
  window.__spotifyIframeApi = new Promise((resolve) => {
    window.onSpotifyIframeApiReady = resolve;
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    document.body.appendChild(script);
  });
  return window.__spotifyIframeApi;
}

export default function PlaylistEmbed({ uri }: { uri: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    let controller: Controller | null = null;
    let lastUri = '';

    loadIframeApi().then((api) => {
      if (!alive || !host.current) return;
      // createController replaces the element it's given, so hand it a child.
      const el = document.createElement('div');
      host.current.appendChild(el);
      api.createController(el, { uri, width: '100%', height: 352 }, (c) => {
        controller = c;
        c.addListener('playback_update', ({ data }) => {
          setVisitorPlayback({ playing: !data.isPaused });
          const trackId = data.playingURI?.match(/^spotify:track:([A-Za-z0-9]+)$/)?.[1];
          if (trackId && data.playingURI && data.playingURI !== lastUri) {
            lastUri = data.playingURI;
            fetch(`/api/track-mood?id=${trackId}`)
              .then((r) => (r.ok ? r.json() : { mood: 'normal' }))
              .then((d: Omit<Track, 'isPlaying'> & { mood?: AvatarMood }) =>
                setVisitorPlayback({
                  mood: d.mood ?? 'normal',
                  track: d.title ? { ...d, isPlaying: true } : null,
                }),
              )
              .catch(() => {});
          }
        });
      });
    });

    return () => {
      alive = false;
      controller?.destroy?.();
      setVisitorPlayback({ playing: false });
    };
  }, [uri]);

  return (
    <div ref={host} className="overflow-hidden rounded-xl [&_iframe]:block [&_iframe]:border-0" />
  );
}
