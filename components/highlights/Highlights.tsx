'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { AtSign, Code2, Sparkles, User, X } from 'lucide-react';
import { highlights, type Highlight } from './highlightsData';

const ICONS: Record<Highlight['id'], ComponentType<{ className?: string }>> = {
  about: User,
  stack: Code2,
  now: Sparkles,
  contact: AtSign,
};

export default function Highlights() {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIndex(null);
      if (e.key === 'ArrowRight')
        setIndex((i) => (i === null ? i : Math.min(i + 1, highlights.length - 1)));
      if (e.key === 'ArrowLeft')
        setIndex((i) => (i === null ? i : Math.max(i - 1, 0)));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const active = index !== null ? highlights[index] : null;
  const ActiveIcon = active ? ICONS[active.id] : null;

  return (
    <section className="mx-auto w-full max-w-2xl px-5 pb-4 pt-2">
      <div className="flex gap-5 overflow-x-auto pb-1">
        {highlights.map((h, i) => {
          const Icon = ICONS[h.id];
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => setIndex(i)}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--muted)] transition-colors hover:border-[var(--foreground)]">
                <Icon className="h-6 w-6 text-[var(--foreground)]" />
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                {h.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Story viewer */}
      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm sm:p-6"
          onClick={() => setIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div
            className="flex h-full w-full max-w-sm flex-col bg-[var(--background)] sm:h-auto sm:rounded-2xl sm:border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bars */}
            <div className="flex gap-1 px-3 pt-3">
              {highlights.map((_, i) => (
                <span
                  key={i}
                  className={`h-0.5 flex-1 rounded-full ${
                    i <= (index ?? 0)
                      ? 'bg-[var(--foreground)]'
                      : 'bg-[var(--border)]'
                  }`}
                />
              ))}
            </div>

            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3">
              {ActiveIcon && (
                <span className="flex h-8 w-8 items-center justify-center rounded-full border bg-[var(--muted)]">
                  <ActiveIcon className="h-4 w-4 text-[var(--foreground)]" />
                </span>
              )}
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {active.title}
              </span>
              <button
                type="button"
                onClick={() => setIndex(null)}
                aria-label="Close"
                className="ml-auto text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 items-center px-6 py-10 sm:py-14">
              <p className="text-lg leading-relaxed text-[var(--foreground)]">
                {active.body}
              </p>
            </div>

            {/* Prev / next tap zones */}
            <div className="flex border-t">
              <button
                type="button"
                onClick={() => setIndex((i) => Math.max((i ?? 0) - 1, 0))}
                disabled={index === 0}
                className="flex-1 py-3 text-sm font-medium text-[var(--muted-foreground)] transition-colors enabled:hover:text-[var(--foreground)] disabled:opacity-30"
              >
                Prev
              </button>
              <span className="w-px bg-[var(--border)]" />
              <button
                type="button"
                onClick={() =>
                  setIndex((i) =>
                    Math.min((i ?? 0) + 1, highlights.length - 1),
                  )
                }
                disabled={index === highlights.length - 1}
                className="flex-1 py-3 text-sm font-medium text-[var(--muted-foreground)] transition-colors enabled:hover:text-[var(--foreground)] disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
