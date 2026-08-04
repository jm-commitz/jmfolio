import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ProjectIcon from './ProjectIcon';
import type { Project } from './projectsData';

export default function ProjectRow({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex w-full items-start gap-3 rounded-xl px-5 py-3 text-left transition-colors hover:bg-[var(--accent)]"
    >
      <ProjectIcon project={project} size={44} interactive className="mt-0.5" />

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[15px] font-semibold text-[var(--foreground)]">
            {project.title}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100" />
        </span>

        {project.tags.length > 0 && (
          <span className="mt-1 flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-2 py-0.5 text-[10px] leading-4 text-[var(--muted-foreground)]"
              >
                {tag}
              </span>
            ))}
          </span>
        )}

        {project.description && (
          <span className="mt-1.5 block text-[13px] leading-relaxed text-[var(--muted-foreground)]">
            {project.description}
          </span>
        )}
      </span>
    </Link>
  );
}
