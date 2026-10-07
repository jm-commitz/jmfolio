import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Check, Github, Globe, LayoutGrid, Smartphone, UserRound } from 'lucide-react';
import ProjectIcon from '@/components/projects/ProjectIcon';
import ProjectGallery from '@/components/projects/ProjectGallery';
import StickyAppBar from '@/components/projects/appstore/StickyAppBar';
import ShareButton from '@/components/projects/appstore/ShareButton';
import ExpandableText from '@/components/projects/appstore/ExpandableText';
import { getProjectBySlug, projects } from '@/components/projects/projectsData';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project not found' };

  const title = `${project.title} | Jaymark Ancheta`;
  const image = project.gallery?.[0] ?? project.image;

  return {
    title,
    description: project.description,
    openGraph: {
      title,
      description: project.description,
      url: `/projects/${project.slug}`,
      type: 'article',
      // SVG placeholders make poor OG cards; only ship raster art.
      images: image.endsWith('.svg') ? undefined : [image],
    },
  };
}

// App Store-style listing: header, info strip, screenshot preview,
// description, case study, information table and more projects.
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const isLive = Boolean(project.href?.startsWith('http'));
  const cs = project.caseStudy;
  const [category, ...platforms] = project.tags;
  const year = project.date?.match(/\d{4}/)?.[0];
  const phone = project.galleryVariant === 'phone';
  // App Store subtitle: the description's first sentence.
  const subtitle = project.description?.split(/(?<=\.)\s/)[0];
  const others = projects.filter((p) => p.slug !== project.slug);

  // iOS-style info strip under the header.
  const info: { label: string; value: ReactNode; caption: string }[] = [
    { label: 'Category', value: <LayoutGrid className="h-5 w-5" />, caption: category ?? 'App' },
    {
      label: 'Platform',
      value: phone ? <Smartphone className="h-5 w-5" /> : <Globe className="h-5 w-5" />,
      caption: platforms.length ? platforms.join(', ') : phone ? 'Mobile' : 'Web',
    },
    ...(year ? [{ label: 'Year', value: year, caption: 'Built' }] : []),
    { label: 'Developer', value: <UserRound className="h-5 w-5" />, caption: 'Jaymark' },
    ...(cs?.numbers?.slice(0, 3).map((n) => ({ label: 'Stat', value: n.value, caption: n.label })) ??
      []),
  ];

  return (
    <>
      <StickyAppBar
        watchId="app-header"
        compact={
          <>
            <ProjectIcon project={project} size={28} rounded="rounded-[22%]" />
            <span className="hidden max-w-[40vw] truncate text-sm font-semibold text-[var(--foreground)] sm:block">
              {project.title}
            </span>
            <ActionPill href={project.href} live={isLive} small />
          </>
        }
      />

      <main className="mx-auto w-full max-w-5xl px-5 pb-16">
        {/* App header */}
        <div id="app-header" className="flex gap-4 pt-4 sm:gap-7 sm:pt-8">
          <div className="flex sm:hidden">
            <ProjectIcon project={project} size={112} rounded="rounded-[22%]" />
          </div>
          <div className="hidden sm:flex">
            <ProjectIcon project={project} size={168} rounded="rounded-[22%]" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col py-0.5">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              {project.title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 line-clamp-2 text-sm text-[var(--muted-foreground)] sm:mt-1 sm:text-lg">
                {subtitle}
              </p>
            )}
            <p className="mt-1 text-xs text-[var(--muted-foreground)] sm:text-sm">Jaymark Ancheta</p>

            <div className="mt-auto flex items-center gap-2 pt-3">
              <ActionPill href={project.href} live={isLive} />
              <ShareButton title={project.title} />
            </div>
          </div>
        </div>

        {/* Info strip */}
        <div className="no-scrollbar -mx-5 mt-6 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <dl className="flex min-w-max divide-x border-y py-3 sm:min-w-0">
            {info.map((item, i) => (
              <div
                key={`${item.label}-${i}`}
                className="flex w-[108px] shrink-0 flex-col items-center px-2 text-center sm:w-auto sm:flex-1"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  {item.label}
                </dt>
                <dd className="mt-1 flex h-7 items-center text-xl font-bold text-[var(--foreground)]">
                  {item.value}
                </dd>
                <dd className="line-clamp-2 text-[11px] leading-tight text-[var(--muted-foreground)]">
                  {item.caption}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Section title="Preview" first>
          <ProjectGallery
            title={project.title}
            image={project.image}
            video={project.video}
            gallery={project.gallery}
            mobileGallery={project.mobileGallery}
            variant={project.galleryVariant}
          />
        </Section>

        {/* Open-source offer: visitors can take this project for themselves */}
        {project.sourceHref && (
          <Section>
            <div className="flex flex-col gap-4 rounded-2xl border bg-[var(--muted)] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-bold tracking-tight text-[var(--foreground)]">
                  Want a portfolio like this?
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  It’s open source. Fork it on GitHub, swap in your own projects and make it yours.
                </p>
              </div>
              <a
                href={project.sourceHref}
                data-say="Fork it on GitHub 🍴"
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-85"
              >
                <Github className="h-4 w-4" />
                Use this portfolio
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Section>
        )}

        {project.description && (
          <Section>
            <ExpandableText text={project.description} />
          </Section>
        )}

        {project.features && project.features.length > 0 && (
          <Section title="What's Included">
            <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-[15px] leading-snug text-[var(--foreground)]"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                  {feature}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {cs && (
          <>
            <Section title="The Problem">
              <p className="text-[15px] leading-relaxed text-[var(--foreground)]">{cs.problem}</p>
            </Section>

            {cs.numbers && cs.numbers.length > 0 && (
              <Section title="By the Numbers">
                <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {cs.numbers.map((stat) => (
                    <li key={stat.label}>
                      <p className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs leading-snug text-[var(--muted-foreground)] sm:text-sm">
                        {stat.label}
                      </p>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {cs.highlights.length > 0 && (
              <Section title="Under the Hood">
                <ol className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:scroll-px-0 sm:px-0">
                  {cs.highlights.map((item, i) => (
                    <li
                      key={item.title}
                      className="w-[290px] shrink-0 snap-start rounded-2xl bg-[var(--muted)] p-5 sm:w-[340px]"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                        Highlight {String(i + 1).padStart(2, '0')}
                      </p>
                      <p className="mt-1.5 text-[17px] font-bold leading-snug text-[var(--foreground)]">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ol>
              </Section>
            )}
          </>
        )}

        <Section title="Information">
          <dl className="divide-y text-sm">
            <InfoRow label="Developer" value="Jaymark Ancheta" />
            {category && <InfoRow label="Category" value={category} />}
            {platforms.length > 0 && <InfoRow label="Platform" value={platforms.join(', ')} />}
            {(cs?.timeline ?? project.date) && (
              <InfoRow label="Timeline" value={(cs?.timeline ?? project.date) as string} />
            )}
            {cs?.role && <InfoRow label="Role" value={cs.role} />}
            {project.sourceHref && (
              <div className="flex items-center justify-between gap-6 py-3">
                <dt className="text-[var(--muted-foreground)]">Source</dt>
                <dd>
                  <a
                    href={project.sourceHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-[var(--foreground)] hover:underline"
                  >
                    {project.sourceHref.replace(/^https?:\/\/(www\.)?/, '')}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </dd>
              </div>
            )}
            {isLive && project.href && (
              <div className="flex items-center justify-between gap-6 py-3">
                <dt className="text-[var(--muted-foreground)]">Website</dt>
                <dd>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-[var(--foreground)] hover:underline"
                  >
                    {project.href.replace(/^https?:\/\//, '')}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </dd>
              </div>
            )}
            {cs?.stack && cs.stack.length > 0 && (
              <div className="py-3">
                <dt className="text-[var(--muted-foreground)]">Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {cs.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border px-2.5 py-0.5 text-xs text-[var(--foreground)]"
                    >
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </Section>

        {others.length > 0 && (
          <Section title="More Projects">
            <ul className="no-scrollbar -mx-5 flex snap-x gap-x-6 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
              {others.map((p) => (
                <li key={p.slug} className="w-[260px] shrink-0 snap-start sm:w-auto">
                  <Link href={`/projects/${p.slug}`} className="group flex items-center gap-3 py-2.5">
                    <ProjectIcon project={p} size={60} rounded="rounded-[22%]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold text-[var(--foreground)] group-hover:underline">
                        {p.title}
                      </span>
                      <span className="block truncate text-xs text-[var(--muted-foreground)]">
                        {p.tags.join(' · ')}
                      </span>
                    </span>
                    <ActionPill href={p.href} live={Boolean(p.href?.startsWith('http'))} small asLabel />
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </main>
    </>
  );
}

function Section({
  title,
  first,
  children,
}: {
  title?: string;
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={first ? 'pt-6' : 'mt-6 border-t pt-6'}>
      {title && (
        <h2 className="mb-4 text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <dt className="shrink-0 text-[var(--muted-foreground)]">{label}</dt>
      <dd className="text-right text-[var(--foreground)]">{value}</dd>
    </div>
  );
}

// App Store "GET"-style pill: OPEN for live projects, a disabled SOON otherwise.
// `asLabel` renders a plain span (for use inside another link).
function ActionPill({
  href,
  live,
  small,
  asLabel,
}: {
  href?: string;
  live: boolean;
  small?: boolean;
  asLabel?: boolean;
}) {
  const size = small ? 'px-3.5 py-1 text-xs' : 'px-6 py-1.5 text-sm';
  const base = `shrink-0 rounded-full font-bold uppercase tracking-wide ${size}`;

  if (!live || !href) {
    return (
      <span
        aria-disabled
        title="Not publicly available yet"
        className={`${base} cursor-default bg-[var(--muted)] text-[var(--muted-foreground)]`}
      >
        Soon
      </span>
    );
  }

  const open = `${base} bg-[var(--foreground)] text-[var(--background)] transition-opacity hover:opacity-85`;
  if (asLabel) return <span className={open}>Open</span>;
  return (
    <a href={href} target="_blank" rel="noreferrer" className={open} data-say="Visit the live site ↗">
      Open
    </a>
  );
}
