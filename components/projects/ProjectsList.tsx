'use client';

import { useMemo, useState } from 'react';
import ProjectRow from './ProjectRow';
import { projects } from './projectsData';

const ALL = 'All';
const STEP = 3;

export default function ProjectsList() {
  const [filter, setFilter] = useState<string>(ALL);
  const [visible, setVisible] = useState(STEP);

  // One chip per *primary* (first) tag. Every unique tag would mean 8 chips for
  // 5 projects; matching still tests the full tag list, so "SaaS" catches a
  // project tagged ['MVP', 'SaaS'] too.
  const chips = useMemo(
    () => [ALL, ...new Set(projects.map((p) => p.tags[0]).filter(Boolean))],
    []
  );

  const filtered = useMemo(
    () =>
      filter === ALL
        ? projects
        : projects.filter((p) => p.tags.includes(filter)),
    [filter]
  );

  return (
    <section id="projects" className="mx-auto w-full max-w-2xl scroll-mt-6 py-8">
      <div className="mb-3 flex items-baseline gap-2 px-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Projects
        </h2>
        <span className="text-[11px] text-[var(--muted-foreground)]">
          {projects.length}
        </span>
      </div>

      {/* Category chips */}
      <div className="mb-2 flex flex-wrap gap-1.5 px-5">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => {
              setFilter(chip);
              setVisible(STEP);
            }}
            aria-pressed={filter === chip}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              filter === chip
                ? 'border-[var(--foreground)] bg-[var(--foreground)] font-medium text-[var(--background)]'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="flex flex-col">
        {filtered.slice(0, visible).map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </div>

      {/* Reveals 3 at a time; disappears once everything is shown, so adding
          projects to projectsData needs no change here. */}
      {visible < filtered.length && (
        <div className="mt-2 px-5">
          <button
            type="button"
            onClick={() => setVisible((v) => v + STEP)}
            className="w-full rounded-xl border py-2.5 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
          >
            View more ({filtered.length - visible})
          </button>
        </div>
      )}
    </section>
  );
}
