'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Monitor, MonitorSmartphone, Smartphone, X } from 'lucide-react';
import { IPhone, MacBook } from './DeviceFrame';

// `frame` puts an image in a device mockup (the 'devices' variant).
type Slide =
  | { type: 'video'; src: string; poster: string }
  | { type: 'image'; src: string; frame?: 'mac' | 'phone' };

/**
 * App Store-style "Preview" strip: one horizontal snap scroller of screenshots.
 * Phone projects get tall phone-shaped shots, everything else 16:9 captures.
 * Clicking a shot opens the fullscreen lightbox.
 *
 * Primitive props only — a server component can't hand a whole `Project`
 * across the client boundary because `icon` is a function.
 */
export default function ProjectGallery({
  title,
  image,
  video,
  gallery,
  mobileGallery,
  variant,
}: {
  title: string;
  image: string;
  video?: string;
  gallery?: string[];
  mobileGallery?: string[];
  variant?: 'phone' | 'devices';
}) {
  const devices = variant === 'devices';
  const slides: Slide[] = [];
  // The video leads — it used to be the only media the modal showed.
  if (video) slides.push({ type: 'video', src: video, poster: image });
  for (const src of gallery ?? [])
    slides.push({ type: 'image', src, ...(devices ? { frame: 'mac' as const } : {}) });
  if (devices)
    for (const src of mobileGallery ?? []) slides.push({ type: 'image', src, frame: 'phone' });
  // Every project gets at least one slide.
  if (!slides.length) slides.push({ type: 'image', src: image });

  const phone = variant === 'phone';
  const [lightbox, setLightbox] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  // Re-measure when the strip resizes (also fires once on mount).
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const shot = el.querySelector<HTMLElement>('[data-shot]');
    const width = shot ? shot.getBoundingClientRect().width + 12 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * width, behavior: 'smooth' });
  };

  const arrow =
    'absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-[var(--background)] text-[var(--foreground)] shadow-md transition hover:bg-[var(--accent)] sm:flex';

  return (
    <div>
      <div className="relative">
        <div
          ref={scroller}
          onScroll={measure}
          className={`no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:scroll-px-0 sm:px-0 ${
            devices ? 'items-center gap-6 py-4' : 'gap-3'
          }`}
        >
          {slides.map((slide, i) =>
            slide.type === 'image' && slide.frame ? (
              // Device mockup (MacBook or iPhone with Dynamic Island)
              <button
                key={slide.src}
                data-shot
                data-say="Click to zoom 🔍"
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`Open ${title} screenshot ${i + 1}`}
                className={`group shrink-0 snap-start transition-transform duration-500 hover:-translate-y-1 ${
                  slide.frame === 'mac' ? 'w-[85%] px-[3%] sm:w-[560px]' : 'h-[440px] lg:h-[480px]'
                }`}
              >
                {slide.frame === 'mac' ? (
                  <MacBook
                    src={slide.src}
                    alt={`${title} screenshot ${i + 1}`}
                    sizes="(min-width: 640px) 540px, 80vw"
                    priority={i < 2}
                  />
                ) : (
                  <IPhone
                    src={slide.src}
                    alt={`${title} screenshot ${i + 1}`}
                    sizes="240px"
                    className="h-full"
                    liveIsland
                  />
                )}
              </button>
            ) : (
              <button
                key={slide.src}
                data-shot
                data-say="Click to zoom 🔍"
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`Open ${title} screenshot ${i + 1}`}
                className={`group relative shrink-0 snap-start overflow-hidden border bg-[var(--muted)] ${
                  phone
                    ? 'aspect-[912/2016] h-[440px] rounded-[22px] lg:h-[520px]'
                    : 'aspect-video w-[85%] rounded-2xl sm:w-[560px]'
                }`}
              >
                <Media
                  slide={slide}
                  alt={`${title} screenshot ${i + 1}`}
                  fit="cover"
                  playVideo={slide.type === 'video'}
                  priority={i < 3}
                  sizes={phone ? '240px' : '(min-width: 640px) 560px, 85vw'}
                  className="transition duration-500 group-hover:scale-[1.02]"
                />
              </button>
            ),
          )}
        </div>

        {!edges.start && (
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous screenshots"
            className={`${arrow} -left-4`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {!edges.end && (
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next screenshots"
            className={`${arrow} -right-4`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Device caption, like the App Store's "iPhone" line */}
      <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
        {devices ? (
          <MonitorSmartphone className="h-3.5 w-3.5" />
        ) : phone ? (
          <Smartphone className="h-3.5 w-3.5" />
        ) : (
          <Monitor className="h-3.5 w-3.5" />
        )}
        {devices ? 'Web · Desktop & Mobile' : phone ? 'iPhone & Android' : 'Web'}
      </p>

      {lightbox !== null && (
        <Lightbox
          slides={slides}
          title={title}
          startIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
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
              <div
                key={slide.src}
                className="relative h-full min-w-0 flex-[0_0_100%] px-4 sm:px-16"
              >
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
