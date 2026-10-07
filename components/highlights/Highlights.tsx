'use client';

import { useState, type ComponentType } from 'react';
import { AtSign, Code2, Sparkles, User } from 'lucide-react';
import { highlights, type Highlight } from './highlightsData';
import StoryViewer from './StoryViewer';

const ICONS: Record<Highlight['id'], ComponentType<{ className?: string }>> = {
  about: User,
  stack: Code2,
  now: Sparkles,
  contact: AtSign,
};

// Hover lines for the desktop cursor bubble.
const SAY: Record<Highlight['id'], string> = {
  about: 'About me ✨',
  stack: 'My stack 🧰',
  now: "What I'm up to 🚀",
  contact: "Let's talk 📮",
};

export default function Highlights() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto w-full max-w-2xl px-5 pb-4 pt-2 lg:max-w-none lg:px-8 lg:pt-6">
      <div data-tour="highlights" className="flex gap-5 overflow-x-auto pb-1">
        {highlights.map((h, i) => {
          const Icon = ICONS[h.id];
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => setIndex(i)}
              data-say={SAY[h.id]}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--border)] bg-[var(--muted)] transition-colors hover:border-[var(--foreground)]">
                {h.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={h.image}
                    alt={h.label}
                    className="h-full w-full object-cover grayscale"
                  />
                ) : (
                  <Icon className="h-6 w-6 text-[var(--foreground)]" />
                )}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                {h.label}
              </span>
            </button>
          );
        })}
      </div>

      {index !== null && (
        <StoryViewer stories={highlights} startIndex={index} onClose={() => setIndex(null)} />
      )}
    </section>
  );
}
