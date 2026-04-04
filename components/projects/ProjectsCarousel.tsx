'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type CarouselProject = {
  slug: string;
  name: string;
  year: string;
  img: string;
};

type ProjectsCarouselProps = {
  projects: CarouselProject[];
};

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: true,
    skipSnaps: false,
    // Lets the first/last snap sit in the true center (with loop + slide width < viewport)
    containScroll: false,
  });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  if (projects.length === 0) return null;

  return (
    <section className="relative w-full">
      {/* Thumbnails + arrows — centered */}
      <div className="mx-auto mb-8 hidden w-full max-w-[1600px] flex-col items-center gap-6 px-4 sm:px-6 md:mb-10 md:flex md:flex-col lg:px-10">
        <div
          className="flex max-w-full flex-wrap justify-center gap-2 pb-3"
          role="tablist"
          aria-label="Project thumbnails"
        >
          {projects.map((project, i) => (
            <button
              key={project.slug}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={`Show ${project.name}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className="group/thumb relative shrink-0"
            >
              <span
                className={`block overflow-hidden bg-[var(--fg2)]/15 transition-opacity ${
                  i === selected ? 'opacity-100' : 'opacity-35 hover:opacity-70'
                }`}
              >
                <img
                  src={project.img}
                  alt=""
                  className="aspect-[4/3] h-12 w-16 object-cover sm:h-14 sm:w-[4.5rem]"
                />
              </span>
              <span
                className={`absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--primary)] transition-opacity duration-200 ${
                  i === selected ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex shrink-0 justify-center gap-0 border border-[var(--fg2)]/20">
          <button
            type="button"
            aria-label="Previous project"
            onClick={scrollPrev}
            className="flex h-10 w-10 items-center justify-center text-[var(--fg)] transition-colors hover:bg-[var(--fg2)]/10 hover:text-[var(--primary)] md:h-11 md:w-11"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
          </button>
          <span className="w-px bg-[var(--fg2)]/20" aria-hidden />
          <button
            type="button"
            aria-label="Next project"
            onClick={scrollNext}
            className="flex h-10 w-10 items-center justify-center text-[var(--fg)] transition-colors hover:bg-[var(--fg2)]/10 hover:text-[var(--primary)] md:h-11 md:w-11"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>
      </div>

      {/* Full-bleed carousel */}
      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y [-webkit-tap-highlight-color:transparent]">
            {projects.map((project) => (
              <div
                key={project.slug}
                className="min-w-0 shrink-0 grow-0 basis-[min(92vw,1200px)] pl-3 sm:basis-[min(90vw,1280px)] sm:pl-4 md:basis-[min(88vw,1380px)] md:pl-5 lg:basis-[min(86vw,1500px)] lg:pl-6"
              >
                <Link
                  href={`/projects/${project.slug}`}
                  aria-label={`Open project: ${project.name}`}
                  className="group block cursor-view-project focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                >
                  <div className="relative block aspect-video w-full overflow-hidden bg-[var(--fg2)]/10 md:aspect-auto md:min-h-[min(68vh,720px)]">
                    <img
                      src={project.img}
                      alt={project.name}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-black/[0.06]" />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-6 px-1 sm:mt-6 md:px-2">
                    <span className="font-[family-name:var(--M)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--fg2)] sm:text-[0.65rem]">
                      [{project.year}]
                    </span>
                    <h2 className="max-w-[70%] text-right font-[family-name:var(--D)] text-[clamp(0.8rem,2.2vw,1.15rem)] uppercase leading-tight tracking-tight text-[var(--fg)] transition-colors group-hover:text-[var(--primary)]">
                      {project.name}
                    </h2>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
