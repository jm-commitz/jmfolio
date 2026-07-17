import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';
import NowPlaying from '@/components/spotify/NowPlaying';

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-2xl px-5 pt-16 pb-2 sm:pt-20">
      {/* Avatar + name/role group */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          {/* Spotify now playing — absolutely positioned layer, reserves no space */}
          <div className="absolute bottom-full left-1 z-10 mb-1.5">
            <NowPlaying />
          </div>
          <div className="relative h-14 w-14 overflow-hidden rounded-full border bg-[var(--muted)] sm:h-16 sm:w-16">
            <Image
              src="/hero/hero.png"
              alt="Jaymark Ancheta"
              fill
              priority
              sizes="64px"
              className="object-cover grayscale"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold tracking-tight text-[var(--foreground)] sm:text-xl">
              Jaymark Ancheta
            </h1>
            <BadgeCheck
              className="h-4 w-4"
              fill="var(--foreground)"
              stroke="var(--background)"
              aria-label="Verified"
            />
          </div>
          <p className="text-sm font-medium text-[var(--muted-foreground)] sm:text-base">
            Full-Stack &amp; Mobile Developer
          </p>
        </div>
      </div>

      {/* Tagline */}
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
        Building the Next Big Thing.
      </p>

      {/* CTAs */}
      <div className="mt-4 flex gap-2">
        <a
          href="https://github.com/jm-commitz"
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-lg bg-[var(--foreground)] px-4 py-2 text-center text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-90"
        >
          Follow
        </a>
        <a
          href="https://api.whatsapp.com/send?phone=639917944729"
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-lg border px-4 py-2 text-center text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]"
        >
          Message
        </a>
      </div>

      <hr className="mt-8 border-[var(--border)]" />
    </section>
  );
}
