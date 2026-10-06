import { BadgeCheck } from 'lucide-react';
import HeroAvatar from './HeroAvatar';
import { FOLLOW_HREF, MESSAGE_HREF } from './profileLinks';

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-2xl px-5 pt-16 pb-2 sm:pt-20 lg:max-w-none lg:px-8 lg:pt-20">
      {/* Avatar + name/role group — side by side on mobile, stacked on desktop */}
      <div className="flex items-center gap-3 lg:flex-col lg:items-center lg:gap-5">
        <HeroAvatar />

        <div className="flex flex-col lg:items-center lg:text-center">
          {/* data-tour-spot: the tour enlarges the name AND badge together */}
          <div data-tour-spot="profile" className="flex items-center gap-1.5">
            <h1 data-tour="profile" className="text-lg font-bold tracking-tight text-[var(--foreground)] sm:text-xl lg:text-2xl">
              Jaymark Ancheta
            </h1>
            <BadgeCheck
              className="h-4 w-4 lg:h-5 lg:w-5"
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
      <p className="mt-4 max-w-md text-sm leading-relaxed lg:mx-auto lg:text-center text-[var(--muted-foreground)] sm:text-base">
        Building the Next Big Thing.
      </p>

      {/* CTAs */}
      <div data-tour="cta" className="mt-4 flex gap-2 lg:mt-6">
        <a
          href={FOLLOW_HREF}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-lg bg-[var(--foreground)] px-4 py-2 text-center text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-90"
        >
          Follow
        </a>
        <a
          href={MESSAGE_HREF}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-lg border px-4 py-2 text-center text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]"
        >
          Message
        </a>
      </div>

      {/* Column border replaces this divider on desktop */}
      <hr className="mt-8 border-[var(--border)] lg:hidden" />
    </section>
  );
}
