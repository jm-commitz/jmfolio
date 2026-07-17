'use client';

import { useState } from 'react';
import ProjectTile from './ProjectTile';
import ProjectModal from './ProjectModal';
import { projects } from './projectsData';

function GridIcon({ n }: { n: number }) {
  return (
    <div
      className="grid gap-[2px]"
      style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
    >
      {Array.from({ length: n * n }).map((_, i) => (
        <span key={i} className="h-[3px] w-[3px] rounded-[1px] bg-current" />
      ))}
    </div>
  );
}

export default function ProjectsGrid() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [cols, setCols] = useState<2 | 3>(3);

  const colClass = cols === 3 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <section className="mx-auto w-full max-w-2xl py-8">
      <div className="mb-4 flex items-center justify-between px-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Projects
        </h2>

        {/* Layout switcher: 3 or 2 columns */}
        <div className="flex items-center gap-0.5 rounded-lg border p-0.5">
          {([3, 2] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCols(n)}
              aria-label={`${n} columns`}
              aria-pressed={cols === n}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                cols === n
                  ? 'bg-[var(--accent)] text-[var(--foreground)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <GridIcon n={n} />
            </button>
          ))}
        </div>
      </div>

      {/* Instagram-style grid: full-bleed with tiny gaps on mobile, padded on larger screens */}
      <div className={`grid ${colClass} gap-0.5 sm:gap-2 sm:px-5`}>
        {projects.map((project, i) => (
          <ProjectTile
            key={project.title}
            project={project}
            onOpen={() => setActiveIndex(i)}
          />
        ))}
      </div>

      <ProjectModal
        projects={projects}
        initialIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
      />
    </section>
  );
}
