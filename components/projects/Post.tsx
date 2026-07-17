'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  BadgeCheck,
  Bookmark,
  Heart,
  MessageCircle,
  Send,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { Project } from './projectsData';

export default function Post({ project }: { project: Project }) {
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  // Play the video only while this post is mostly in view (like IG's feed).
  useEffect(() => {
    const media = mediaRef.current;
    const video = videoRef.current;
    if (!media || !video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    io.observe(media);
    return () => io.disconnect();
  }, []);

  const hashtags = project.tags
    .map((t) => `#${t.replace(/\s+/g, '')}`)
    .join(' ');

  return (
    <article className="border-b">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border bg-[var(--muted)]">
          <Image
            src="/hero/hero.png"
            alt=""
            fill
            sizes="32px"
            className="object-cover grayscale"
          />
        </div>
        <span className="flex items-center gap-1 text-sm font-semibold text-[var(--foreground)]">
          jmancheta.dev
          <BadgeCheck
            className="h-3.5 w-3.5"
            fill="var(--foreground)"
            stroke="var(--background)"
            aria-label="Verified"
          />
        </span>
      </div>

      {/* Media (full color) */}
      <div ref={mediaRef} className="relative aspect-square w-full bg-black">
        {project.video ? (
          <video
            ref={videoRef}
            src={project.video}
            poster={project.image}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            onClick={() => {
              const v = videoRef.current;
              if (!v) return;
              if (v.paused) v.play().catch(() => {});
              else v.pause();
            }}
            className="absolute inset-0 h-full w-full cursor-pointer object-cover"
          />
        ) : (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="448px"
            className="object-cover"
          />
        )}
        {project.video && (
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="absolute bottom-3 right-3 rounded-full bg-black/60 p-1.5 text-white backdrop-blur-sm"
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 pt-3">
        <button
          type="button"
          onClick={() => setLiked((l) => !l)}
          aria-label="Like"
          className="transition-transform active:scale-90"
        >
          <Heart
            className={`h-6 w-6 ${
              liked ? 'fill-red-500 text-red-500' : 'text-[var(--foreground)]'
            }`}
          />
        </button>
        <MessageCircle className="h-6 w-6 text-[var(--foreground)]" />
        <Send className="h-6 w-6 text-[var(--foreground)]" />
        <Bookmark className="ml-auto h-6 w-6 text-[var(--foreground)]" />
      </div>

      {/* Caption */}
      <div className="px-4 py-2 pb-4">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {liked ? '1 like' : 'Be the first to like this'}
        </p>
        <p className="mt-1 text-sm text-[var(--foreground)]">
          <span className="font-semibold">jmancheta.dev</span>{' '}
          <span className="font-semibold">{project.title}</span>
          {project.description ? ` — ${project.description}` : ''}
        </p>
        {hashtags && (
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {hashtags}
          </p>
        )}
        {project.date && (
          <p className="mt-3 text-[10px] uppercase tracking-widest text-[var(--muted-foreground)]">
            {project.date}
          </p>
        )}
      </div>
    </article>
  );
}
