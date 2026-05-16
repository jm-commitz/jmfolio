'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ChevronLeft,
  ChevronRight,
  GalleryHorizontal,
  Columns2,
  LayoutGrid,
  ListFilter,
} from 'lucide-react';
import { useInView } from 'framer-motion';

export type ShowcaseProject = {
  slug: string;
  name: string;
  year: string;
  img: string;
  video?: string;
  category: string;
};

type ProjectsPageShowcaseProps = {
  projects: ShowcaseProject[];
};

export type LayoutMode = 'carousel' | 'grid-2' | 'grid-3';

const gridItemLayoutTransition = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 38,
  mass: 0.85,
};

function LayoutToggleButtons({
  layout,
  onChange,
}: {
  layout: LayoutMode;
  onChange: (m: LayoutMode) => void;
}) {
  const item = (mode: LayoutMode, label: string, Icon: typeof GalleryHorizontal) => (
    <button
      key={mode}
      type="button"
      aria-pressed={layout === mode}
      aria-label={label}
      onClick={() => onChange(mode)}
      className={`flex h-8 w-8 items-center justify-center transition-colors md:h-9 md:w-9 ${
        layout === mode
          ? 'bg-[var(--primary)] text-white'
          : 'bg-[var(--bg2)]/70 text-[var(--fg)] hover:bg-[var(--bg2)]'
      }`}
    >
      <Icon className="h-[14px] w-[14px] md:h-4 md:w-4" strokeWidth={1.75} />
    </button>
  );

  return (
    <div className="flex shrink-0 justify-center gap-0.5 md:justify-end" role="group" aria-label="Project layout">
      {item('carousel', 'Carousel layout', GalleryHorizontal)}
      {item('grid-2', 'Two column grid', Columns2)}
      <div className="hidden lg:contents">
        {item('grid-3', 'Three column grid', LayoutGrid)}
      </div>
    </div>
  );
}

function CategoryFilterDropdown({
  value,
  onChange,
  categories,
}: {
  value: string;
  onChange: (category: string) => void;
  categories: string[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const label =
    value === 'all'
      ? 'All categories'
      : categories.includes(value)
        ? value
        : 'All categories';

  return (
    <div ref={rootRef} className="relative shrink-0 justify-self-start">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Filter by category. Current: ${label}`}
        onClick={() => setOpen((o) => !o)}
        className={`relative flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--primary)] text-white transition-[filter] hover:brightness-110 md:h-9 md:w-9 ${
          open ? 'brightness-110' : ''
        }`}
      >
        <ListFilter className="h-[14px] w-[14px] md:h-4 md:w-4" strokeWidth={1.75} aria-hidden />
        {value !== 'all' && (
          <span
            className="absolute right-0.5 top-0.5 h-1 w-1 rounded-full bg-white shadow-sm ring-1 ring-[var(--primary)]"
            aria-hidden
          />
        )}
      </button>
      {open && (
        <ul
          className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-[min(50vh,280px)] min-w-[12rem] overflow-y-auto border-2 border-[var(--primary)] bg-[var(--bg)] py-1 shadow-xl shadow-black/35"
          role="listbox"
        >
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={value === 'all'}
              className={`w-full px-3 py-2.5 text-left font-[family-name:var(--M)] text-[0.62rem] uppercase tracking-[0.1em] transition-colors hover:bg-[var(--bg2)] ${
                value === 'all' ? 'text-[var(--primary)]' : 'text-[var(--fg2)]'
              }`}
              onClick={() => {
                onChange('all');
                setOpen(false);
              }}
            >
              All categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === cat}
                className={`w-full px-3 py-2.5 text-left font-[family-name:var(--M)] text-[0.62rem] uppercase tracking-[0.08em] transition-colors hover:bg-[var(--bg2)] ${
                  value === cat ? 'text-[var(--primary)]' : 'text-[var(--fg2)]'
                }`}
                onClick={() => {
                  onChange(cat);
                  setOpen(false);
                }}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CarouselThumbnailStrip({
  projects,
  selected,
  scrollTo,
  indicatorLayoutId,
}: {
  projects: ShowcaseProject[];
  selected: number;
  scrollTo: (i: number) => void;
  indicatorLayoutId: string;
}) {
  return (
    <div className="mx-auto flex w-max max-w-full flex-nowrap justify-center gap-x-1.5 px-0.5 sm:gap-x-2 md:mx-auto md:justify-center">
      {projects.map((p, i) => (
        <div
          key={p.slug}
          role="button"
          tabIndex={0}
          aria-label={p.name}
          aria-selected={i === selected}
          onMouseEnter={() => scrollTo(i)}
          onFocus={() => scrollTo(i)}
          onClick={() => scrollTo(i)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              scrollTo(i);
            }
          }}
          className="group flex w-11 shrink-0 cursor-pointer flex-col items-center gap-0.5 sm:w-12"
        >
          <div
            className={`relative h-7 w-full overflow-hidden bg-[var(--fg2)]/15 transition-all duration-500 sm:h-8 ${
              selected === i ? 'opacity-100 grayscale-0' : 'opacity-60 grayscale group-hover:opacity-100'
            }`}
          >
            <Image src={p.img} alt={p.name} fill className="object-cover object-center" sizes="48px" />
          </div>
          <div className="flex h-2 w-full items-center justify-center" aria-hidden>
            {selected === i && (
              <motion.div
                layoutId={indicatorLayoutId}
                className="h-1.5 w-1.5 bg-[var(--primary)]"
                transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 1 }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function GridProjectCard({ project }: { project: ShowcaseProject }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isInView = useInView(ref, { margin: "-20% 0px" });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isInView) videoRef.current.play().catch(()=>{});
      else videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <motion.article
      layout
      className="min-w-0"
      transition={{ layout: gridItemLayoutTransition }}
    >
      <Link
        href={`/projects/${project.slug}`}
        ref={ref}
        className="group block cursor-view-project focus:outline-none focus-visible:[&_img]:brightness-110"
      >
        <div className={`relative aspect-video w-full overflow-hidden bg-[var(--fg2)]/10 transition-all duration-500 ${isInView ? 'grayscale-0' : 'grayscale'}`}>
          {project.video ? (
            <video
              ref={videoRef}
              src={project.video}
              poster={project.img}
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <Image
              src={project.img}
              alt={project.name}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-black/[0.06]" />
        </div>
        <div className="flex items-baseline justify-between gap-4 px-4 py-3 font-[family-name:var(--M)] text-[0.62rem] uppercase tracking-[0.2em] text-[var(--fg2)] max-md:items-center max-md:text-[0.65rem] sm:text-[0.65rem] md:mt-4 md:px-0 md:py-0">
          <span className="min-w-0 text-[var(--fg)] transition-colors group-hover:text-[var(--primary)]">
            {project.name}
          </span>
          <span className="shrink-0 tabular-nums text-[var(--fg)]">{project.year}</span>
        </div>
      </Link>
    </motion.article>
  );
}

function CarouselProjectCard({ project, isActive }: { project: ShowcaseProject; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) videoRef.current.play().catch(()=>{});
      else videoRef.current.pause();
    }
  }, [isActive]);

  return (
    <figure className="m-0">
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`View project: ${project.name}`}
        className="relative block cursor-view-project focus:outline-none focus-visible:[&_img]:brightness-110"
      >
        <div className={`relative block aspect-video w-full overflow-hidden bg-[var(--fg2)]/10 md:aspect-auto md:min-h-[min(68vh,720px)] transition-all duration-500 ${isActive ? 'grayscale-0' : 'grayscale'}`}>
          {project.video ? (
            <video
              ref={videoRef}
              src={project.video}
              poster={project.img}
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <Image
              src={project.img}
              alt={project.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 92vw, (max-width: 1280px) 88vw, 86vw"
              priority={false}
              loading="lazy"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-black/[0.06]" />
        </div>
      </Link>
      <figcaption className="mt-5 flex items-baseline justify-between gap-6 px-1 font-[family-name:var(--M)] text-[0.62rem] uppercase tracking-[0.2em] text-[var(--fg2)] sm:mt-6 sm:text-[0.65rem] md:px-2 md:text-xs">
        <Link
          href={`/projects/${project.slug}`}
          className={`min-w-0 text-left no-underline transition-colors focus:outline-none focus-visible:underline hover:text-[var(--primary)] ${isActive ? 'text-[var(--primary)]' : 'text-[var(--fg2)]'}`}
        >
          {project.name}
        </Link>
        <span className="shrink-0 tabular-nums text-[var(--fg)]">{project.year}</span>
      </figcaption>
    </figure>
  );
}

function ShowcaseGridView({
  projects,
  columns,
}: {
  projects: ShowcaseProject[];
  columns: 2 | 3;
}) {
  const gridClass =
    columns === 2
      ? 'grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2'
      : 'grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3';

  if (projects.length === 0) {
    return (
      <p className="py-16 text-center font-[family-name:var(--M)] text-[0.75rem] uppercase tracking-[0.15em] text-[var(--fg2)]">
        No projects match this filter.
      </p>
    );
  }

  return (
    <div className={`w-full ${gridClass}`}>
      {projects.map((project) => (
        <GridProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}

function ShowcaseCarouselView({
  projects,
  onLayoutChange,
  categoryFilter,
  onCategoryFilterChange,
  categoryOptions,
}: {
  projects: ShowcaseProject[];
  onLayoutChange: (m: LayoutMode) => void;
  categoryFilter: string;
  onCategoryFilterChange: (c: string) => void;
  categoryOptions: string[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: true,
    skipSnaps: false,
    containScroll: false,
  });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const scrollTo = useCallback(
    (i: number) => {
      emblaApi?.scrollTo(i);
    },
    [emblaApi]
  );

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

  useEffect(() => {
    setSelected(0);
    emblaApi?.scrollTo(0, true);
    emblaApi?.reInit();
  }, [emblaApi, projects]);

  const empty = projects.length === 0;

  return (
    <>
      <div className="relative z-20 mb-8 grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-4 md:mb-10 md:grid-cols-[minmax(0,auto)_minmax(0,1fr)_minmax(0,auto)] md:items-start md:gap-y-4 md:gap-x-6">
        <div className="col-start-1 row-start-1 justify-self-start">
          <CategoryFilterDropdown
            value={categoryFilter}
            onChange={onCategoryFilterChange}
            categories={categoryOptions}
          />
        </div>

        <div className="scrollbar-hide col-span-2 row-start-2 min-w-0 justify-self-center overflow-x-auto pb-1 md:col-span-1 md:col-start-2 md:row-start-1 md:max-w-full">
          {empty ? (
            <p className="py-2 text-center font-[family-name:var(--M)] text-[0.65rem] uppercase tracking-[0.12em] text-[var(--fg2)] md:py-0">
              No matches
            </p>
          ) : (
            <div className="hidden min-w-0 lg:block">
              <CarouselThumbnailStrip
                projects={projects}
                selected={selected}
                scrollTo={scrollTo}
                indicatorLayoutId="projects-carousel-indicator-lg"
              />
            </div>
          )}
        </div>

        <div className="col-start-2 row-start-1 justify-self-end md:col-start-3 md:row-start-1">
          <LayoutToggleButtons layout="carousel" onChange={onLayoutChange} />
        </div>
      </div>

      {!empty && (
        <div className="relative z-0 left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
          <button
            type="button"
            aria-label="Previous project"
            onClick={scrollPrev}
            className="absolute left-2 top-[min(22vw,28dvh,200px)] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-white/10 text-[var(--primary)] shadow-md shadow-black/25 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50 md:left-4 md:top-[min(34vh,360px)] md:h-12 md:w-12"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={1.25} />
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={scrollNext}
            className="absolute right-2 top-[min(22vw,28dvh,200px)] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-white/10 text-[var(--primary)] shadow-md shadow-black/25 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50 md:right-4 md:top-[min(34vh,360px)] md:h-12 md:w-12"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={1.25} />
          </button>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y [-webkit-tap-highlight-color:transparent]">
              {projects.map((project, i) => (
                <div
                  key={project.slug}
                  className="min-w-0 shrink-0 grow-0 basis-[min(92vw,1200px)] pl-3 sm:basis-[min(90vw,1280px)] sm:pl-4 md:basis-[min(88vw,1380px)] md:pl-5 lg:basis-[min(86vw,1500px)] lg:pl-6"
                >
                  <CarouselProjectCard project={project} isActive={selected === i} />
                </div>
              ))}
            </div>
          </div>
          <nav
            className="scrollbar-hide mt-3 overflow-x-auto px-6 pb-0.5 sm:mt-4 md:px-10 md:pb-1 lg:hidden"
            aria-label="Projects in carousel"
          >
            <CarouselThumbnailStrip
              projects={projects}
              selected={selected}
              scrollTo={scrollTo}
              indicatorLayoutId="projects-carousel-indicator-sm"
            />
          </nav>
        </div>
      )}
    </>
  );
}

/** Tailwind `md` — below this width, layout snaps to carousel when the viewport changes. */
const MD_MIN_WIDTH = 768;
/** Tailwind `lg` — three-column grid toggle only from this width up. */
const LG_MIN_WIDTH = 1024;

export default function ProjectsPageShowcase({ projects }: ProjectsPageShowcaseProps) {
  const [layout, setLayout] = useState<LayoutMode>('carousel');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MD_MIN_WIDTH - 1}px)`);
    const snapCarouselOnMobile = () => {
      if (mql.matches) setLayout('carousel');
    };
    snapCarouselOnMobile();
    mql.addEventListener('change', snapCarouselOnMobile);
    return () => mql.removeEventListener('change', snapCarouselOnMobile);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${LG_MIN_WIDTH - 1}px)`);
    const snapGrid2BelowLg = () => {
      if (mql.matches) setLayout((prev) => (prev === 'grid-3' ? 'grid-2' : prev));
    };
    snapGrid2BelowLg();
    mql.addEventListener('change', snapGrid2BelowLg);
    return () => mql.removeEventListener('change', snapGrid2BelowLg);
  }, []);

  const categoryOptions = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => s.add(p.category));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return projects;
    return projects.filter((p) => p.category === categoryFilter);
  }, [projects, categoryFilter]);

  if (projects.length === 0) return null;

  return (
    <div className="mx-auto max-w-full overflow-visible px-6 md:px-10">
      <Breadcrumbs
        className="mb-6 md:mb-8"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Projects' },
        ]}
      />
      <div className="mb-10 min-w-0 space-y-4 md:mb-14 [container-type:inline-size]">
        <div className="-mb-1 flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.4em] text-[var(--primary)]">
          <span className="h-[2px] w-8 bg-[var(--primary)]" aria-hidden />
          SELECTED WORK
        </div>
        <h1 className="font-display max-w-full break-words text-4xl uppercase leading-[0.92] tracking-tighter text-[var(--fg)] sm:text-5xl md:text-6xl lg:text-[clamp(2.15rem,4.2cqi,3.75rem)] lg:leading-[0.92] xl:text-6xl xl:leading-none 2xl:text-7xl min-[1800px]:text-8xl">
          All <br className="max-sm:hidden" /> Projects
        </h1>
        <p className="max-w-full font-[family-name:var(--M)] text-[0.75rem] uppercase leading-relaxed tracking-[0.1em] text-[var(--fg2)] sm:max-w-xl lg:max-w-2xl">
          I build robust applications and dynamic interfaces designed to solve complex business problems. From scalable backends to intuitive frontends, every detail is engineered with intention.
        </p>
      </div>

      {layout === 'carousel' ? (
        <ShowcaseCarouselView
          projects={filtered}
          onLayoutChange={setLayout}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categoryOptions={categoryOptions}
        />
      ) : (
        <>
          <div className="relative z-20 mb-10 grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-4 md:mb-14 md:grid-cols-[minmax(0,auto)_minmax(0,1fr)_minmax(0,auto)] md:items-start md:gap-y-4 md:gap-x-6">
            <div className="col-start-1 row-start-1 justify-self-start">
              <CategoryFilterDropdown
                value={categoryFilter}
                onChange={setCategoryFilter}
                categories={categoryOptions}
              />
            </div>
            <p className="col-span-2 hidden justify-self-center text-center font-[family-name:var(--M)] text-[0.62rem] uppercase tracking-[0.2em] text-[var(--fg2)] md:col-span-1 md:col-start-2 md:row-start-1 md:block md:py-1 md:text-[0.65rem]">
              {filtered.length} project{filtered.length === 1 ? '' : 's'}
            </p>
            <div className="col-start-2 row-start-1 justify-self-end md:col-start-3 md:row-start-1">
              <LayoutToggleButtons layout={layout} onChange={setLayout} />
            </div>
          </div>
          <ShowcaseGridView projects={filtered} columns={layout === 'grid-2' ? 2 : 3} />
        </>
      )}
    </div>
  );
}
