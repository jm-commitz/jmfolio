'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = { type: 'video'; src: string; poster: string } | { type: 'image'; src: string };

/**
 * Primitive props only — a server component can't hand a whole `Project`
 * across the client boundary because `icon` is a function.
 */
export default function ProjectGallery({
  title,
  image,
  video,
  gallery,
}: {
  title: string;
  image: string;
  video?: string;
  gallery?: string[];
}) {
  const slides: Slide[] = [];
  // The video leads — it used to be the only media the modal showed.
  if (video) slides.push({ type: 'video', src: video, poster: image });
  for (const src of gallery ?? []) slides.push({ type: 'image', src });
  // Every project gets at least one slide.
  if (!slides.length) slides.push({ type: 'image', src: image });
  const [emblaRef, embla] = useEmblaCarousel({
    loop: slides.length > 2,
    align: 'start',
  });
  const [selected, setSelected] = useState(0);

  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);
  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    onSelect();
    embla.on('select', onSelect);
    return () => {
      embla.off('select', onSelect);
    };
  }, [embla]);

  // Arrow keys drive the carousel once there is more than one slide.
  useEffect(() => {
    if (!embla || slides.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') embla.scrollPrev();
      if (e.key === 'ArrowRight') embla.scrollNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [embla, slides.length]);

  const many = slides.length > 1;

  return (
    <section className="mt-8">
      <div className="mb-2 flex items-baseline gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Gallery
        </h2>
        <span className="text-[11px] text-[var(--muted-foreground)]">{slides.length}</span>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-xl border" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, i) => (
              <div key={slide.src} className="relative min-w-0 flex-[0_0_100%]">
                {/* object-contain on black: these are wide desktop captures, so
                    cropping to a fixed ratio would cut the UI off. */}
                <div className="relative aspect-video w-full bg-black">
                  {slide.type === 'video' ? (
                    <video
                      src={slide.src}
                      poster={slide.poster}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : (
                    <Image
                      src={slide.src}
                      alt={`${title} screenshot ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority={i === 0}
                      unoptimized={slide.src.endsWith('.svg')}
                      className="object-contain"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {many && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/75"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/75"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {many && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to image ${i + 1}`}
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
    </section>
  );
}
