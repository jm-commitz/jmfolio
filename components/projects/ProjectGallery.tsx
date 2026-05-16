'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ProjectGallery({
  images,
  projectName,
}: {
  images: string[];
  projectName: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = (idx: number) => setLightboxIndex(idx);
  const close = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  return (
    <>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {images.map((src, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => open(idx)}
            className="group relative w-full aspect-square overflow-hidden cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            aria-label={`View ${projectName} screenshot ${idx + 1} larger`}
          >
            <Image
              src={src}
              alt={`${projectName} screenshot ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              quality={85}
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white"
          >
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>

          {/* Counter */}
          <span className="absolute left-1/2 top-4 -translate-x-1/2 font-[family-name:var(--M)] text-[0.6rem] uppercase tracking-[0.2em] text-white/50">
            {lightboxIndex + 1} / {images.length}
          </span>

          {/* Prev */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 md:left-6"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={1.25} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative flex max-h-[90dvh] max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${projectName} screenshot ${lightboxIndex + 1}`}
              width={0}
              height={0}
              sizes="90vw"
              style={{ maxHeight: '90dvh', maxWidth: '90vw', width: 'auto', height: 'auto' }}
              className="object-contain shadow-2xl"
              quality={90}
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 md:right-6"
            >
              <ChevronRight className="h-6 w-6" strokeWidth={1.25} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
