'use client';
import React, { useState, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { projects } from './projectsData';

const TOP = 3;
const featured = projects.slice(0, TOP);

const IO_THRESHOLDS = Array.from({ length: 41 }, (_, i) => i / 40);

export default function FeaturedProjects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const ratiosRef = useRef<number[]>(featured.map(() => 0));
  const figureRefs = useRef<(HTMLElement | null)[]>([]);

  useLayoutEffect(() => {
    const nodes = figureRefs.current.filter(Boolean) as HTMLElement[];
    if (nodes.length === 0) return;

    ratiosRef.current = featured.map(() => 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const i = Number((entry.target as HTMLElement).dataset.featureIndex);
          if (Number.isNaN(i)) return;
          ratiosRef.current[i] = entry.intersectionRatio;
        });
        const max = Math.max(...ratiosRef.current);
        if (max <= 0) return;
        const next = ratiosRef.current.indexOf(max);
        setActiveIndex((prev) => (prev === next ? prev : next));
      },
      {
        threshold: IO_THRESHOLDS,
        root: null,
        rootMargin: '-14% 0px -22% 0px',
      }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [featured.length]);

  const scrollToFigure = (i: number) => {
    figureRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div id="projects" className="max-w-full mx-auto overflow-visible px-6 md:px-10 py-24 md:py-32">
      <div className="grid min-w-0 grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-x-12 xl:gap-x-20 2xl:gap-x-24">
        <div className="max-lg:contents flex min-w-0 flex-col gap-10 overflow-x-hidden lg:sticky lg:top-28 lg:z-10 lg:h-fit lg:max-h-[calc(100dvh-7.5rem)] lg:overflow-y-auto lg:self-start lg:pr-1 lg:[scrollbar-gutter:stable]">
          <div className="order-1 min-w-0 space-y-4 [container-type:inline-size]">
            <div className="text-[0.62rem] text-[var(--primary)] uppercase tracking-[0.4em] font-bold -mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[var(--primary)]"></span> SELECTED WORK
            </div>
            <h2 className="max-w-full break-words font-[family-name:var(--D)] text-4xl leading-[0.92] uppercase tracking-tighter text-[var(--fg)] sm:text-5xl md:text-6xl lg:text-[clamp(2.15rem,4.2cqi,3.35rem)] lg:leading-[0.92] xl:text-6xl xl:leading-none 2xl:text-7xl min-[1800px]:text-8xl">
              Featured <br /> Work
            </h2>
            <p className="max-w-full text-[0.75rem] text-[var(--fg2)] font-[family-name:var(--M)] leading-relaxed uppercase tracking-[0.1em] sm:max-w-sm lg:max-w-[min(100%,18rem)] xl:max-w-xs">
              We build websites where every scroll, every transition, and every interaction feels intentional. The details most teams skip are the details we care about most.
            </p>
          </div>

          <div className="order-3 hidden flex-col gap-2 lg:order-2 lg:flex lg:gap-2">
            {featured.map((p, i) => (
              <div
                key={p.slug}
                role="button"
                tabIndex={0}
                aria-label={p.name}
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                onClick={() => scrollToFigure(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollToFigure(i);
                  }
                }}
                className="group cursor-pointer flex items-center gap-4 text-left sm:gap-5"
              >
                <div className="flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                  {activeIndex === i && (
                    <motion.div
                      layoutId="indicator"
                      className="h-full w-full bg-[var(--primary)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 1 }}
                    />
                  )}
                </div>
                <div
                  className={`relative h-11 w-[4.25rem] shrink-0 overflow-hidden bg-[var(--fg2)]/15 ring-1 ring-transparent transition-all duration-500 sm:h-12 sm:w-[4.75rem] ${
                    activeIndex === i
                      ? 'translate-x-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--bg)] sm:translate-x-4'
                      : 'opacity-60 group-hover:opacity-100'
                  }`}
                >
                  <img
                    src={p.img}
                    alt=""
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="order-4 pt-0 lg:order-3 lg:pt-4">
            <Link
              href="/projects"
              className="btn-y hover:!shadow-none px-5 py-2.5 text-[0.62rem] tracking-[0.08em] sm:px-7 sm:py-3 sm:text-[0.7rem] lg:px-5 lg:py-2.5 lg:text-[0.6rem] xl:px-9 xl:py-[0.85rem] xl:text-[0.75rem] xl:tracking-[0.1em] 2xl:px-11 2xl:py-[0.9rem]"
            >
              View More →
            </Link>
          </div>
        </div>

        <div className="order-2 flex min-w-0 flex-col gap-12 md:gap-16 lg:gap-20">
          {featured.map((p, i) => (
            <figure
              key={p.slug}
              ref={(el) => {
                figureRefs.current[i] = el;
              }}
              data-feature-index={i}
              style={{ scrollMarginTop: '6rem' }}
              className="m-0 overflow-hidden"
            >
              <Link
                href={`/projects/${p.slug}`}
                aria-label={`View project: ${p.name}`}
                className="relative block aspect-video w-full cursor-view-project bg-[var(--fg2)]/10 md:aspect-auto md:min-h-[min(68vh,720px)]"
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/[0.06]" />
              </Link>
              <figcaption className="flex items-center justify-between gap-4 px-4 py-3 font-[family-name:var(--M)] text-[0.65rem] uppercase tracking-[0.2em] text-[var(--fg2)] md:px-5 md:text-xs">
                <span className="min-w-0">{p.name}</span>
                <span className="shrink-0 tabular-nums text-[var(--fg)]">{p.year}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
