import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Medal, Trophy } from 'lucide-react';
import { achievements } from './achievementsData';

// Left column, under Experience: awards and events, each with its proof
// (listing page or certificate) and, when there is one, the project's case study.
export default function Achievements() {
  if (!achievements.length) return null;

  return (
    <section data-tour="achievements" className="mx-auto w-full max-w-2xl px-5 pt-3 pb-8 lg:max-w-none lg:px-8 lg:pt-6">
      <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
        Achievements
      </h2>

      <ul className="space-y-6">
        {achievements.map((item) => {
          const Icon = item.kind === 'award' ? Trophy : Medal;
          const external = item.href?.startsWith('http');
          return (
            <li key={item.id} className="flex gap-3.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-[var(--muted)] text-[var(--foreground)]"
                aria-hidden
              >
                <Icon className="h-4 w-4" />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--muted-foreground)]">
                  {item.issuer} · {item.date}
                </p>
                <p className="mt-0.5 font-semibold text-[var(--foreground)]">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {item.description}
                </p>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
                  {item.href && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      data-say={external ? `${item.hrefLabel ?? 'View'} ↗` : 'Proof, signed and all 📜'}
                      className="inline-flex items-center gap-1 text-[var(--foreground)] transition-opacity hover:opacity-70"
                    >
                      {item.hrefLabel ?? 'View'}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {item.projectSlug && (
                    <Link
                      href={`/projects/${item.projectSlug}`}
                      data-say="What we built →"
                      className="group inline-flex items-center gap-1 text-[var(--foreground)] transition-opacity hover:opacity-70"
                    >
                      Case study
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
