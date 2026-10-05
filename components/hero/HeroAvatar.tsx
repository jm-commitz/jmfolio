'use client';

import Image from 'next/image';
import { githubAvatar } from '@/lib/github';
import NowPlaying from '@/components/spotify/NowPlaying';
import { useNowPlaying, type AvatarMood } from '@/components/spotify/useNowPlaying';

// Filenames are case-sensitive on Vercel — party is .gif, the others .GIF.
const MOOD_AVATARS: Record<AvatarMood, string> = {
  party: '/hero/party.gif',
  rock: '/hero/rock.GIF',
  normal: '/hero/normal.GIF',
};

export default function HeroAvatar() {
  const track = useNowPlaying();
  const isPlaying = Boolean(track?.isPlaying);
  const mood: AvatarMood = track?.mood ?? 'normal';

  return (
    <div className="relative shrink-0">
      {/* Spotify now playing — absolutely positioned layer, reserves no space */}
      <div className="absolute bottom-full left-1 z-10 mb-1.5 origin-bottom-left lg:mb-3 lg:scale-150">
        <NowPlaying track={track} />
      </div>
      <div
        className={`relative h-14 w-14 sm:h-16 sm:w-16 lg:h-44 lg:w-44 ${
          // Monochrome backdrop behind the transparent cutout (photo mode only)
          isPlaying ? '' : 'avatar-backdrop overflow-hidden rounded-full'
        }`}
      >
        <Image
          // Live GitHub avatar (see githubAvatar) — loaded straight from GitHub
          src={githubAvatar(352)}
          unoptimized
          alt="Jaymark Ancheta"
          fill
          priority
          sizes="(min-width: 1024px) 176px, 64px"
          className={`object-cover grayscale transition-opacity duration-500 ${
            isPlaying ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {/* Music mode — GIF depends on the mood of the playing track.
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
      </div>
    </div>
  );
}
