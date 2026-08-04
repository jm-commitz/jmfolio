import Image from 'next/image';
import type { Project } from './projectsData';

/**
 * The rounded icon square used in the project list and on detail pages:
 * real `logo` file → Lucide `icon` on `iconBg` → the screenshot as a fallback.
 *
 * `interactive` adds the greyscale-until-hover treatment, which only makes
 * sense when an ancestor carries the `group` class (i.e. a list row).
 */
export default function ProjectIcon({
  project,
  size = 44,
  interactive = false,
  className = '',
}: {
  project: Project;
  size?: number;
  interactive?: boolean;
  className?: string;
}) {
  const box = { width: size, height: size };
  const glyph = Math.round(size * 0.5);
  const hover = interactive
    ? 'grayscale transition duration-300 group-hover:grayscale-0 group-hover:scale-105'
    : '';

  if (project.logo) {
    return (
      <span
        style={box}
        className={`relative shrink-0 overflow-hidden rounded-xl border border-black/5 ${className}`}
      >
        <Image
          src={project.logo}
          alt=""
          fill
          sizes={`${size}px`}
          // Next's optimizer rejects SVG without dangerouslyAllowSVG.
          unoptimized={project.logo.endsWith('.svg')}
          className={`object-cover ${hover}`}
        />
      </span>
    );
  }

  if (project.icon) {
    const Glyph = project.icon;
    return (
      <span
        style={{ ...box, backgroundColor: project.iconBg ?? 'var(--foreground)' }}
        className={`flex shrink-0 items-center justify-center rounded-xl border border-black/5 ${hover} ${className}`}
      >
        <Glyph
          style={{ width: glyph, height: glyph }}
          className="text-white"
          strokeWidth={2.1}
          aria-hidden
        />
      </span>
    );
  }

  return (
    <span
      style={box}
      className={`relative shrink-0 overflow-hidden rounded-xl border bg-[var(--muted)] ${className}`}
    >
      <Image
        src={project.image}
        alt=""
        fill
        sizes={`${size}px`}
        unoptimized={project.image.endsWith('.svg')}
        className={`object-cover ${hover}`}
      />
    </span>
  );
}
