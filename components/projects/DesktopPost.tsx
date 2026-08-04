'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowUpRight,
  BadgeCheck,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Send,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { Project } from './projectsData';

export default function DesktopPost({
  project,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  project: Project;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset + autoplay whenever the shown project changes.
  useEffect(() => {
    setLiked(false);
    setMuted(true);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, [project]);

  const hashtags = project.tags
    .map((t) => `#${t.replace(/\s+/g, '')}`)
    .join(' ');

  return (
    <div className="flex h-full w-full">
      {/* Media */}
      <div className="relative min-w-0 flex-1 bg-black">
        {project.video ? (
          <video
            ref={videoRef}
            src={project.video}
            poster={project.image}
            muted={muted}
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="800px"
            // SVG placeholders bypass the optimizer (needs dangerouslyAllowSVG).
            unoptimized={project.image.endsWith('.svg')}
            className="object-contain"
          />
        )}

        {project.video && (
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="absolute bottom-3 right-3 rounded-full bg-black/60 p-1.5 text-white backdrop-blur-sm"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        )}

        {/* Prev / next */}
        {hasPrev && (
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous project"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {hasNext && (
          <button
            type="button"
            onClick={onNext}
            aria-label="Next project"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Details panel */}
      <div className="flex w-[340px] shrink-0 flex-col border-l">
        {/* Header */}
        <div className="flex items-center gap-2 border-b px-4 py-3">
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

        {/* Caption */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">
            <span className="font-semibold">jmancheta.dev</span>{' '}
            <span className="font-semibold">{project.title}</span>
            {project.description ? ` — ${project.description}` : ''}
          </p>
          {hashtags && (
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {hashtags}
            </p>
          )}
          {/* Live projects link out; placeholder '#' hrefs stay hidden. */}
          {project.href?.startsWith('http') && (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--foreground)] underline underline-offset-2"
            >
              {project.href.replace(/^https?:\/\//, '')}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="border-t px-4 py-3">
          <div className="flex items-center gap-4">
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
          <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
            {liked ? '1 like' : 'Be the first to like this'}
          </p>
          {project.date && (
            <p className="mt-1 text-[10px] uppercase tracking-widest text-[var(--muted-foreground)]">
              {project.date}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
