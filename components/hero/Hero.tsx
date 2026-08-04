import { BadgeCheck } from 'lucide-react';
import HeroAvatar from './HeroAvatar';

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-2xl px-5 pt-16 pb-2 sm:pt-20">
      {/* Avatar + name/role group */}
      <div className="flex items-center gap-3">
        <HeroAvatar />
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
