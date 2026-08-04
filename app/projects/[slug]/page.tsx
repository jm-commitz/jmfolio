import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
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
    <main className="mx-auto w-full max-w-2xl px-5 py-10">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to projects
      </Link>

      <div className="mt-6 flex items-start gap-3">
        <ProjectIcon project={project} size={56} />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
            {project.title}
          </h1>
          {project.date && (
            <p className="mt-0.5 text-[11px] uppercase tracking-widest text-[var(--muted-foreground)]">
              {project.date}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border px-2 py-0.5 text-[10px] leading-4 text-[var(--muted-foreground)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {project.description && (
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {project.description}
        </p>
      )}

      {isLive && (
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-90"
        >
          View Live
          <ArrowUpRight className="h-4 w-4" />
        </a>
      )}

      {project.features && project.features.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            Features
          </h2>
          <ul className="mt-2 space-y-1.5">
            {project.features.map((feature) => (
              <li
                key={feature}
                className="flex gap-2 text-sm leading-relaxed text-[var(--muted-foreground)]"
              >
                <span aria-hidden className="text-[var(--foreground)]">
                  ·
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}

      <ProjectGallery
        title={project.title}
        image={project.image}
        video={project.video}
        gallery={project.gallery}
      />
    </main>
  );
}
