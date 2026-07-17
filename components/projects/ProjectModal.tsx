'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import Post from './Post';
import DesktopPost from './DesktopPost';
import type { Project } from './projectsData';

export default function ProjectModal({
  projects,
  initialIndex,
  onClose,
}: {
  projects: Project[];
  initialIndex: number | null;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const open = initialIndex !== null;

  useEffect(() => {
    if (initialIndex === null) return;
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight')
        setIndex((i) => Math.min(i + 1, projects.length - 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);

    // Mobile feed: jump to the tapped post.
    const el = scrollRef.current?.querySelector<HTMLElement>(
      `#post-${initialIndex}`,
    );
    el?.scrollIntoView({ block: 'start' });

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, initialIndex, onClose, projects.length]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Projects"
    >
      {/* Close (desktop) */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 hidden text-white/80 transition hover:text-white lg:block"
      >
        <X className="h-7 w-7" />
      </button>

      {/* Mobile / tablet: Instagram-style scrollable feed */}
      <div
        className="flex h-full w-full max-w-md flex-col overflow-hidden bg-[var(--background)] sm:max-h-[90vh] sm:rounded-2xl sm:border lg:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center gap-4 border-b px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="text-[var(--foreground)] transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-base font-semibold text-[var(--foreground)]">
            Posts
          </span>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          {projects.map((project, i) => (
            <div id={`post-${i}`} key={project.title}>
              <Post project={project} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: wide two-panel post with prev/next */}
      <div
        className="hidden h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl border bg-[var(--background)] lg:flex"
        onClick={(e) => e.stopPropagation()}
      >
        <DesktopPost
          project={projects[index]}
          onPrev={() => setIndex((i) => Math.max(i - 1, 0))}
          onNext={() => setIndex((i) => Math.min(i + 1, projects.length - 1))}
          hasPrev={index > 0}
          hasNext={index < projects.length - 1}
        />
      </div>
    </div>
  );
}
