'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Project } from './projectsData';

export default function ProjectTile({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  // Only enable play + color on devices that truly support hover (skip touch).
  const canHover = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover)').matches;

  const handleEnter = () => {
    if (!canHover()) return;
    setActive(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleLeave = () => {
    setActive(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0.1; // back to the paused first frame
    }
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      aria-label={`Open ${project.title}`}
      className="group relative aspect-square overflow-hidden bg-[var(--muted)]"
    >
      {project.video ? (
        <video
          ref={videoRef}
          // #t=0.1 seeks to the first frame so the paused video shows a poster
          src={`${project.video}#t=0.1`}
          poster={project.image}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
            active ? '' : 'grayscale'
          }`}
        />
      ) : (
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 33vw, 220px"
          className={`object-cover transition duration-300 group-hover:scale-105 ${
            active ? '' : 'grayscale'
          }`}
        />
      )}
    </button>
  );
}
