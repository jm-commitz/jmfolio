'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Grid2x2, X } from 'lucide-react';

type Slide = { type: 'video'; src: string; poster: string } | { type: 'image'; src: string };

// Bento layouts by slide count (md+). Tile 0 is always the large one.
const GRID: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-[2fr_1fr]',
  3: 'grid-cols-[2fr_1fr] grid-rows-2',
  4: 'grid-cols-[2fr_1fr_1fr] grid-rows-2',
  5: 'grid-cols-[2fr_1fr_1fr] grid-rows-2',
};
const MAX_TILES = 5;

function tileSpan(i: number, count: number) {
  if (i === 0 && count >= 3) return 'row-span-2';
  if (i === 1 && count === 4) return 'col-span-2';
  return '';
}

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

  const [lightbox, setLightbox] = useState<number | null>(null);
  const count = slides.length;
  const tiles = slides.slice(0, MAX_TILES);
  const hidden = count - tiles.length;

  return (
    <section>
      {/* Desktop: bento grid */}
      <div
        className={`relative hidden h-[min(60vh,520px)] gap-2 overflow-hidden rounded-2xl md:grid ${
          GRID[Math.min(count, MAX_TILES)]
        }`}
      >
        {tiles.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setLightbox(i)}
            aria-label={`Open ${title} media ${i + 1}`}
            className={`group relative overflow-hidden bg-[var(--muted)] ${tileSpan(i, count)}`}
          >
            <Media
              slide={slide}
              alt={`${title} screenshot ${i + 1}`}
              // A lone tile shows the whole capture; grid tiles are crops.
              fit={count === 1 ? 'contain' : 'cover'}
              playVideo={i === 0}
              priority={i === 0}
              sizes={i === 0 ? '(min-width: 768px) 60vw, 100vw' : '(min-width: 768px) 25vw, 100vw'}
              className="transition duration-500 group-hover:scale-[1.03] group-hover:brightness-90"
            />
            {hidden > 0 && i === tiles.length - 1 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                +{hidden} more
              </span>
            )}
          </button>
        ))}

        {count > 1 && (
          <button
            type="button"
            onClick={() => setLightbox(0)}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border bg-[var(--background)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] shadow-md transition hover:bg-[var(--accent)]"
          >
            <Grid2x2 className="h-3.5 w-3.5" />
            Show all ({count})
          </button>
        )}
      </div>

      {/* Mobile: swipeable carousel */}
      <MobileCarousel slides={slides} title={title} onOpen={setLightbox} />

      {lightbox !== null && (
        <Lightbox
          slides={slides}
          title={title}
          startIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}

function Media({
  slide,
  alt,
  fit,
  playVideo,
  priority,
  sizes,
  className = '',
}: {
  slide: Slide;
  alt: string;
  fit: 'cover' | 'contain';
  playVideo?: boolean;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const objectFit = fit === 'cover' ? 'object-cover' : 'object-contain';

  if (slide.type === 'video' && playVideo) {
    return (
      <video
        src={slide.src}
        poster={slide.poster}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        className={`absolute inset-0 h-full w-full ${objectFit} ${className}`}
      />
    );
  }

  const src = slide.type === 'video' ? slide.poster : slide.src;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.endsWith('.svg')}
      className={`${objectFit} ${className}`}
    />
  );
}

function MobileCarousel({
  slides,
  title,
  onOpen,
}: {
  slides: Slide[];
  title: string;
  onOpen: (i: number) => void;
}) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: slides.length > 2 });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on('select', onSelect);
    return () => {
      embla.off('select', onSelect);
    };
  }, [embla]);

  return (
    <div className="relative md:hidden">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => onOpen(i)}
              aria-label={`Open ${title} media ${i + 1}`}
              className="relative aspect-[4/3] min-w-0 flex-[0_0_100%] bg-[var(--muted)]"
            >
              <Media
                slide={slide}
                alt={`${title} screenshot ${i + 1}`}
                fit={slides.length === 1 ? 'contain' : 'cover'}
                playVideo
                priority={i === 0}
                sizes="100vw"
              />
            </button>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {selected + 1} / {slides.length}
        </span>
      )}
    </div>
  );
}

function Lightbox({
  slides,
  title,
  startIndex,
  onClose,
}: {
  slides: Slide[];
  title: string;
  startIndex: number;
  onClose: () => void;
}) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: slides.length > 2, startIndex });
  const [selected, setSelected] = useState(startIndex);

  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on('select', onSelect);
    return () => {
      embla.off('select', onSelect);
    };
  }, [embla]);

  // Esc closes, arrows navigate, page scroll locked while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') embla?.scrollPrev();
      if (e.key === 'ArrowRight') embla?.scrollNext();
    };
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [embla, onClose]);

  const many = slides.length > 1;

  // Portaled so no ancestor stacking context can trap it.
  return createPortal(
    <div
      role="dialog"
      aria-modal
      aria-label={`${title} gallery`}
      className="fixed inset-0 z-[150] flex flex-col bg-black/95 text-white"
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <span className="text-sm font-medium tabular-nums text-white/80">
          {selected + 1} / {slides.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="rounded-full p-2 transition hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide, i) => (
              <div key={slide.src} className="relative h-full min-w-0 flex-[0_0_100%] px-4 sm:px-16">
                <div className="relative h-full w-full">
                  <Media
                    slide={slide}
                    alt={`${title} screenshot ${i + 1}`}
                    fit="contain"
                    playVideo={slide.type === 'video'}
                    sizes="100vw"
                  />
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
              aria-label="Previous"
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur-sm transition hover:bg-white/20 sm:block"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur-sm transition hover:bg-white/20 sm:block"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {many && (
        <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto px-4 py-4">
          {slides.map((slide, i) => {
            const src = slide.type === 'video' ? slide.poster : slide.src;
            return (
              <button
                key={slide.src}
                type="button"
                onClick={() => embla?.scrollTo(i)}
                aria-label={`Go to media ${i + 1}`}
                aria-current={selected === i}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition ${
                  selected === i ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-90'
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  unoptimized={src.endsWith('.svg')}
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>,
    document.body,
  );
}
