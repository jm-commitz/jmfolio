'use client';

import { Children, useCallback, useEffect, useState, type ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AUTOPLAY_MS = 7000;

// One featured card at a time: swipe/drag, arrows or dots to go to the next.
// Auto-advances until the visitor interacts or hovers. Cards are rendered on
// the server and passed in as children.
export default function FeaturedCarousel({ children }: { children: ReactNode }) {
  const slides = Children.toArray(children);
  const many = slides.length > 1;
  const [emblaRef, embla] = useEmblaCarousel({ loop: many });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    const onDrag = () => setPaused(true);
    embla.on('select', onSelect);
    embla.on('pointerDown', onDrag);
    return () => {
      embla.off('select', onSelect);
      embla.off('pointerDown', onDrag);
    };
  }, [embla]);

  useEffect(() => {
    if (!embla || !many || paused) return;
    const id = setInterval(() => embla.scrollNext(), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [embla, many, paused]);

  const arrow =
    'inline-flex h-7 w-7 items-center justify-center rounded-full border text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]';

  return (
    <div onMouseEnter={() => setPaused(true)} onFocusCapture={() => setPaused(true)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Featured
          {many && (
            <span className="ml-2 font-normal tabular-nums normal-case tracking-normal">
              {selected + 1}/{slides.length}
            </span>
          )}
        </h2>
        {many && (
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={prev} aria-label="Previous featured project" className={arrow}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={next} aria-label="Next featured project" className={arrow}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Gap between cards: negative margin on the track, padding on each slide */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="min-w-0 flex-[0_0_100%] pl-4"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {many && (
        <div className="mt-3 flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => embla?.scrollTo(i)}
              aria-label={`Go to featured project ${i + 1}`}
              aria-current={selected === i}
              className={`h-1.5 rounded-full transition-all ${
                selected === i
                  ? 'w-5 bg-[var(--foreground)]'
                  : 'w-1.5 bg-[var(--border)] hover:bg-[var(--muted-foreground)]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
