import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import ProjectIcon from '@/components/projects/ProjectIcon';
import { projects, type Project } from '@/components/projects/projectsData';
import FeaturedCarousel from './FeaturedCarousel';

// Top of the center column: a carousel with one big card per `featured`
// project, ordered by its `featured` number: fanned phone screenshots, pitch,
// a few case-study stats and a link to the case study.
export default function FeaturedProject() {
  const featured = projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
  if (!featured.length) return null;

  return (
    <section data-tour="featured" className="px-5 pt-8 lg:pt-20">
      <FeaturedCarousel>
        {featured.map((project) => (
          <FeaturedCard key={project.slug} project={project} />
        ))}
      </FeaturedCarousel>
    </section>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  const pitch = project.description?.split(/(?<=\.)\s/)[0];
  const shots = (project.gallery ?? [project.image]).slice(0, 3);
  const stats = project.caseStudy?.numbers?.slice(0, 3) ?? [];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid h-full overflow-hidden rounded-2xl border transition-colors hover:bg-[var(--accent)] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
    >
      {/* Fanned screenshots */}
      <div className="relative flex h-60 items-end justify-center overflow-hidden bg-[var(--muted)] sm:h-auto sm:min-h-[280px]">
        <div className="absolute inset-0 flex items-end justify-center">
          {shots.map((src, i) => {
            const offset = i - (shots.length - 1) / 2;
            return (
              // Fanned by default; on card hover the shots spread apart, tilt a
              // little further and lift (via --o, the shot's offset from center).
              <div
                key={src}
                className="absolute bottom-[-12%] aspect-[912/2016] w-[30%] max-w-[130px] overflow-hidden rounded-[18px] border-[3px] border-[var(--background)] shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transform:translateX(calc(var(--o)*72%))_rotate(calc(var(--o)*8deg))] group-hover:[transform:translateX(calc(var(--o)*88%))_translateY(calc(-8px_+_var(--a)*3px))_rotate(calc(var(--o)*10deg))]"
                style={
                  {
                    '--o': offset,
                    '--a': Math.abs(offset),
                    zIndex: 10 - Math.abs(offset),
                  } as CSSProperties
                }
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="130px"
                  unoptimized={src.endsWith('.svg')}
                  className="object-cover"
                />
                {offset >= 0 && <DynamicIsland live={offset === 0} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col p-5">
        <div className="flex items-center gap-3">
          <ProjectIcon project={project} size={44} rounded="rounded-[22%]" />
          <div className="min-w-0">
            <p className="truncate text-lg font-bold tracking-tight text-[var(--foreground)]">
              {project.title}
            </p>
            <p className="truncate text-xs text-[var(--muted-foreground)]">
              {project.tags.join(' · ')}
            </p>
          </div>
        </div>

        {pitch && (
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{pitch}</p>
        )}

        {stats.length > 0 && (
          <dl className="mt-4 grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                  {s.value}
                </dd>
                <dd className="line-clamp-2 text-[11px] leading-tight text-[var(--muted-foreground)]">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-[var(--foreground)]">
          Read case study
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

// iPhone-style Dynamic Island drawn over a screenshot. The `live` one (front
// phone) stretches into a Live Activity with a pulsing dot on card hover.
function DynamicIsland({ live }: { live: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute left-1/2 top-[2.2%] z-10 flex h-[4.4%] w-[34%] -translate-x-1/2 items-center justify-end rounded-full bg-black px-[3.5%] shadow-[0_1px_2px_rgba(0,0,0,0.4)] ${
        live
          ? 'transition-[width] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:w-[60%]'
          : ''
      }`}
    >
      {live && (
        <span className="absolute left-[9%] flex aspect-square h-[42%] opacity-0 transition-opacity delay-150 duration-300 group-hover:opacity-100">
          <span className="h-full w-full animate-pulse rounded-full bg-[#30d158]" />
        </span>
      )}
      {/* Front camera */}
      <span className="aspect-square h-[46%] rounded-full bg-[#14141f] ring-1 ring-white/10" />
    </span>
  );
}
