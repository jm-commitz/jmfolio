import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, Medal, Trophy } from 'lucide-react';
import ProjectIcon from '@/components/projects/ProjectIcon';
import { projects, type Project } from '@/components/projects/projectsData';
import { achievements, type Achievement } from '@/components/achievements/achievementsData';
import FeaturedCarousel from './FeaturedCarousel';
import { DynamicIsland, IPhone, MacBook } from '@/components/projects/DeviceFrame';

// Top of the center column: a carousel with one big card per `featured`
// achievement, then per `featured` project, each ordered by its `featured`
// number: fanned phone screenshots (or a MacBook + iPhone for web projects),
// pitch, a few stats and a link in.
export default function FeaturedProject() {
  const byOrder = (a: { featured?: number }, b: { featured?: number }) =>
    (a.featured ?? 0) - (b.featured ?? 0);
  const wins = achievements.filter((a) => a.featured).sort(byOrder);
  const featured = projects.filter((p) => p.featured).sort(byOrder);
  if (!wins.length && !featured.length) return null;

  return (
    <section data-tour="featured" className="px-5 pt-8 lg:pt-20">
      <FeaturedCarousel>
        {wins.map((item) => (
          <AchievementCard key={item.id} item={item} />
        ))}
        {featured.map((project) => (
          <FeaturedCard key={project.slug} project={project} />
        ))}
      </FeaturedCarousel>
    </section>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  const pitch = project.description?.split(/(?<=\.)\s/)[0];
  const stats = project.caseStudy?.numbers?.slice(0, 3) ?? [];

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-say={`Read the ${project.title} case study →`}
      className="group grid h-full overflow-hidden rounded-2xl border transition-colors hover:bg-[var(--accent)] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
    >
      {project.galleryVariant === 'devices' ? (
        <DeviceStage project={project} />
      ) : (
        <FannedPhones project={project} />
      )}

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


// An achievement slide: the proof on the left (a site screenshot in a MacBook,
// or the certificate as a sheet of paper), what it was for on the right.
// Links to the project's case study when there is one, else to the proof.
function AchievementCard({ item }: { item: Achievement }) {
  const Icon = item.kind === 'award' ? Trophy : Medal;
  const href = item.projectSlug ? `/projects/${item.projectSlug}` : item.href;
  if (!href) return null;
  const external = href.startsWith('http');
  const cta = item.projectSlug ? 'Read case study' : (item.hrefLabel ?? 'View');
  const className =
    'group grid h-full overflow-hidden rounded-2xl border transition-colors hover:bg-[var(--accent)] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]';

  const body = (
    <>
      <div className="relative h-60 overflow-hidden bg-[var(--muted)] sm:h-auto sm:min-h-[280px]">
        {item.imageVariant === 'paper' ? (
          <div className="absolute inset-x-[9%] top-1/2 -translate-y-1/2 -rotate-3 overflow-hidden rounded-md shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[54%] group-hover:rotate-0 group-hover:scale-[1.03]">
            <Image
              src={item.image}
              alt={`${item.title} certificate`}
              width={1754}
              height={1241}
              sizes="(min-width: 1024px) 360px, 80vw"
              className="h-auto w-full"
            />
          </div>
        ) : (
          <div className="absolute inset-x-[10%] top-1/2 -translate-y-[56%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[60%]">
            <MacBook src={item.image} sizes="(min-width: 1024px) 360px, 70vw" />
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border bg-[var(--background)] px-2.5 py-1 text-[11px] font-semibold text-[var(--foreground)] shadow-sm">
          <Icon className="h-3.5 w-3.5" />
          {item.kind === 'award' ? 'Award' : 'Hackathon'}
        </span>
      </div>

      <div className="flex flex-col p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[22%] border bg-[var(--muted)] text-[var(--foreground)]">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold tracking-tight text-[var(--foreground)]">
              {item.title}
            </p>
            <p className="truncate text-xs text-[var(--muted-foreground)]">
              {item.issuer} · {item.date}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {item.description}
        </p>

        {item.facts && item.facts.length > 0 && (
          <dl className="mt-4 grid grid-cols-3 gap-2">
            {item.facts.slice(0, 3).map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                  {f.value}
                </dd>
                <dd className="line-clamp-2 text-[11px] leading-tight text-[var(--muted-foreground)]">
                  {f.label}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-[var(--foreground)]">
          {cta}
          {external ? (
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </span>
      </div>
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noreferrer" data-say={`${cta} ↗`} className={className}>
      {body}
    </a>
  ) : (
    <Link href={href} data-say={`${cta} →`} className={className}>
      {body}
    </Link>
  );
}


// Phone apps: three screenshots fanned out; they spread a little on hover.
function FannedPhones({ project }: { project: Project }) {
  const shots = (project.gallery ?? [project.image]).slice(0, 3);
  return (
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
  );
}

// Web projects: a MacBook showing the desktop site with an iPhone in front.
// On hover the MacBook lifts slightly and the iPhone slides out and tilts.
function DeviceStage({ project }: { project: Project }) {
  const desktop = project.gallery?.[0] ?? project.image;
  const mobile = project.mobileGallery?.[0];
  return (
    <div className="relative h-60 overflow-hidden bg-[var(--muted)] sm:h-auto sm:min-h-[280px]">
      <div className="absolute left-[7%] right-[16%] top-1/2 -translate-y-[56%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[60%]">
        <MacBook src={desktop} sizes="(min-width: 1024px) 360px, 70vw" />
      </div>
      {mobile && (
        <div className="absolute bottom-[7%] right-[6%] w-[22%] max-w-[92px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[6%] group-hover:translate-x-[6%] group-hover:rotate-[4deg]">
          <IPhone src={mobile} sizes="92px" liveIsland />
        </div>
      )}
    </div>
  );
}
