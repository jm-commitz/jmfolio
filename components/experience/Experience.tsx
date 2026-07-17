'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SparklesText from '@/components/ui/SparklesText';
import { experiences } from './experienceData';

const COLLAPSED_COUNT = 2;

export default function Experience() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? experiences : experiences.slice(0, COLLAPSED_COUNT);
  const hasMore = experiences.length > COLLAPSED_COUNT;

  return (
    <section className="mx-auto w-full max-w-2xl px-5 pt-3 pb-8">
      <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
        Experience
      </h2>

      <ol>
        {visible.map((item, i) => {
          const isLast = i === visible.length - 1;
          return (
            <li
              key={`${item.company}-${item.period}`}
              className={`relative pl-6 ${isLast ? '' : 'border-l pb-8'}`}
            >
              {/* Timeline dot */}
              <span
                className={`absolute -left-[6.5px] top-1 h-3 w-3 rounded-full border-2 border-[var(--background)] ${
                  item.current ? 'bg-[var(--foreground)]' : 'bg-[var(--muted-foreground)]'
                }`}
                aria-hidden
              />

              {/* Date + Now badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-[var(--muted-foreground)]">
                  {item.period}
                </span>
                {item.current && (
                  <span className="rounded-full border px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)]">
                    Now
                  </span>
                )}
              </div>

              {/* Company + role */}
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[var(--foreground)] underline underline-offset-4 transition-opacity hover:opacity-70"
                  >
                    {item.shiny ? (
                      <SparklesText>
                        <span className="shiny-text">{item.company}</span>
                      </SparklesText>
                    ) : (
                      item.company
                    )}
                  </a>
                ) : (
                  <span className="font-semibold text-[var(--foreground)]">
                    {item.company}
                  </span>
                )}
                <span className="text-sm italic text-[var(--muted-foreground)]">
                  {item.role}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-5 inline-flex items-center gap-1 pl-6 text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
        >
          {expanded ? 'See less' : `See all (${experiences.length})`}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </section>
  );
}
