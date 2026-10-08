'use client';

import { useEffect, useMemo, useState } from 'react';
import CategoryDropdown from './CategoryDropdown';
import ProjectRow from './ProjectRow';
import { projects } from './projectsData';

const ALL = 'All';
const STEP = 3;

export default function ProjectsList() {
  const [filter, setFilter] = useState<string>(ALL);
  const [visible, setVisible] = useState(STEP);

  // Arriving via a '‹ Projects' back link (/#projects): scroll here, then drop
  // the hash so the address bar stays a clean '/'.
  useEffect(() => {
    if (window.location.hash !== '#projects') return;
    document.getElementById('projects')?.scrollIntoView({ block: 'start' });
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }, []);

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
    <section id="projects" className="mx-auto w-full max-w-2xl scroll-mt-6 py-8 lg:max-w-none lg:px-5 lg:pt-10">
      {/* Header row — category filter is a compact dropdown on the right */}
      <div data-tour="projects" className="mb-2 flex items-center justify-between gap-2 px-5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            Projects
          </h2>
          <span className="text-[11px] text-[var(--muted-foreground)]">
            {filtered.length}
          </span>
        </div>

        <CategoryDropdown
          options={chips}
          value={filter}
          onChange={(chip) => {
            setFilter(chip);
            setVisible(STEP);
          }}
        />
      </div>

      <div className="flex flex-col lg:gap-1">
        {filtered.slice(0, visible).map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </div>

      {/* Reveals 3 at a time; disappears once everything is shown, so adding
          projects to projectsData needs no change here. */}
      {visible < filtered.length && (
        <div className="mt-3 flex justify-center px-5">
          <button
            type="button"
            onClick={() => setVisible((v) => v + STEP)}
            data-say="Show more projects"
            className="rounded-full border px-5 py-2 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
          >
            View more ({filtered.length - visible})
          </button>
        </div>
      )}
    </section>
  );
}
