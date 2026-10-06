import Image from 'next/image';
import { tech, techGroups } from './techData';

// Colored logos: greyscale by default, full color on hover.
// Monochrome logos: flip with the theme so they stay visible.
function toneClass(tone?: 'black' | 'white') {
  if (tone === 'black') return 'dark:invert';
  if (tone === 'white') return 'invert dark:invert-0';
  return 'grayscale group-hover:grayscale-0';
}

// Tools grouped by category, each tool a compact pill (logo + name).
export default function Tools() {
  return (
    <section
      data-tour="tools"
      className="mx-auto w-full max-w-2xl px-5 pb-10 pt-2 lg:max-w-none lg:px-6 lg:pt-0"
    >
      <div className="mb-4 flex items-baseline gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Tools &amp; Technologies
        </h2>
        <span className="text-[11px] text-[var(--muted-foreground)]">{tech.length}</span>
      </div>

      <div className="flex flex-col gap-4">
        {techGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 flex items-center gap-2 text-[11px] font-medium text-[var(--muted-foreground)]">
              {group.label}
              <span className="h-px flex-1 bg-[var(--border)]" aria-hidden />
              <span className="tabular-nums">{group.items.length}</span>
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((t) => (
                <li
                  key={t.name}
                  className="group inline-flex items-center gap-1.5 rounded-full border bg-[var(--background)] py-1 pl-1.5 pr-2.5 transition-colors hover:bg-[var(--accent)]"
                >
                  <span className="relative h-4 w-4 shrink-0">
                    <Image
                      src={t.icon}
                      alt=""
                      fill
                      sizes="16px"
                      unoptimized
                      className={`object-contain opacity-80 transition duration-300 group-hover:opacity-100 ${toneClass(
                        t.tone,
                      )}`}
                    />
                  </span>
                  <span className="text-xs text-[var(--foreground)]">{t.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
