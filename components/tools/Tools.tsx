import Image from 'next/image';
import { tech } from './techData';

// Colored logos: greyscale by default, full color on hover.
// Monochrome logos: flip with the theme so they stay visible.
function toneClass(tone?: 'black' | 'white') {
  if (tone === 'black') return 'dark:invert';
  if (tone === 'white') return 'invert dark:invert-0';
  return 'grayscale group-hover:grayscale-0';
}

export default function Tools() {
  return (
    <section className="mx-auto w-full max-w-2xl px-5 py-2">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
        Tools &amp; Technologies
      </h2>

      <div className="grid grid-cols-6 gap-x-2 gap-y-3 sm:grid-cols-8">
        {tech.map((t) => (
          <div key={t.name} className="group flex flex-col items-center gap-1">
            <div className="relative h-6 w-6 sm:h-7 sm:w-7">
              <Image
                src={t.icon}
                alt={t.name}
                fill
                sizes="28px"
                unoptimized
                className={`object-contain opacity-80 transition duration-300 group-hover:opacity-100 ${toneClass(
                  t.tone,
                )}`}
              />
            </div>
            <span className="w-full truncate text-center text-[9px] leading-tight text-[var(--muted-foreground)]">
              {t.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
