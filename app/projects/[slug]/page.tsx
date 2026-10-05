import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import ProjectIcon from '@/components/projects/ProjectIcon';
import ProjectGallery from '@/components/projects/ProjectGallery';
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const isLive = project.href?.startsWith('http');

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 lg:py-10">
      <ProjectGallery
        title={project.title}
        image={project.image}
        video={project.video}
        gallery={project.gallery}
      />

      <div className="mt-8">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/#projects"
              aria-label="Back to projects"
              className="flex h-9 w-9 items-center justify-center rounded-full border text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-sm font-semibold text-[var(--foreground)]">
              Project Details
            </span>
          </div>

          <div className="mt-6 flex items-start gap-4">
            <ProjectIcon project={project} size={52} />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] lg:text-3xl">
                {project.title}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-[var(--muted-foreground)]">
                {[project.date, ...project.tags].filter(Boolean).map((item, i) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    {i > 0 && <span aria-hidden>·</span>}
                    {item}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {isLive && (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-90"
            >
              View Live
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}

          <hr className="my-6 border-[var(--border)]" />

          {project.description && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                About
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground)]">
                {project.description}
              </p>
            </section>
          )}

          {project.features && project.features.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                Features
              </h2>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {project.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 rounded-xl border p-3 text-sm leading-relaxed text-[var(--foreground)]"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
